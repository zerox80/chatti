import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import ts from "typescript";

// Load the real Worker handlers with only the hosting/auth boundary replaced.
// Production validation, citation cleaning and tool mutation code run unchanged.
const contextKey = Symbol.for("chatti-handler-test");
const context = {user: null, env: {DB: null}};
globalThis[contextKey] = context;
const cache = new Map();
function moduleUrl(relative) {
  const filename = new URL(relative, import.meta.url);
  if (cache.has(filename.href)) return cache.get(filename.href);
  let source = readFileSync(filename, "utf8");
  source = source.replace(/import \{ env \} from "cloudflare:workers";/g,
    'const {env} = globalThis[Symbol.for("chatti-handler-test")];');
  source = source.replace(/import \{ getChatGPTUser \} from "[^"]*chatgpt-auth";/g,
    'const getChatGPTUser = async () => globalThis[Symbol.for("chatti-handler-test")].user;');
  const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.ESNext}}).outputText
    .replace(/from "([^"]+)"/g, (_, specifier) => {
      const resolved = specifier.startsWith(".")
        ? moduleUrl(new URL(specifier + ".ts", filename).href)
        : import.meta.resolve(specifier);
      return `from ${JSON.stringify(resolved)}`;
    });
  const result = `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`;
  cache.set(filename.href, result);
  return result;
}
class TestD1 {
  rows = new Map();
  prepare(sql) {
    return {bind: (...args) => ({
      first: async () => this.rows.get(args[0]) ?? null,
      run: async () => {
        if (sql.startsWith("INSERT OR IGNORE")) {
          if (!this.rows.has(args[0])) this.rows.set(args[0], {payload:"[]",revision:0});
          return {meta:{changes:1}};
        }
        assert.ok(sql.startsWith("UPDATE libraries SET payload"));
        const [payload,userId,revision] = args;
        const row = this.rows.get(userId);
        if (!row || row.revision !== revision) return {meta:{changes:0}};
        this.rows.set(userId, {payload,revision:revision+1});
        return {meta:{changes:1}};
      },
    })};
  }
}
const library = await import(moduleUrl("../app/api/library/route.ts"));
const mcp = await import(moduleUrl("../app/mcp/route.ts"));
const {demoCourse} = await import(moduleUrl("../lib/demo.ts"));
function reset() {context.user={userId:"alice",email:"alice@example.test"};context.env.DB=new TestD1();}
const put = (courses, revision, origin="https://reader.example.test", base=[]) => library.PUT(new Request("https://reader.example.test/api/library", {
  method:"PUT",headers:{"Content-Type":"application/json",origin},body:JSON.stringify({courses,revision,base}),
}));
const tool = async (name, args={}) => (await mcp.POST(new Request("https://reader.example.test/mcp", {
  method:"POST",body:JSON.stringify({jsonrpc:"2.0",id:1,method:"tools/call",params:{name,arguments:args}}),
}))).json();

test("anonymous visitors cannot read or change a library or call MCP", async () => {
  reset();context.user=null;
  assert.equal((await library.GET()).status,401);
  assert.equal((await put([],0)).status,401);
  assert.equal((await mcp.POST(new Request("https://reader.example.test/mcp",{method:"POST",body:JSON.stringify({id:1,method:"tools/list"})}))).status,401);
  assert.equal(context.env.DB.rows.size,0);
});

test("each authenticated Site user has an isolated library", async () => {
  reset();assert.equal((await put([demoCourse()],0)).status,200);
  context.user={userId:"bob",email:"bob@example.test"};
  assert.deepEqual(await (await library.GET()).json(),{courses:null,revision:0});
  assert.equal((await put([],0)).status,200);
  context.user={userId:"alice",email:"alice@example.test"};
  const state=await (await library.GET()).json();
  assert.equal(state.courses.length,1);assert.equal(state.revision,1);
});

test("stale saves merge against current data and cross-origin requests are rejected", async () => {
  reset();await put([demoCourse()],0,undefined,[]);
  assert.equal((await put([],0)).status,200);
  assert.equal((await put([],1,"https://foreign.example.test")).status,403);
  const state=await (await library.GET()).json();
  assert.equal(state.courses.length,1);assert.equal(state.revision,2);
});

test("MCP writes retain notes, reading place, bookmark and progress", async () => {
  reset();const course=demoCourse(), lesson=course.modules[0].lessons[0];
  Object.assign(lesson,{note:"Meine Notiz",completed:true,bookmarked:true,resumeFrom:"Meine Sektion",resumeSavedAt:"2026-11-10T10:00:00.000Z"});
  await put([course],0);
  const response=await tool("save_lesson",{courseId:course.id,lessonId:lesson.id,content:"Eine neue verständliche Erklärung. ".repeat(10),quiz:[{question:"Frage?",options:["A","B","C","D"],correct:0,explanation:"Darum."}]});
  assert.equal(response.result.isError,undefined);
  const state=await (await library.GET()).json();
  const saved=state.courses[0].modules[0].lessons[0];
  for (const field of ["note","completed","bookmarked","resumeFrom","resumeSavedAt"]) assert.equal(saved[field],lesson[field]);
  assert.equal(state.revision,2);assert.notEqual(saved.content,lesson.content);
  context.user={userId:"bob",email:"bob@example.test"};
  assert.equal((await tool("read_lesson",{courseId:course.id,lessonId:lesson.id})).result.isError,true);
});

test("invalid library payload is rejected without a write", async () => {
  reset();assert.equal((await put([{title:"broken"}],0)).status,400);
  assert.equal(context.env.DB.rows.size,0);
});
