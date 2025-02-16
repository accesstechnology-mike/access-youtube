"use client";

import { useEffect } from "react";

export function useAppHeight() {
  useEffect(() => {
    const setAppHeight = () => {
      document.documentElement.style.setProperty(
        "--app-height",
        `${window.innerHeight}px`
      );
    };

    setAppHeight();
    window.addEventListener("resize", setAppHeight);
    
    return () => window.removeEventListener("resize", setAppHeight);
  }, []);
} 