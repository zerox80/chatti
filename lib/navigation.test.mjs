import {test} from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import ts from "typescript";

const source = readFileSync(new URL("./navigation.ts", import.meta.url), "utf8");
const compiled = ts.transpileModule(source, {compilerOptions: {module: ts.ModuleKind.ESNext}}).outputText;
const {readRoute, routeUrl} = await import(`data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`);
const origin = new URL("https://reader.example.test/");

test("every destination survives a copied link or reload", () => {
  for (const route of [
    {view:"home"}, {view:"library"}, {view:"bookmarks"}, {view:"settings"},
    {view:"course",courseId:"kernel"},
    {view:"reader",courseId:"kernel",lessonId:"grundlagen"},
    {view:"reader",courseId:"kernel",lessonId:"prozesse"},
    {view:"reader",courseId:"C++ & Linux",lessonId:"Lesen / Üben #1"},
  ]) assert.deepEqual(readRoute(new URL(routeUrl(route, origin), origin).search), route);
});

test("course and successive lessons have distinct URLs", () => {
  const paths = [
    {view:"library"}, {view:"course",courseId:"kernel"},
    {view:"reader",courseId:"kernel",lessonId:"eins"},
    {view:"reader",courseId:"kernel",lessonId:"zwei"},
  ].map(route => routeUrl(route, origin));
  assert.equal(new Set(paths).size, 4);
  assert.equal(paths[3], "/?kurs=kernel&lektion=zwei");
  assert.deepEqual(readRoute(new URL(paths[2], origin).search), {view:"reader",courseId:"kernel",lessonId:"eins"});
});

test("unknown and incomplete destinations fall back safely", () => {
  for (const search of ["", "?ansicht=unknown", "?ansicht=__proto__", "?ansicht=constructor", "?lektion=orphan", "?kurs=&lektion=x"])
    assert.deepEqual(readRoute(search), {view:"home"});
  assert.deepEqual(readRoute("?kurs=linux&ansicht=kurse"), {view:"course",courseId:"linux"});
});

test("new destinations clear previous route parameters and anchor", () => {
  const current = new URL("https://reader.example.test/?kurs=old&lektion=old&ansicht=kurse&extra=keep#main");
  assert.equal(routeUrl({view:"library"}, current), "/?extra=keep&ansicht=kurse");
  assert.equal(routeUrl({view:"course",courseId:"new"}, current), "/?extra=keep&kurs=new");
});
