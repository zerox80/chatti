const normalize = (text:string) => text.normalize("NFKC").toLocaleLowerCase("de").replace(/[`*_#]/g, "").replace(/\s+/g, " ").trim();

export function readingSections(content:string):string[]{
  const headings:string[]=[];
  let fence:string|null=null;
  for(const line of content.split(/\r?\n/)){
    const marker=line.match(/^ {0,3}(`{3,}|~{3,})/);
    if(fence){if(marker&&marker[1][0]===fence[0]&&marker[1].length>=fence.length&&line.trim()===marker[1])fence=null;continue}
    if(marker){fence=marker[1];continue}
    const heading=line.match(/^#{1,4}\s+(.+)/);
    if(!heading)continue;
    const title=heading[1].replace(/[*`]/g,"").replace(/\[([^\]]+)\]\([^)]*\)/g,"$1").trim();
    if(title&&!headings.includes(title))headings.push(title);
  }
  return headings;
}

export function filterReadingSections(headings:string[],query:string):string[]{
  const terms=normalize(query).split(" ").filter(Boolean);
  return headings.filter(heading=>terms.every(term=>normalize(heading).includes(term)));
}

export function findReadingPlace(sections: {text:string;heading:boolean}[], query:string): number {
  const target=normalize(query);
  if(!target)return -1;
  const texts=sections.map(s=>normalize(s.text));
  const exactHeading=sections.findIndex((s,i)=>s.heading&&texts[i]===target);
  if(exactHeading>=0)return exactHeading;
  const heading=sections.findIndex((s,i)=>s.heading&&texts[i].includes(target));
  if(heading>=0)return heading;
  const exact=texts.findIndex(text=>text===target);
  return exact>=0?exact:texts.findIndex(text=>text.includes(target));
}
