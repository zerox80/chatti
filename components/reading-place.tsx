"use client";
import {useEffect,useId,useState} from "react";
import {ArrowDown,Bookmark,Check,Search,X} from "lucide-react";
import {filterReadingSections,readingSections} from "../lib/reading-place";

export function ReadingPlace({lessonId,content,value,onSave,onJump}:{lessonId:string;content:string;value:string;onSave:(text:string)=>void;onJump:(text:string)=>void}){
 const [draft,setDraft]=useState("");
 const [open,setOpen]=useState(false);
 const [active,setActive]=useState(0);
 const id=useId();
 useEffect(()=>{setDraft("");setOpen(false);setActive(0)},[lessonId,value]);
 const headings=readingSections(content);
 const matches=filterReadingSections(headings,draft);
 const selected=Math.max(0,Math.min(active,Math.max(0,matches.length-1)));
 const choose=(title:string)=>{
  if(value!==title)onSave(title);
  setDraft("");setOpen(false);setActive(0);
 };
 return <section className="reading-place" aria-label="Ab hier weiterlesen">
  <div className="reading-place-heading"><Bookmark size={16}/><strong>Ab hier weiterlesen</strong><span>Eine gemerkte Stelle pro Lektion</span></div>
  <p>Klicke eine Sektion an, um sie als Wiedereinstieg zu speichern. Eine neue Auswahl ersetzt die vorherige. Zum Springen nutzt du separat „Zur Stelle“.</p>
  <form onSubmit={e=>{e.preventDefault();const target=headings.length?matches[selected]:draft.trim();if(target)choose(target)}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node|null))setOpen(false)}}>
   <label htmlFor={id}>{headings.length?"Sektion aus dem Inhaltsverzeichnis suchen":"Sektion oder Textstelle"}</label>
   <div className="reading-place-input">
    <div className="reading-section-search"><Search size={15}/><input id={id} role={headings.length?"combobox":undefined} aria-autocomplete={headings.length?"list":undefined} aria-expanded={headings.length?open:undefined} aria-controls={headings.length?id+"-sections":undefined} aria-activedescendant={open&&matches.length?id+"-section-"+selected:undefined} value={draft} onFocus={()=>setOpen(true)} onChange={e=>{setDraft(e.target.value);setActive(0);setOpen(true)}} onKeyDown={e=>{
      if(e.key==="Escape"){e.preventDefault();setOpen(false);return}
      if(!headings.length)return;
      if(e.key==="ArrowDown"){e.preventDefault();setOpen(true);setActive(open?Math.min(selected+1,matches.length-1):0)}
      if(e.key==="ArrowUp"){e.preventDefault();setOpen(true);setActive(open?Math.max(selected-1,0):Math.max(matches.length-1,0))}
     }} maxLength={300} placeholder={headings.length?"Überschrift eingeben oder Sektion wählen …":"Textstelle eingeben …"} autoComplete="off"/>
    </div>
    {!headings.length&&<button className="btn secondary" type="submit" disabled={!draft.trim()}><Check size={15}/>Ab hier merken</button>}
   </div>
   {headings.length>0&&open&&<div className="reading-section-results"><div className="reading-section-caption">{matches.length?`${matches.length} ${matches.length===1?"Sektion":"Sektionen"} · Anklicken zum Speichern`:"Keine passende Sektion gefunden"}</div><div id={id+"-sections"} role="listbox" aria-label="Sektionen der Lektion">{matches.map((title,index)=><button id={id+"-section-"+index} className={`reading-section-option ${index===selected?"highlighted":""} ${title===value?"current":""}`} type="button" role="option" aria-selected={index===selected} tabIndex={-1} key={title} onMouseDown={e=>e.preventDefault()} onMouseEnter={()=>setActive(index)} onClick={()=>choose(title)}><span>{title}</span>{title===value?<><small>Ab hier</small><Check size={15}/></>:<Bookmark size={15}/>}</button>)}</div></div>}
  </form>
  {value&&<div className="reading-place-saved"><span>Weiterlesen ab: <strong>{value}</strong></span><div><button className="text-button" type="button" onClick={()=>onJump(value)}>Zur Stelle<ArrowDown size={14}/></button><button className="icon-btn" type="button" aria-label="Gemerkte Lesestelle entfernen" title="Gemerkte Lesestelle entfernen" onClick={()=>onSave("")}><X size={14}/></button></div></div>}
 </section>;
}
