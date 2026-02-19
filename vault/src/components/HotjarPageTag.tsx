"use client";

import { useEffect } from "react";
import { tagRecording } from "@/lib/analytics";

/**
 * Tags the current Hotjar recording with the given label (e.g. "signup", "signin").
 * Use once per key page so you can filter sessions in Hotjar.
 */
export default function HotjarPageTag({ tag }: { tag: string }) {
  useEffect(() => {
    tagRecording([tag]);
  }, [tag]);
  return null;
}
