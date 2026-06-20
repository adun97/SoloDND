import type { Character, StatKey, Effects } from "../types";
import { STAT_KEYS } from "../types";
import { statModifier } from "./dice";

// Beberapa kelas dasar dengan stat awal sederhana. Pemain bisa menyesuaikan
// lewat poin tambahan saat pembuatan karakter.
export const CLASSES = ["Petarung", "Penyihir", "Penjelajah", "Bandit"] as const;
export type ClassName = (typeof CLASSES)[number];

const CLASS_BASE: Record<ClassName, Record<StatKey, number>> = {
  Petarung: { STR: 15, DEX: 12, CON: 14, INT: 8, WIS: 10, CHA: 10 },
  Penyihir: { STR: 8, DEX: 12, CON: 10, INT: 15, WIS: 13, CHA: 11 },
  Penjelajah: { STR: 11, DEX: 15, CON: 12, INT: 10, WIS: 13, CHA: 9 },
  Bandit: { STR: 10, DEX: 14, CON: 11, INT: 11, WIS: 9, CHA: 14 },
};

export function baseStatsFor(charClass: ClassName): Record<StatKey, number> {
  return { ...CLASS_BASE[charClass] };
}

// HP awal = 8 + modifier CON (minimal 1).
export function startingHp(stats: Record<StatKey, number>): number {
  return Math.max(1, 8 + statModifier(stats.CON));
}

export function createCharacter(
  name: string,
  charClass: ClassName,
  stats: Record<StatKey, number>
): Character {
  const maxHp = startingHp(stats);
  return {
    name: name.trim() || "Pengembara",
    charClass,
    stats: { ...stats },
    hp: maxHp,
    maxHp,
    inventory: ["Pakaian lusuh", "Ransel"],
  };
}

// Terapkan efek dari DM ke karakter (mengembalikan salinan baru).
export function applyEffects(character: Character, effects: Effects): Character {
  const hp = Math.max(0, Math.min(character.maxHp, character.hp + effects.hpChange));
  let inventory = [...character.inventory, ...effects.itemsGained];
  for (const lost of effects.itemsLost) {
    const idx = inventory.findIndex((i) => i.toLowerCase() === lost.toLowerCase());
    if (idx !== -1) inventory.splice(idx, 1);
  }
  return { ...character, hp, inventory };
}

// Validasi alokasi stat: total tidak boleh melebihi anggaran, tiap stat 6-18.
export const STAT_BUDGET_BONUS = 3; // poin tambahan di atas basis kelas

export function statsTotal(stats: Record<StatKey, number>): number {
  return STAT_KEYS.reduce((sum, k) => sum + stats[k], 0);
}
