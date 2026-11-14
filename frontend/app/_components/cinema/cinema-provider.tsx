"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  createFrameJudge,
  decideTier,
  parseOverride,
  type CinemaTier,
  type TierSignals,
} from "@/lib/cinema/tier";
import { shouldPulse } from "@/lib/cinema/timing";

export interface CinemaContextValue {
  tier: CinemaTier;
  /** False until the client has read the device signals; gate one-off effects on it. */
  ready: boolean;
  /** True once the WebGL canvas is on screen; the CSS stand-ins step aside only then. */
  sceneReady: boolean;
  setSceneReady(on: boolean): void;
  setLetterbox(on: boolean): void;
  pulseLetterbox(ms?: number): void;
  reportFrameTime(ms: number): void;
  downgrade(): void;
}

const CinemaContext = createContext<CinemaContextValue>({
  tier: "css",
  ready: false,
  sceneReady: false,
  setSceneReady() {},
  setLetterbox() {},
  pulseLetterbox() {},
  reportFrameTime() {},
  downgrade() {},
});

/** Probe once and release the context immediately so it does not count against the browser's limit. */
function detectWebGL2(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

function readSignals(hasWebGL2: boolean): TierSignals {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return {
    reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    saveData: nav.connection?.saveData === true,
    coarsePointer: window.matchMedia("(pointer: coarse)").matches,
    hasWebGL2,
    hardwareConcurrency: nav.hardwareConcurrency,
    deviceMemory: nav.deviceMemory,
    // Manual override is a dev tool only; production builds never honour it.
    override:
      process.env.NODE_ENV !== "production"
        ? parseOverride(new URLSearchParams(window.location.search).get("cinema"))
        : null,
  };
}

function setHtmlFlag(name: string, value: string | null) {
  const el = document.documentElement;
  if (value === null) el.removeAttribute(name);
  else el.setAttribute(name, value);
}

export function CinemaProvider({ children }: { children: ReactNode }) {
  const [tier, setTier] = useState<CinemaTier>("css");
  const [ready, setReady] = useState(false);
  const downgraded = useRef(false);
  const [sceneReady, setSceneReady] = useState(false);
  const judge = useRef(createFrameJudge());
  const judged = useRef(false);
  const lastPulse = useRef(-Infinity);
  const pulseTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const hasWebGL2 = detectWebGL2();
    const compute = () => {
      let next = decideTier(readSignals(hasWebGL2));
      if (downgraded.current && next === "webgl") next = "css";
      setTier(next);
      setReady(true);
    };
    compute();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    mq.addEventListener("change", compute);
    return () => mq.removeEventListener("change", compute);
  }, []);

  useEffect(() => {
    setHtmlFlag("data-cinema-tier", tier);
  }, [tier]);

  const setLetterbox = useCallback((on: boolean) => {
    setHtmlFlag("data-letterbox", on ? "on" : null);
  }, []);

  const pulseLetterbox = useCallback(
    (ms = 900) => {
      const now = performance.now();
      if (!shouldPulse(now, lastPulse.current)) return;
      lastPulse.current = now;
      setLetterbox(true);
      window.clearTimeout(pulseTimer.current);
      pulseTimer.current = window.setTimeout(() => setLetterbox(false), ms);
    },
    [setLetterbox],
  );

  const downgrade = useCallback(() => {
    downgraded.current = true;
    setSceneReady(false);
    setTier((t) => (t === "webgl" ? "css" : t));
  }, []);

  const reportFrameTime = useCallback(
    (ms: number) => {
      if (judged.current) return; // one verdict, after the startup burst
      const verdict = judge.current.push(ms);
      if (verdict === "pending") return;
      judged.current = true;
      if (verdict === "slow") downgrade();
    },
    [downgrade],
  );

  const value = useMemo<CinemaContextValue>(
    () => ({
      tier,
      ready,
      sceneReady,
      setSceneReady,
      setLetterbox,
      pulseLetterbox,
      reportFrameTime,
      downgrade,
    }),
    [tier, ready, sceneReady, setLetterbox, pulseLetterbox, reportFrameTime, downgrade],
  );

  return <CinemaContext.Provider value={value}>{children}</CinemaContext.Provider>;
}

export function useCinema(): CinemaContextValue {
  return useContext(CinemaContext);
}

export function useCinemaTier(): CinemaTier {
  return useContext(CinemaContext).tier;
}
