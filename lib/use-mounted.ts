"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

/**
 * True only once the component has mounted on the client. Used to gate
 * client-only APIs (e.g. document.body for a portal) without the hydration
 * mismatch or cascading-render issues of a `useEffect(() => setState(true))`.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
