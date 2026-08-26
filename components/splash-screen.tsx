"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const LOADING_MS = 1800;
const EXIT_MS = 600;

type Phase = "entering" | "loading" | "exiting" | "hidden";

export function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("entering");

  useEffect(() => {
    const toLoading = setTimeout(() => setPhase("loading"), 50);
    const toExiting = setTimeout(() => setPhase("exiting"), LOADING_MS);
    const toHidden = setTimeout(() => {
      setPhase("hidden");
    }, LOADING_MS + EXIT_MS);

    return () => {
      clearTimeout(toLoading);
      clearTimeout(toExiting);
      clearTimeout(toHidden);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={`fixed inset-0 z-100 flex flex-col items-center justify-center gap-6 bg-background ${
        phase === "entering" ? "opacity-0" : ""
      } ${phase === "exiting" ? "animate-splash-exit" : ""}`}
    >
      <div
        className={`flex flex-col items-center gap-6 ${
          phase !== "exiting" ? "animate-splash-enter" : ""
        }`}
      >
        <div className={phase === "loading" ? "animate-splash-breathe" : ""}>
          <Image
            src="/icon.png"
            alt="Galleryz"
            width={96}
            height={96}
            priority
            className="rounded-2xl shadow-lg"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-foreground" />
          Cargando...
        </div>
      </div>
    </div>
  );
}
