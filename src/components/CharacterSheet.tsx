import type { Character } from "../types";
import { STAT_KEYS } from "../types";
import { statModifier, formatModifier } from "../game/dice";

interface Props {
  character: Character;
  onReset: () => void;
}

export default function CharacterSheet({ character, onReset }: Props) {
  const hpPct = Math.round((character.hp / character.maxHp) * 100);
  const hpColor = hpPct > 50 ? "#4caf50" : hpPct > 25 ? "#e6a23c" : "#e74c3c";

  return (
    <aside className="panel sheet">
      <h2>{character.name}</h2>
      <p className="char-class">{character.charClass}</p>

      <div className="hp-block">
        <div className="hp-label">
          HP {character.hp} / {character.maxHp}
        </div>
        <div className="hp-bar">
          <div
            className="hp-fill"
            style={{ width: `${hpPct}%`, background: hpColor }}
          />
        </div>
      </div>

      <div className="sheet-stats">
        {STAT_KEYS.map((k) => (
          <div key={k} className="sheet-stat">
            <span>{k}</span>
            <strong>{character.stats[k]}</strong>
            <em>{formatModifier(statModifier(character.stats[k]))}</em>
          </div>
        ))}
      </div>

      <div className="inventory">
        <h3>Inventory</h3>
        {character.inventory.length === 0 ? (
          <p className="muted">kosong</p>
        ) : (
          <ul>
            {character.inventory.map((item, i) => (
              <li key={`${item}-${i}`}>{item}</li>
            ))}
          </ul>
        )}
      </div>

      <button className="ghost" onClick={onReset}>
        Mulai ulang / karakter baru
      </button>

      <p className="stat-legend" title="Penjelasan atribut">
        STR kekuatan · DEX kelincahan · CON ketahanan · INT kecerdasan · WIS kebijaksanaan · CHA
        karisma
      </p>
    </aside>
  );
}
