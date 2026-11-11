import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import ts from "typescript";

const source=readFileSync(new URL("./library-merge.ts",import.meta.url),"utf8");
const compiled=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {mergeLibrary}=await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const lesson=(id,extra={})=>({id,title:id,goal:"",content:"",quiz:[],completed:false,bookmarked:false,note:"",...extra});
const library=(lessons)=>[{id:"course",title:"Kurs",description:"",topic:"",level:"",depth:"gründlich",language:"Deutsch",demo:false,created:"today",modules:[{id:"module",title:"Modul",lessons}]}];

test("combines edits to different lessons and preserves both",()=>{
 const base=library([lesson("a"),lesson("b")]);
 const local=library([lesson("a",{note:"Meine Notiz"}),lesson("b")]);
 const remote=library([lesson("a"),lesson("b",{completed:true})]);
 assert.deepEqual(mergeLibrary(base,local,remote),library([lesson("a",{note:"Meine Notiz"}),lesson("b",{completed:true})]));
});

test("combines independent fields on the same lesson",()=>{
 const base=library([lesson("a")]);
 const local=library([lesson("a",{note:"Notiz"})]);
 const remote=library([lesson("a",{bookmarked:true})]);
 assert.deepEqual(mergeLibrary(base,local,remote),library([lesson("a",{note:"Notiz",bookmarked:true})]));
});

test("keeps local edit for the same field while retaining remote edits elsewhere",()=>{
 const base=library([lesson("a")]);
 const local=library([lesson("a",{note:"Neu lokal"})]);
 const remote=library([lesson("a",{note:"Neu anderswo",completed:true})]);
 assert.deepEqual(mergeLibrary(base,local,remote),library([lesson("a",{note:"Neu lokal",completed:true})]));
});

test("preserves independent additions and respects deletion of unchanged items",()=>{
 const base=library([lesson("a")]);
 const local=library([lesson("a"),lesson("b")]);
 const remote=library([]);
 assert.deepEqual(mergeLibrary(base,local,remote),library([lesson("b")]));
});
