"use client";

import { useEffect } from "react";

export default function OfflineSupport() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        console.error("Offline support could not be registered.");
      });
    }
  }, []);

  return null;
}
