"use client";

import { useEffect } from "react";
import { startVisitTracking } from "@/lib/visit-tracking-service";

export function VisitTracker() {
  useEffect(() => {
    startVisitTracking();
  }, []);

  return null;
}
