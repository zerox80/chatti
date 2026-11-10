import Studio from "./studio";
import { requireChatGPTUser } from "./chatgpt-auth";
import {readRoute, routeUrl} from "../lib/navigation";
export const dynamic = "force-dynamic";
export default async function Page({searchParams}: {searchParams: Promise<Record<string, string | string[] | undefined>>}) {
 const params = new URLSearchParams();
 const search = await searchParams;
 for (const key of ["kurs", "lektion", "ansicht"]) {
  const value = search[key];
  if (typeof value === "string") params.set(key, value);
 }
 await requireChatGPTUser(routeUrl(readRoute(params.toString()), new URL("https://lesewerk.local/")));
 return <Studio/>;
}
