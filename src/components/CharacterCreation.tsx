import { useState } from "react";
import type { Character, StatKey } from "../types";
import { STAT_KEYS, STAT_LABEL } from "../types";
import { statModifier, formatModifier } from "../game/dice";
import {
  CLASSES,
  type ClassName,
  baseStatsFor,
  createCharacter,
  startingHp,
  STAT_BUDGET_BONUS,
} from "../game/character";

interface Props {
  storyTitle: string;
  onStart: (character: Character) => void;
  onBack: () => void;
}

export default function CharacterCreation({ storyTitle, onStart, onBack }: Props) {
  const [name, setName] = useState("");
  const [charClass, setCharClass] = useState<ClassName>("Petarung");
  const [stats, setStats] = useState<Record<StatKey, number>>(baseStatsFor("Petarung"));

  function pickClass(c: ClassName) {
    setCharClass(c);
    setStats(baseStatsFor(c));
  }

  const base = baseStatsFor(charClass);
  const spent = STAT_KEYS.reduce((s, k) => s + (stats[k] - base[k]), 0);
  const remaining = STAT_BUDGET_BONUS - spent;

  function adjust(stat: StatKey, delta: number) {
    setStats((prev) => {
      const next = prev[stat] + delta;
      if (next < 6 || next > 18) return prev;
      if (delta > 0 && remaining <= 0) return prev; // tidak boleh melebihi anggaran
      if (delta < 0 && next < base[stat]) return prev; // tidak boleh di bawah basis kelas
      return { ...prev, [stat]: next };
    });
  }

  function handleStart() {
    onStart(createCharacter(name, charClass, stats));
  }

  return (
    <div className="panel creation">
      <button className="ghost back-link" onClick={onBack}>
        ← kembali
      </button>
      <h1>🎲 Buat Karakter</h1>
      <p className="subtitle">
        Petualangan: <strong>{storyTitle}</strong>
      </p>

      <label className="field">
        <span>Nama karakter</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="mis. Aria sang Pengembara"
          maxLength={40}
        />
      </label>

      <div className="field">
        <span>Kelas</span>
        <div className="class-row">
          {CLASSES.map((c) => (
            <button
              key={c}
              className={`class-btn ${c === charClass ? "active" : ""}`}
              onClick={() => pickClass(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <span>
          Atribut — poin bonus tersisa: <strong>{remaining}</strong>
        </span>
        <div className="stats-grid">
          {STAT_KEYS.map((k) => (
            <div key={k} className="stat-row">
              <span className="stat-name">{STAT_LABEL[k]}</span>
              <div className="stat-controls">
                <button onClick={() => adjust(k, -1)} aria-label={`kurangi ${k}`}>
                  −
                </button>
                <span className="stat-value">{stats[k]}</span>
                <button onClick={() => adjust(k, 1)} aria-label={`tambah ${k}`}>
                  +
                </button>
                <span className="stat-mod">{formatModifier(statModifier(stats[k]))}</span>
              </div>
            </div>
          ))}
        </div>
        <p className="hp-preview">HP awal: {startingHp(stats)}</p>
      </div>

      <button className="primary big" onClick={handleStart}>
        Mulai Petualangan →
      </button>
    </div>
  );
}
