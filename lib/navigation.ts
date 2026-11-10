export type View = "home" | "library" | "course" | "reader" | "bookmarks" | "settings";
export type Route = {view: View; courseId?: string; lessonId?: string};

const views = {kurse: "library", lesezeichen: "bookmarks", einstellungen: "settings"} as const;

export function readRoute(search: string): Route {
  const params = new URLSearchParams(search);
  const courseId = params.get("kurs");
  const lessonId = params.get("lektion");
  if (courseId) return lessonId ? {view: "reader", courseId, lessonId} : {view: "course", courseId};
  const name = params.get("ansicht") ?? "";
  const view = Object.prototype.hasOwnProperty.call(views, name) ? views[name as keyof typeof views] : undefined;
  return {view: view ?? "home"};
}

export function routeUrl(route: Route, current: URL): string {
  const url = new URL(current);
  for (const key of ["kurs", "lektion", "ansicht"]) url.searchParams.delete(key);
  url.hash = "";
  if ((route.view === "course" || route.view === "reader") && route.courseId) {
    url.searchParams.set("kurs", route.courseId);
    if (route.view === "reader" && route.lessonId) url.searchParams.set("lektion", route.lessonId);
  } else {
    const entry = Object.entries(views).find(([, value]) => value === route.view);
    if (entry) url.searchParams.set("ansicht", entry[0]);
  }
  return url.pathname + url.search;
}
