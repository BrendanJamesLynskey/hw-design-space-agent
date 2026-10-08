/**
 * Computes the exact accuracy of a CORDIC configuration over every one of its 2^W input
 * angles off the main thread (up to 65,536 angles x N micro-rotations, a few hundred
 * milliseconds), with the TS port of the bit-exact model.
 */
import { accuracy, type Numerics } from "./cordic";

type Req = { id: number; cfg: Numerics };

const ctx = self as unknown as {
  onmessage: ((e: MessageEvent<Req>) => void) | null;
  postMessage: (m: unknown) => void;
};

ctx.onmessage = (e) => {
  const { id, cfg } = e.data;
  try {
    ctx.postMessage({ id, acc: accuracy(cfg) });
  } catch (err) {
    ctx.postMessage({
      id,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};
