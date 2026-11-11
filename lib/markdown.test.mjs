import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {createElement} from "react";
import {renderToStaticMarkup} from "react-dom/server";
import ts from "typescript";

const source = readFileSync(new URL("../components/markdown.tsx", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {compilerOptions: {module:ts.ModuleKind.ESNext,jsx:ts.JsxEmit.ReactJSX}}).outputText
  .replace(/from "([^"]+)"/g, (_, specifier) => `from ${JSON.stringify(import.meta.resolve(specifier))}`);
const {Markdown,codeText} = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const render = text => renderToStaticMarkup(createElement(Markdown,{text}));
const textOfCode = html => html.match(/<pre[^>]*><code[^>]*>([\s\S]*?)<\/code><\/pre>/)[1]
  .replace(/<[^>]+>/g,"").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#x27;/g,"'").replace(/&amp;/g,"&");

test("copy text excludes highlighting markup and retains all spacing", () => {
  const highlighted = createElement("code",null,
    createElement("span",{className:"hljs-keyword"},"if"),
    " (x < 2) {\n\t",createElement("span",{className:"hljs-title"},"run"),"();  \n}\n");
  assert.equal(codeText(highlighted),"if (x < 2) {\n\trun();  \n}\n");
});

test("C code keeps indentation, blank lines, operators and trailing spaces", () => {
  const code = '#include <stdio.h>\n\nint main(void) {\n\tif (1 < 2) {  \n\t\tputs("hello");\n\t}\n}\n';
  const html = render('```c\n'+code+'```');
  assert.equal(textOfCode(html),code);
  assert.match(html,/hljs-keyword/);
  assert.match(html,/Code kopieren: C/);
});

test("tilde fences and unterminated fences remain code", () => {
  assert.equal(textOfCode(render('~~~python\nif True:\n    print("ok")\n~~~')), 'if True:\n    print("ok")\n');
  assert.equal(textOfCode(render('```bash\nprintf "%s" "$HOME"')), 'printf "%s" "$HOME"\n');
});

test("a longer outer fence can contain literal triple backticks", () => {
  const code = '```bash\necho ok\n```\n';
  assert.equal(textOfCode(render('````markdown\n'+code+'````')),code);
});

test("unknown languages and indented code render without losing characters", () => {
  assert.equal(textOfCode(render('```unknown-language\n<x> & y\n```')), '<x> & y\n');
  assert.equal(textOfCode(render('    first\n        nested\n')), 'first\n    nested\n');
});

test("PowerShell has highlighting and inline code stays outside pre", () => {
  const html = render('Nutze `Get-Process` und:\n\n```powershell\nGet-Process | Where-Object { $_.CPU -gt 10 }\n```');
  assert.match(html,/<p>Nutze <code>Get-Process<\/code>/);
  assert.match(html,/hljs-/);
  assert.equal(textOfCode(html),'Get-Process | Where-Object { $_.CPU -gt 10 }\n');
});

test("Markdown preserves adjacent paragraphs, nested lists and tables", () => {
  const html=render('## Abschnitt\nErklärung ohne Leerzeile.\n\n- Eins\n  - Zwei\n\n| Name | Wert |\n| --- | --- |\n| Code | `x` |');
  assert.match(html,/<h2>Abschnitt<\/h2>\s*<p>Erklärung ohne Leerzeile\.<\/p>/);
  assert.match(html,/<ul>\s*<li>Eins\s*<ul>/);
  assert.match(html,/<table>/);
});

test("raw HTML and executable links are not rendered as active content", () => {
  const html=render('<script>alert(1)</script>\n\n[bad](javascript:alert)\n\n```html\n<script>alert(1)</script>\n```');
  assert.doesNotMatch(html,/<script|href="javascript:/);
  assert.equal(textOfCode(html),'<script>alert(1)</script>\n');
});
