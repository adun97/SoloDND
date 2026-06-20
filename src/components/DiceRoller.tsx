import { useState } from "react";
import type { Character, StatKey } from "../types";
import { STAT_LABEL } from "../types";
import { resolveRoll, statModifier, formatModifier, type RollResult } from "../game/dice";

interface Props {
  character: Character;
  stat: StatKey;
  dc: number;
  reason: string;
  onRolled: (result: RollResult) => void;
}

export default function DiceRoller({ character, stat, dc, reason, onRolled }: Props) {
  const [rolling, setRolling] = useState(false);
  const [display, setDisplay] = useState<number | null>(null);

  const mod = statModifier(character.stats[stat]);

  function handleRoll() {
    setRolling(true);
    const result = resolveRoll(character.stats, stat, dc);
    let ticks = 0;
    const interval = window.setInterval(() => {
      setDisplay(Math.floor(Math.random() * 20) + 1);
      ticks += 1;
      if (ticks >= 12) {
        window.clearInterval(interval);
        setDisplay(result.d20);
        setRolling(false);
        window.setTimeout(() => onRolled(result), 800);
      }
    }, 60);
  }

  return (
    <div className="panel dice-panel">
      <p className="dice-reason">🎯 {reason}</p>
      <p className="dice-meta">
        Uji <strong>{STAT_LABEL[stat]}</strong> · DC <strong>{dc}</strong> · modifier{" "}
        <strong>{formatModifier(mod)}</strong>
      </p>

      <div className={`die ${rolling ? "rolling" : ""}`}>{display ?? "d20"}</div>

      <button className="primary big" onClick={handleRoll} disabled={rolling}>
        {rolling ? "Mengocok…" : "Roll d20 🎲"}
      </button>
    </div>
  );
}
