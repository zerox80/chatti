import { env } from "cloudflare:workers";
import { z } from "zod";
import { getChatGPTUser } from "../chatgpt-auth";
import { Course, librarySchema, questionSchema } from "../../lib/course";
import { cleanCourseCitations, sourceStyle } from "../../lib/citations";
import {beginnerWriting,writingGuide} from "../../lib/teaching";

const string={type:"string"};
const object=(properties:Record<string,unknown>,required=Object.keys(properties))=>({type:"object",properties,required,additionalProperties:false});
const tools=[
 {name:"list_courses",description:"Liste die Textkurse des angemeldeten Nutzers auf. Nutze Lesewerk zum Erstellen ausführlicher Lesekurse ohne OpenAI API. Zuerst Kursplan mit create_course anlegen, dann jede Lektion einzeln mit save_lesson ausarbeiten. Vorhandene Inhalte vorher mit get_course prüfen.",inputSchema:object({}),annotations:{readOnlyHint:true}},
 {name:"get_course",description:"Lies den vollständigen Kursplan mit Modul- und Lektions-IDs, Lernzielen, Wortzahlen und Fertigstellungsstatus. Liefert keine vollständigen Lektionstexte. Für Inhalte read_lesson nutzen.",inputSchema:object({courseId:string}),annotations:{readOnlyHint:true}},
 {name:"read_lesson",description:"Lies den vollständigen Text und die Fragen einer bestimmten Lektion, etwa zum fachlichen Überarbeiten.",inputSchema:object({courseId:string,lessonId:string}),annotations:{readOnlyHint:true}},
 {name:"create_course",description:"Erstelle einen neuen Textkurs mit strukturiertem Inhaltsverzeichnis. Schreibe didaktisch abgestufte Lernziele; 4 bis 12 Module mit je 3 bis 6 Lektionen sind ein guter Ausgangspunkt. Liefert IDs für save_lesson. Prüfe bei Zertifizierungen vorher aktuelle offizielle Lernziele; behaupte keine vollständige oder offizielle Prüfungsabdeckung ohne Prüfung. Dieser Aufruf erstellt nur den Kursplan, noch keine ausgearbeiteten Texte.",inputSchema:object({title:string,description:string,topic:string,level:string,depth:{type:"string",enum:["gründlich","intensiv"]},language:{type:"string",enum:["Deutsch","English"]},modules:{type:"array",minItems:1,maxItems:16,items:object({title:string,lessons:{type:"array",minItems:1,maxItems:12,items:object({title:string,goal:string})}})}}),annotations:{readOnlyHint:false,destructiveHint:false}},
 {name:"save_lesson",description:"Speichere eine vollständig ausgearbeitete Lektion. Schreibe je nach gewünschter Tiefe ausführliche, dem Vorwissen angepasste Lesetexte: zusammenhängende Erklärungen, Grundlagen und Zusammenhänge, mindestens zwei praktische Beispiele mit Ergebnissen, typische Fehler, Praxisaufgabe, getrennte Musterlösung und Zusammenfassung. Markdown mit Überschriften, Absätzen und Codeblöcken. Keine erfundenen Quellen. Keine Platzhaltertexte oder bloße Stichpunkte. 3–5 Wissensfragen mit vier Optionen und erklärter Lösung. Jede Lektion einzeln speichern; nach jeder Speicherung bleibt sie im Lernraum erhalten. Bestehender Text dieser Lektion wird ersetzt; Notizen und Lernfortschritt bleiben erhalten. Arbeite umfangreiche Kurse in mehreren Gesprächsrunden aus und behaupte erst nach Abgleich aller Lektionen, dass der Kurs vollständig ist.",inputSchema:object({courseId:string,lessonId:string,content:{type:"string",minLength:100},quiz:{type:"array",minItems:1,maxItems:10,items:object({question:string,options:{type:"array",items:string,minItems:4,maxItems:4},correct:{type:"integer",minimum:0,maximum:3},explanation:string})}}),annotations:{readOnlyHint:false,destructiveHint:true}}
];
const createSchema=z.object({title:z.string().min(1).max(300),description:z.string().max(5000),topic:z.string().max(1000),level:z.string().max(100),depth:z.enum(["gründlich","intensiv"]),language:z.enum(["Deutsch","English"]),modules:z.array(z.object({title:z.string().min(1).max(300),lessons:z.array(z.object({title:z.string().min(1).max(300),goal:z.string().max(2000)})).min(1).max(12)})).min(1).max(16)});
const saveSchema=z.object({courseId:z.string(),lessonId:z.string(),content:z.string().min(100).max(150000),quiz:z.array(questionSchema).min(1).max(10)});
function summary(c:Course){return {...c,modules:c.modules.map(m=>({...m,lessons:m.lessons.map(({id,title,goal,content,completed})=>({id,title,goal,completed,ready:!!content,words:content.trim()?content.trim().split(/\s+/).length:0}))}))}}
async function read(userId:string){
 if(!env.DB)throw Error("Speicher ist noch nicht bereit.");
 const row=await env.DB.prepare("SELECT payload, revision FROM libraries WHERE user_id = ?").bind(userId).first<{payload:string;revision:number}>();
 return {courses:row?librarySchema.parse(JSON.parse(row.payload)).map(cleanCourseCitations):[],revision:row?.revision??0};
}
async function mutate(userId:string,change:(courses:Course[])=>unknown){
 for(let attempt=0;attempt<3;attempt++){
 const state=await read(userId); const output=change(state.courses); const payload=JSON.stringify(librarySchema.parse(state.courses).map(cleanCourseCitations));
 if(new TextEncoder().encode(payload).length>1750000)throw Error("Die Bibliothek ist voll. Exportiere und entferne ältere Kurse im Lernraum.");
 await env.DB!.prepare("INSERT OR IGNORE INTO libraries (user_id, payload, revision) VALUES (?, '[]', 0)").bind(userId).run();
 const result=await env.DB!.prepare("UPDATE libraries SET payload = ?, revision = revision + 1 WHERE user_id = ? AND revision = ?").bind(payload,userId,state.revision).run();
 if(result.meta.changes)return output;
 }throw Error("Die Bibliothek wird gerade geändert. Bitte Aufruf wiederholen.");
}
export async function POST(request:Request){
 let rpc:{id?:string|number;method:string;params?:{name?:string;arguments?:Record<string,unknown>}};
 try{const text=await request.text();if(text.length>200000)throw Error();rpc=JSON.parse(text)}catch{return Response.json({jsonrpc:"2.0",id:null,error:{code:-32700,message:"Invalid request"}},{status:400})}
 const respond=(result:unknown)=>Response.json({jsonrpc:"2.0",id:rpc.id??null,result});
 const user=await getChatGPTUser();if(!user)return Response.json({error:"Authentication required"},{status:401});
 if(rpc.method==="server/discover")return respond({supportedVersions:["2026-07-28"],capabilities:{tools:{}},serverInfo:{name:"Lesewerk",version:"1.0.0"}});
 if(rpc.method==="initialize")return respond({protocolVersion:"2025-03-26",capabilities:{tools:{}},serverInfo:{name:"Lesewerk",version:"1.0.0"},instructions:"Lesewerk speichert ausführliche Textkurse. Erstelle zunächst einen Kursplan und arbeite Lektionen einzeln aus. Schreibe fachlich sorgfältig, lang und verständlich. Die Web-App ist der Leseraum; du bist der Autor. Kein OpenAI-API-Schlüssel erforderlich."+" "+sourceStyle+" "+beginnerWriting+" "+writingGuide});
 if(rpc.method.startsWith("notifications/"))return new Response(null,{status:202});
 if(rpc.method==="ping")return respond({});
 if(rpc.method==="tools/list")return respond({tools:tools.map(tool=>({...tool,description:tool.description+(tool.name==="save_lesson"||tool.name==="create_course"?" "+sourceStyle+" "+beginnerWriting+" "+writingGuide:"")}))});
 if(rpc.method!=="tools/call")return Response.json({jsonrpc:"2.0",id:rpc.id??null,error:{code:-32601,message:"Method not found"}});
 try{
 const name=rpc.params?.name;const args=rpc.params?.arguments??{};let output:unknown;
 if(name==="list_courses"){const {courses}=await read(user.userId);output=courses.map(c=>({id:c.id,title:c.title,modules:c.modules.length,lessons:c.modules.flatMap(m=>m.lessons).length,ready:c.modules.flatMap(m=>m.lessons).filter(l=>l.content).length}));}
 else if(name==="get_course"||name==="read_lesson"){
 const state=await read(user.userId); const c=state.courses.find(c=>c.id===args.courseId);if(!c)throw Error("Kurs nicht gefunden.");
 if(name==="get_course")output=summary(c);else {const l=c.modules.flatMap(m=>m.lessons).find(l=>l.id===args.lessonId);if(!l)throw Error("Lektion nicht gefunden.");output={id:l.id,title:l.title,goal:l.goal,content:l.content,quiz:l.quiz};}
 }else if(name==="create_course"){
 const data=createSchema.parse(args); const c:Course={...data,id:crypto.randomUUID(),demo:false,created:new Date().toISOString(),modules:data.modules.map(m=>({...m,id:crypto.randomUUID(),lessons:m.lessons.map(l=>({...l,id:crypto.randomUUID(),content:"",quiz:[],completed:false,bookmarked:false,note:""}))}))};
 output=await mutate(user.userId,courses=>{if(courses.length>=40)throw Error("Maximal 40 Kurse. Bitte ältere Kurse exportieren.");courses.unshift(c);return summary(c)});
 }else if(name==="save_lesson"){
 const data=saveSchema.parse(args);output=await mutate(user.userId,courses=>{const c=courses.find(c=>c.id===data.courseId);const l=c?.modules.flatMap(m=>m.lessons).find(l=>l.id===data.lessonId);if(!l)throw Error("Lektion nicht gefunden.");l.content=data.content;l.quiz=data.quiz;return {saved:true,courseId:data.courseId,lessonId:l.id,words:l.content.trim().split(/\s+/).length,ready:c!.modules.flatMap(m=>m.lessons).filter(l=>l.content).length,total:c!.modules.flatMap(m=>m.lessons).length}});
 }else throw Error("Unbekanntes Werkzeug.");
 return respond({content:[{type:"text",text:JSON.stringify(output)}]});
 }catch(error){return respond({isError:true,content:[{type:"text",text:error instanceof z.ZodError?"Ungültige Eingaben. Prüfe das Schema und die zulässigen Längen.":error instanceof Error?error.message:"Speichern fehlgeschlagen."}]})}
}
export async function GET(){return new Response(null,{status:405,headers:{Allow:"POST"}})}
