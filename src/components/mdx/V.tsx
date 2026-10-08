/**
 * <V of="climb.ceiling_msps" fmt="num" />: a number from the site's data or models, formatted,
 * in running prose. Server Component.
 */
import { formatValue, lookup, type Fmt } from "@/lib/dse/values";

export function V({ of, fmt = "num" }: { of: string; fmt?: Fmt }): JSX.Element {
  return <span data-v={of}>{formatValue(lookup(of), fmt)}</span>;
}
