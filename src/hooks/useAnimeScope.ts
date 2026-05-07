import { DependencyList, RefObject, useEffect } from "react";
import { createScope } from "animejs";

type AnimeScopeCallback = (
  self: { root: HTMLElement } | unknown,
  context: { reducedMotion: boolean }
) => void | (() => void);

export const useAnimeScope = (
  rootRef: RefObject<HTMLElement | null>,
  callback: AnimeScopeCallback,
  deps: DependencyList = []
) => {
  useEffect(() => {
    if (typeof window === "undefined" || !rootRef.current) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let cleanup: void | (() => void);
    if (reducedMotion) {
      cleanup = callback({ root: rootRef.current }, { reducedMotion: true });

      return () => {
        cleanup?.();
      };
    }

    const scope = createScope({ root: rootRef }).add((self) => {
      cleanup = callback(self, { reducedMotion: false });
    });

    return () => {
      cleanup?.();
      scope?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useAnimeScope;
