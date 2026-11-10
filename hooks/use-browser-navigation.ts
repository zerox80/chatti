"use client";
import {useCallback, useEffect, useRef, useState} from "react";
import {readRoute, routeUrl, type Route} from "../lib/navigation";

type Position = {x: number; y: number};
type Entry = Position & {key: string};
const stateKey = "lesewerkNavigation";

function entryState(key: string, position: Position) {
  // Vinext also restores scroll after its asynchronous popstate render.
  // Keep its saved position aligned with this entry to prevent a second jump.
  return {...history.state, [stateKey]: {key, ...position}, __vinext_scrollX: position.x, __vinext_scrollY: position.y};
}

export function useBrowserNavigation(ready: boolean) {
  const [route, setRoute] = useState<Route>({view: "home"});
  const [transition, setTransition] = useState(0);
  const currentKey = useRef("");
  const positions = useRef(new Map<string, Position>());
  const target = useRef<Position | null>(null);

  useEffect(() => {
    const oldRestoration = history.scrollRestoration;
    history.scrollRestoration = "manual";
    const entry = history.state?.[stateKey] as Entry | undefined;
    currentKey.current = entry?.key ?? crypto.randomUUID();
    target.current = entry ? {x: entry.x, y: entry.y} : {x: 0, y: 0};
    history.replaceState(entryState(currentKey.current, target.current), "");
    setRoute(readRoute(location.search));
    const remember = () => positions.current.set(currentKey.current, {x: scrollX, y: scrollY});
    const persist = () => {
      remember();
      history.replaceState(entryState(currentKey.current, {x: scrollX, y: scrollY}), "");
    };
    const restore = () => {
      const entry = history.state?.[stateKey] as Entry | undefined;
      currentKey.current = entry?.key ?? crypto.randomUUID();
      target.current = positions.current.get(currentKey.current) ?? (entry ? {x: entry.x, y: entry.y} : {x: 0, y: 0});
      setRoute(readRoute(location.search));
      setTransition(value => value + 1);
    };
    window.addEventListener("scroll", remember, {passive: true});
    window.addEventListener("pagehide", persist);
    window.addEventListener("beforeunload", persist);
    window.addEventListener("popstate", restore);
    return () => {
      history.scrollRestoration = oldRestoration;
      window.removeEventListener("scroll", remember);
      window.removeEventListener("pagehide", persist);
      window.removeEventListener("beforeunload", persist);
      window.removeEventListener("popstate", restore);
    };
  }, []);

  useEffect(() => {
    if (!ready || !target.current) return;
    const position = target.current;
    const frame = requestAnimationFrame(() => {
      window.scrollTo({...position, behavior: "instant"});
      target.current = null;
    });
    return () => cancelAnimationFrame(frame);
  }, [route, ready, transition]);

  const navigate = useCallback((next: Route, replace = false) => {
    const url = routeUrl(next, new URL(location.href));
    if (url === location.pathname + location.search && !location.hash) return;
    const position = {x: scrollX, y: scrollY};
    positions.current.set(currentKey.current, position);
    history.replaceState(entryState(currentKey.current, position), "");
    currentKey.current = crypto.randomUUID();
    const state = entryState(currentKey.current, {x: 0, y: 0});
    if (replace) history.replaceState(state, "", url);
    else history.pushState(state, "", url);
    target.current = {x: 0, y: 0};
    setRoute(next);
    setTransition(value => value + 1);
  }, []);

  return {route, navigate};
}
