import type { Course } from "./course";

const same = (a:unknown,b:unknown) => JSON.stringify(a)===JSON.stringify(b);

function mergeValue(base:unknown,local:unknown,remote:unknown):unknown {
  if(same(local,base)) return remote;
  if(same(remote,base)||same(local,remote)) return local;
  if(Array.isArray(base)&&Array.isArray(local)&&Array.isArray(remote)&&[...base,...local,...remote].every(x=>x&&typeof x==="object"&&typeof (x as {id?:unknown}).id==="string")) {
    const b=new Map(base.map(x=>[(x as {id:string}).id,x]));
    const l=new Map(local.map(x=>[(x as {id:string}).id,x]));
    const r=new Map(remote.map(x=>[(x as {id:string}).id,x]));
    const ids=Array.from(new Set([...Array.from(r.keys()),...Array.from(l.keys())]));
    return ids.flatMap(id=>{
      const hasB=b.has(id),hasL=l.has(id),hasR=r.has(id),bv=b.get(id),lv=l.get(id),rv=r.get(id);
      if(!hasL&&!hasR)return [];
      if(!hasL)return hasB&&same(rv,bv)?[]:[rv];
      if(!hasR)return hasB&&same(lv,bv)?[]:[lv];
      return [hasB?mergeValue(bv,lv,rv):lv];
    });
  }
  if(base&&local&&remote&&typeof base==="object"&&typeof local==="object"&&typeof remote==="object") {
    const b=base as Record<string,unknown>,l=local as Record<string,unknown>,r=remote as Record<string,unknown>;
    const out:Record<string,unknown>={};
    for(const key of new Set([...Object.keys(b),...Object.keys(l),...Object.keys(r)])){
      const value=mergeValue(b[key],l[key],r[key]);
      if(value!==undefined)out[key]=value;
    }
    return out;
  }
  // If both sessions edited the same scalar, keep the most recent submitted edit.
  return local;
}

export function mergeLibrary(base:Course[],local:Course[],remote:Course[]):Course[] {
  return mergeValue(base,local,remote) as Course[];
}
