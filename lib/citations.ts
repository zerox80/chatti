import type { Course } from "./course";

export const sourceStyle = "Verwende keine nummerierten Quellenmarker wie [1], [2], [^1] oder internen ChatGPT-Quellenmarker im Lerntext. Verlinke Quellen stattdessen direkt mit verständlichem Namen als [Quellenname](https://...). Erhalte fachlich notwendige Zahlen, Übungsnummern und Code unverändert.";

/** Remove prose citation labels, preserving fenced/inline code and Markdown links. */
export function cleanCitations(markdown: string): string {
  let fence: string | null = null;
  let sources = false;
  return markdown.split(/(\r?\n)/).map((line) => {
    if (/^\r?\n$/.test(line)) return line;
    const opening = line.match(/^ {0,3}(`{3,}|~{3,})/);
    if (fence) {
      if (opening && opening[1][0] === fence[0] && opening[1].length >= fence.length && line.trim() === opening[1]) fence = null;
      return line;
    }
    if (opening) { fence = opening[1]; return line; }
    if (/^(?: {4}|\t)/.test(line)) return line;
    const heading = line.match(/^#{1,6}\s+(.+)/);
    if (heading) sources = /^(?:quellen|sources|references|referenzen|literatur|weiterführende\s+(?:quellen|links|literatur))\b/i.test(heading[1]);
    // A reference definition carries the real URL. Keep it intact.
    if (/^ {0,3}\[(?:\^?\d+)\]:/.test(line)) return line;
    const withoutSourceLabel = sources ? line.replace(/^(\s*(?:[-*]\s+)?)\[\d+\]\s+/, "$1") : line;
    const protectedParts = /(`+)([\s\S]*?)\1|!?\[[^\]\n]*\](?:\([^\n]*?\)|\[[^\]\n]*\])/g;
    const strip = (text: string, offset: number) => {
      const cleaned = text
      .replace(/\[(?:\^?\d+)(?:\s*[,;–-]\s*\d+)*\]/g, (marker, index: number) => {
        const position = offset + index;
        const before = withoutSourceLabel.slice(0, position);
        const after = withoutSourceLabel.slice(position + marker.length);
        // Preserve exercise labels, escaped brackets, Markdown references and indexing.
        if (!before.trim() || /[\\\]\w]$/.test(before) || /^[(:\[]/.test(after)) return marker;
        return "";
      })
      .replace(/(?:cite[^\n]*|【(?:\d+(?:[†:][^】\n]*)?|turn\w+[^】\n]*)】)/g, "");
      return cleaned === text ? text : cleaned.replace(/[ \t]+([.,;:!?])/g, "$1").replace(/([.!?])[ \t]{2,}/g, "$1 ");
    };
    let out = "", last = 0;
    for (const match of withoutSourceLabel.matchAll(protectedParts)) {
      out += strip(withoutSourceLabel.slice(last, match.index), last) + match[0];
      last = match.index! + match[0].length;
    }
    return out + strip(withoutSourceLabel.slice(last), last);
  }).join("");
}

export function cleanCourseCitations(course: Course): Course {
  return { ...course, description: cleanCitations(course.description), modules: course.modules.map(module => ({
    ...module, lessons: module.lessons.map(lesson => ({
      ...lesson, goal: cleanCitations(lesson.goal), content: cleanCitations(lesson.content),
      quiz: lesson.quiz.map(question => ({ ...question, explanation: cleanCitations(question.explanation) })),
    })),
  })) };
}
