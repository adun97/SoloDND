import type { StatKey, RollStat } from "../types";

// Modifier D&D standar: (nilai stat - 10) / 2, dibulatkan ke bawah.
export function statModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(mod: number): string {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function rollD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

export interface RollResult {
  d20: number;
  modifier: number;
  total: number;
  dc: number;
  success: boolean;
  critical: "hit" | "miss" | null; // 20 = crit hit, 1 = crit miss
}

export function resolveRoll(
  stats: Record<StatKey, number>,
  stat: RollStat,
  dc: number
): RollResult {
  const d20 = rollD20();
  const modifier = stat === "NONE" ? 0 : statModifier(stats[stat]);
  const total = d20 + modifier;
  const critical = d20 === 20 ? "hit" : d20 === 1 ? "miss" : null;
  // Aturan rumah: natural 20 selalu sukses, natural 1 selalu gagal.
  const success = critical === "hit" ? true : critical === "miss" ? false : total >= dc;
  return { d20, modifier, total, dc, success, critical };
}
