"use client";

/**
 * The exact accuracy of a CORDIC configuration over all 2^W angles, computed in a Web Worker
 * (src/lib/dse/accuracy.worker.ts), or on the main thread if workers are unavailable.
 * Results are cached per configuration.
 */
import { useEffect, useState } from "react";

import { accuracy, type Accuracy, type Numerics } from "@/lib/dse/cordic";

let worker: Worker | null | undefined;
let nextId = 0;
const waiting = new Map<number, (a: Accuracy | null) => void>();
const cache = new Map<string, Promise<Accuracy | null>>();

function getWorker(): Worker | null {
  if (worker !== undefined) return worker;
  try {
    worker = new Worker(
      new URL("../../lib/dse/accuracy.worker.ts", import.meta.url),
    );
    worker.onmessage = (e: MessageEvent<{ id: number; acc?: Accuracy }>) => {
      const w = waiting.get(e.data.id);
      if (!w) return;
      waiting.delete(e.data.id);
      w(e.data.acc ?? null);
    };
  } catch {
    worker = null;
  }
  return worker;
}

function compute(cfg: Numerics): Promise<Accuracy | null> {
  const key = JSON.stringify(cfg);
  let p = cache.get(key);
  if (!p) {
    const w = getWorker();
    p = w
      ? new Promise((resolve) => {
          const id = nextId++;
          waiting.set(id, resolve);
          w.postMessage({ id, cfg });
        })
      : Promise.resolve(accuracy(cfg));
    cache.set(key, p);
  }
  return p;
}

export function useAccuracy(cfg: Numerics): Accuracy | null {
  const key = JSON.stringify(cfg);
  const [state, setState] = useState<{ key: string; acc: Accuracy | null }>({
    key: "",
    acc: null,
  });
  useEffect(() => {
    let live = true;
    void compute(JSON.parse(key) as Numerics).then((acc) => {
      if (live) setState({ key, acc });
    });
    return () => {
      live = false;
    };
  }, [key]);
  return state.key === key ? state.acc : null;
}
