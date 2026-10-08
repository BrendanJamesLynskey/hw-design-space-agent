/**
 * MDX components map (as on the companion sites). The widgets come through server wrappers
 * (Sections.tsx), which load their client code lazily; `Eq` renders an equation with KaTeX on
 * the server; `V` prints a number from the data or the models; `Prov` labels its provenance.
 */
import type { MDXRemoteProps } from "next-mdx-remote/rsc";

import { Prov } from "@/components/dse/Badges";
import { KnuthQuote } from "@/components/dse/Knuth";
import {
  DivisionOfLabour,
  LadderTable,
  ProvenanceKey,
} from "@/components/dse/HowSections";
import {
  FleetTimeline,
  SpecResultsTable,
} from "@/components/dse/ResultsTables";
import {
  CaseCordic,
  CaseDatapath,
  CasePareto,
  HowTrace,
  ResultsCalculator,
  ResultsRace,
  ResultsReplay,
  WhyClimb,
} from "@/components/dse/Sections";
import { CostTable } from "@/components/dse/Tables";
import { Eq } from "@/components/mdx/Eq";
import { V } from "@/components/mdx/V";
import { Callout } from "@/components/ui/Callout";
import { MdxPre, MdxTable } from "@/components/ui/MdxTable";

export const mdxComponents: NonNullable<MDXRemoteProps["components"]> = {
  table: MdxTable,
  pre: MdxPre,
  Callout,
  Eq,
  V,
  Prov,
  KnuthQuote,
  WhyClimb,
  CaseCordic,
  CaseDatapath,
  CasePareto,
  HowTrace,
  LadderTable,
  ProvenanceKey,
  DivisionOfLabour,
  FleetTimeline,
  ResultsReplay,
  ResultsRace,
  ResultsCalculator,
  SpecResultsTable,
  CostTable,
};
