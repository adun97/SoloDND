// Tipe data bersama.

export type StatKey = "STR" | "DEX" | "CON" | "INT" | "WIS" | "CHA";
export type RollStat = StatKey | "NONE";

export const STAT_KEYS: StatKey[] = ["STR", "DEX", "CON", "INT", "WIS", "CHA"];

export const STAT_LABEL: Record<StatKey, string> = {
  STR: "Kekuatan (STR)",
  DEX: "Kelincahan (DEX)",
  CON: "Ketahanan (CON)",
  INT: "Kecerdasan (INT)",
  WIS: "Kebijaksanaan (WIS)",
  CHA: "Karisma (CHA)",
};

export interface Character {
  name: string;
  charClass: string;
  stats: Record<StatKey, number>;
  hp: number;
  maxHp: number;
  inventory: string[];
}

// Perubahan kondisi saat memasuki sebuah scene.
export interface Effects {
  hpChange: number;
  itemsGained: string[];
  itemsLost: string[];
}

export function emptyEffects(): Effects {
  return { hpChange: 0, itemsGained: [], itemsLost: [] };
}

// ── Cerita buatan sendiri ────────────────────────────────────────────────
export type Ending = "victory" | "dead" | null;

// Cabang berbasis roll dadu di dalam sebuah pilihan.
export interface RollBranch {
  stat: StatKey;
  dc: number;
  successSceneId: string | null;
  failSceneId: string | null;
}

export interface SceneChoice {
  id: string;
  text: string;
  // Jika roll === null → pilihan langsung pindah ke `goto`.
  // Jika roll diisi → pilihan memicu roll dadu, lalu pindah ke success/fail.
  goto: string | null;
  roll: RollBranch | null;
}

export interface Scene {
  id: string;
  title: string; // label singkat untuk editor
  text: string; // narasi yang ditampilkan ke pemain
  effects: Effects; // diterapkan saat memasuki scene
  ending: Ending; // jika diisi, scene ini mengakhiri permainan
  choices: SceneChoice[];
}

export interface Story {
  id: string;
  title: string;
  startSceneId: string | null;
  scenes: Record<string, Scene>;
}

// ── Tampilan saat bermain ────────────────────────────────────────────────
export interface StoryEntry {
  kind: "narration" | "player" | "roll" | "system";
  text: string;
}
