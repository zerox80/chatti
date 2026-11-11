import { env } from "cloudflare:workers";
import { getChatGPTUser } from "../../chatgpt-auth";
import { librarySchema } from "../../../lib/course";
import { cleanCourseCitations } from "../../../lib/citations";
import { mergeLibrary } from "../../../lib/library-merge";
export async function GET() {
  const user=await getChatGPTUser();
  if(!user) return Response.json({error:"Bitte melde dich an."},{status:401});
  if(!env.DB) return Response.json({error:"Speicher ist noch nicht bereit."},{status:503});
  const row=await env.DB.prepare("SELECT payload, revision FROM libraries WHERE user_id = ?").bind(user.userId).first<{payload:string;revision:number}>();
  return Response.json({courses:row?librarySchema.parse(JSON.parse(row.payload)).map(cleanCourseCitations):null,revision:row?.revision??0});
}
export async function PUT(request:Request) {
  const user=await getChatGPTUser();
  if(!user) return Response.json({error:"Bitte melde dich an."},{status:401});
  if(!env.DB) return Response.json({error:"Speicher ist noch nicht bereit."},{status:503});
  if(request.headers.get("origin") && request.headers.get("origin")!==new URL(request.url).origin) return Response.json({error:"Zugriff abgelehnt."},{status:403});
  const text=await request.text();
  if(new TextEncoder().encode(text).length>1800000) return Response.json({error:"Die Bibliothek erreicht die Speichergrenze dieser ersten Version. Bitte Kurse exportieren und ältere Kurse entfernen."},{status:413});
  let input; try{input=JSON.parse(text)}catch{return Response.json({error:"Ungültige Daten."},{status:400})}
  const result=librarySchema.safeParse(input.courses),base=input.base===undefined?null:librarySchema.safeParse(input.base);
  if(!result.success || base?.success===false || !Number.isSafeInteger(input.revision) || input.revision<0) return Response.json({error:"Kursdaten sind ungültig."},{status:400});
  await env.DB.prepare("INSERT OR IGNORE INTO libraries (user_id, payload, revision) VALUES (?, '[]', 0)").bind(user.userId).run();
  for(let attempt=0;attempt<5;attempt++){
    const row=await env.DB.prepare("SELECT payload, revision FROM libraries WHERE user_id = ?").bind(user.userId).first<{payload:string;revision:number}>();
    if(!row)return Response.json({error:"Bibliothek konnte nicht geladen werden."},{status:503});
    const current=librarySchema.parse(JSON.parse(row.payload));
    if(row.revision!==input.revision&&!base)return Response.json({error:"Die Bibliothek wurde in einer anderen Sitzung geändert. Synchronisiere die neueste Version und versuche es noch einmal.",courses:current,revision:row.revision},{status:409});
    const courses=row.revision===input.revision?result.data:mergeLibrary(base!.data,result.data,current);
    const normalized=courses.map(cleanCourseCitations);
    const payload=JSON.stringify(normalized);
    const updated=await env.DB.prepare("UPDATE libraries SET payload = ?, revision = revision + 1 WHERE user_id = ? AND revision = ?").bind(payload,user.userId,row.revision).run();
    if(updated.meta.changes)return Response.json({revision:row.revision+1,courses:normalized});
  }
  const row=await env.DB.prepare("SELECT payload, revision FROM libraries WHERE user_id = ?").bind(user.userId).first<{payload:string;revision:number}>();
  return Response.json({error:"Die Bibliothek wird gerade sehr häufig geändert. Synchronisiere bitte noch einmal.",courses:row?librarySchema.parse(JSON.parse(row.payload)):[],revision:row?.revision??0},{status:409});
}
