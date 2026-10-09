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
  GlanceTable,
  RefitTable,
  SpendTable,
  VerificationTable,
  VivadoTable,
} from "@/components/dse/LadderTables";
import {
  CaseCordic,
  CaseDatapath,
  CaseHighPrecision,
  CasePareto,
  CaseScatter,
  HowDescent,
  HowTrace,
  ResultsCalculator,
  ResultsRace,
  ResultsReplay,
  ResultsShift,
  WhyClimb,
} from "@/components/dse/Sections";
import { CostTable, HeadlineTable } from "@/components/dse/Tables";
import { Eq } from "@/components/mdx/Eq";
import { RepoFile } from "@/components/mdx/RepoFile";
import { V } from "@/components/mdx/V";
import { Callout } from "@/components/ui/Callout";
import { MdxPre, MdxTable } from "@/components/ui/MdxTable";

export const mdxComponents: NonNullable<MDXRemoteProps["components"]> = {
  table: MdxTable,
  pre: MdxPre,
  Callout,
  Eq,
  V,
  RepoFile,
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
  HeadlineTable,
  HowDescent,
  CaseScatter,
  CaseHighPrecision,
  ResultsShift,
  VerificationTable,
  VivadoTable,
  RefitTable,
  GlanceTable,
  SpendTable,
};
