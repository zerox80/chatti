"use client";
import {Children, isValidElement, memo, useEffect, useRef, useState, type ReactNode} from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import bash from "highlight.js/lib/languages/bash";
import c from "highlight.js/lib/languages/c";
import cpp from "highlight.js/lib/languages/cpp";
import css from "highlight.js/lib/languages/css";
import diff from "highlight.js/lib/languages/diff";
import dockerfile from "highlight.js/lib/languages/dockerfile";
import go from "highlight.js/lib/languages/go";
import ini from "highlight.js/lib/languages/ini";
import java from "highlight.js/lib/languages/java";
import javascript from "highlight.js/lib/languages/javascript";
import json from "highlight.js/lib/languages/json";
import makefile from "highlight.js/lib/languages/makefile";
import markdown from "highlight.js/lib/languages/markdown";
import nginx from "highlight.js/lib/languages/nginx";
import powershell from "highlight.js/lib/languages/powershell";
import python from "highlight.js/lib/languages/python";
import rust from "highlight.js/lib/languages/rust";
import sql from "highlight.js/lib/languages/sql";
import typescript from "highlight.js/lib/languages/typescript";
import xml from "highlight.js/lib/languages/xml";
import yaml from "highlight.js/lib/languages/yaml";
import {Check, Copy} from "lucide-react";

const languages = {bash, c, cpp, css, diff, dockerfile, go, ini, java, javascript, json, makefile, markdown, nginx, powershell, python, rust, sql, typescript, xml, yaml};
const aliases = {bash:["shell","sh","zsh","console"],powershell:["ps1","pwsh"],xml:["html","svg"]};
const languageNames: Record<string,string> = {bash:"Bash",shell:"Shell",sh:"Shell",zsh:"Zsh",console:"Terminal",c:"C",cpp:"C++","c++":"C++",python:"Python",py:"Python",powershell:"PowerShell",ps1:"PowerShell",pwsh:"PowerShell",js:"JavaScript",javascript:"JavaScript",ts:"TypeScript",typescript:"TypeScript",json:"JSON",yaml:"YAML",yml:"YAML",html:"HTML",xml:"XML",css:"CSS",sql:"SQL",rust:"Rust",go:"Go",java:"Java",ini:"INI",makefile:"Makefile",dockerfile:"Dockerfile",diff:"Diff",text:"Text",plaintext:"Text"};

export function codeText(children: ReactNode): string {
  return Children.toArray(children).map(child => {
    if (typeof child === "string" || typeof child === "number") return String(child);
    return isValidElement<{children?:ReactNode}>(child) ? codeText(child.props.children) : "";
  }).join("");
}

function CodeBlock({children}: {children?: ReactNode}) {
  const code = Children.toArray(children).find(child => isValidElement(child));
  const className = isValidElement<{className?:string}>(code) ? code.props.className ?? "" : "";
  const language = className.match(/(?:^|\s)language-([^\s]+)/)?.[1] ?? "";
  const label = languageNames[language.toLowerCase()] ?? (language || "Code");
  const [status,setStatus] = useState<"idle"|"copied"|"failed">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => {if(timer.current) clearTimeout(timer.current)}, []);
  async function copy() {
    if(timer.current) clearTimeout(timer.current);
    try {await navigator.clipboard.writeText(codeText(children));setStatus("copied")}
    catch {setStatus("failed")}
    timer.current = setTimeout(() => setStatus("idle"), 3000);
  }
  return <div className="codeblock lesson-codeblock">
    <div className="codeblock-header"><span>{label}</span><button type="button" onClick={() => void copy()} aria-label={`Code kopieren: ${label}`}>
      {status === "copied" ? <Check size={15}/> : <Copy size={15}/>}<span aria-live="polite">{status === "copied" ? "Kopiert" : status === "failed" ? "Bitte Code markieren" : "Kopieren"}</span>
    </button></div>
    <pre tabIndex={0} role="region" aria-label={`Codebeispiel: ${label}`}>{children}</pre>
  </div>;
}

export const Markdown = memo(function Markdown({text}: {text:string}) {
  return <div className="prose"><ReactMarkdown
    remarkPlugins={[remarkGfm]}
    rehypePlugins={[[rehypeHighlight,{languages,aliases,detect:false}]]}
    skipHtml
    components={{
      pre: ({children}) => <CodeBlock>{children}</CodeBlock>,
      h1: ({children}) => <h2>{children}</h2>,
      h4: ({children}) => <h3>{children}</h3>,
      a: ({href,children}) => <a href={href} target={href?.startsWith("#") ? undefined : "_blank"} rel="noreferrer">{children}</a>,
      table: ({children}) => <div className="markdown-table"><table>{children}</table></div>,
      img: ({alt}) => <span>{alt}</span>,
    }}
  >{text}</ReactMarkdown></div>;
});
