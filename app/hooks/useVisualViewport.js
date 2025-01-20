"use client";

import { useCallback, useEffect } from "react";

export function useVisualViewport() {
  const updateViewport = useCallback(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;

    const viewport = window.visualViewport || {
      height: window.innerHeight,
      width: window.innerWidth
    };

    document.documentElement.style.setProperty(
      "--viewport-height",
      `${viewport.height}px`
    );
    document.documentElement.style.setProperty(
      "--viewport-width",
      `${viewport.width}px`
    );
  }, []);

  useEffect(() => {
    updateViewport();

    const viewport = window.visualViewport || window;
    viewport.addEventListener("resize", updateViewport);
    viewport.addEventListener("scroll", updateViewport);

    return () => {
      viewport.removeEventListener("resize", updateViewport);
      viewport.removeEventListener("scroll", updateViewport);
    };
  }, [updateViewport]);
} 