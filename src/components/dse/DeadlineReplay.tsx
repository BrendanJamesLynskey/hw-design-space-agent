"use client";

/**
 * Milestone 4's deadline miss, on milestone 3's system-replay animation: the
 * asic_multiaxis_control winner (pipelined_m W=17 N=16 m=2) in the same control loop, simulated
 * by the repository's SimPy model at its estimated clock (82.5 MHz, meets) and at the clock
 * sky130 synthesis measured (72.2 MHz, misses), with plain pipelined at its measured clock, the
 * one held-out design that meets the spec. Every time comes from src/data/m4.json
 * (scripts/export_m4.py: hw_dse.l2.system at the vendored commit; the estimate's p99 equals the
 * committed ground truth's, the measured one the held-out table's).
 */
import type { SystemReplay as Replay } from "@/lib/dse/m3";
import {
  deadlineCaption,
  laneName,
  shortKey,
  type Deadline,
  type TickDesign,
} from "@/lib/dse/m4";
import { trim } from "@/lib/format";

import { Prov } from "./Badges";
import SystemReplay from "./SystemReplay";

export default function DeadlineReplay({
  rep,
}: {
  rep: Deadline;
}): JSX.Element {
  const [est, meas] = rep.designs as [TickDesign, TickDesign];
  return (
    <SystemReplay
      rep={rep as unknown as Replay}
      config={{
        title:
          "asic_multiaxis_control: the estimate meets, the measurement misses",
        summary: (
          <>
            The control loop of milestone 3 ({rep.requests} requests per 1 µs
            tick, p99 within {rep.limit_us} µs), simulated by the
            repository&apos;s SimPy model <Prov kind="simulated" /> for the ASIC
            winner at its estimated clock <Prov kind="estimate" /> and at the
            clock sky130 synthesis measured <Prov kind="measured" />.
          </>
        ),
        testId: "deadline-widget",
        caption: (f) => deadlineCaption(f, rep),
        name: (d) => laneName(d as unknown as TickDesign),
        sub: (d) => shortKey(d.key),
        row: (d) => laneName(d as unknown as TickDesign),
        strip: [360, 600],
        stripTicks: [380, 420, 460, 500, 540, 580],
        clockNote: (
          <>
            The winner runs at its estimated clock <Prov kind="estimate" /> and
            at its measured clock <Prov kind="measured" />; plain pipelined at
            its measured clock. The L1 bound is computed at the same clock as
            each lane.
          </>
        ),
        stripAria: `Batch latency of every tick for the winner at ${trim(est.fmax_mhz, 3)} and ${trim(meas.fmax_mhz, 3)} MHz and for plain pipelined, against the ${rep.limit_us} µs limit`,
      }}
    />
  );
}
