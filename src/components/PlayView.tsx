import { useState } from "react";
import type { Character, Ending, SceneChoice, StatKey, Story, StoryEntry } from "../types";
import { applyEffects } from "../game/character";
import { formatModifier, type RollResult } from "../game/dice";

import CharacterCreation from "./CharacterCreation";
import CharacterSheet from "./CharacterSheet";
import StoryLog from "./StoryLog";
import DiceRoller from "./DiceRoller";

interface PendingRoll {
  stat: StatKey;
  dc: number;
  reason: string;
  successSceneId: string | null;
  failSceneId: string | null;
}

interface PlayState {
  character: Character;
  currentSceneId: string | null;
  log: StoryEntry[];
  pendingRoll: PendingRoll | null;
  ended: Ending; // null = masih bermain
  stopped: boolean; // jalan buntu (scene tidak ditemukan / tak ada pilihan)
}

interface Props {
  story: Story;
  onExit: () => void;
}

// Menerapkan masuknya pemain ke sebuah scene: efek, narasi, cek akhir/HP.
function enterScene(prev: PlayState, story: Story, sceneId: string | null): PlayState {
  const scene = sceneId ? story.scenes[sceneId] : undefined;
  if (!scene) {
    return {
      ...prev,
      currentSceneId: null,
      pendingRoll: null,
      stopped: true,
      log: [
        ...prev.log,
        { kind: "system", text: "Jalan buntu — scene tujuan belum diatur. Cerita berhenti di sini." },
      ],
    };
  }

  const character = applyEffects(prev.character, scene.effects);
  const entries: StoryEntry[] = [{ kind: "narration", text: scene.text || "(scene kosong)" }];

  if (scene.effects.hpChange !== 0) {
    entries.push({
      kind: "system",
      text: `HP ${formatModifier(scene.effects.hpChange)} (sekarang ${character.hp}/${character.maxHp}).`,
    });
  }
  for (const item of scene.effects.itemsGained) {
    entries.push({ kind: "system", text: `Mendapat item: ${item}.` });
  }
  for (const item of scene.effects.itemsLost) {
    entries.push({ kind: "system", text: `Kehilangan item: ${item}.` });
  }

  let ended: Ending = null;
  if (character.hp <= 0) {
    entries.push({ kind: "system", text: "💀 HP-mu habis — kau gugur. GAME OVER." });
    ended = "dead";
  } else if (scene.ending === "victory") {
    entries.push({ kind: "system", text: "🏆 KEMENANGAN — petualangan tamat!" });
    ended = "victory";
  } else if (scene.ending === "dead") {
    entries.push({ kind: "system", text: "💀 GAME OVER." });
    ended = "dead";
  }

  return {
    ...prev,
    character,
    currentSceneId: sceneId,
    pendingRoll: null,
    stopped: false,
    ended,
    log: [...prev.log, ...entries],
  };
}

export default function PlayView({ story, onExit }: Props) {
  const [play, setPlay] = useState<PlayState | null>(null);

  function handleStart(character: Character) {
    const base: PlayState = {
      character,
      currentSceneId: null,
      log: [],
      pendingRoll: null,
      ended: null,
      stopped: false,
    };
    setPlay(enterScene(base, story, story.startSceneId));
  }

  function handleChoice(choice: SceneChoice) {
    setPlay((prev) => {
      if (!prev) return prev;
      const withPlayer: PlayState = {
        ...prev,
        log: [...prev.log, { kind: "player", text: choice.text }],
      };
      if (choice.roll) {
        return {
          ...withPlayer,
          pendingRoll: {
            stat: choice.roll.stat,
            dc: choice.roll.dc,
            reason: choice.text,
            successSceneId: choice.roll.successSceneId,
            failSceneId: choice.roll.failSceneId,
          },
        };
      }
      return enterScene(withPlayer, story, choice.goto);
    });
  }

  function handleRolled(result: RollResult) {
    setPlay((prev) => {
      if (!prev || !prev.pendingRoll) return prev;
      const pr = prev.pendingRoll;
      const target = result.success ? pr.successSceneId : pr.failSceneId;
      const crit =
        result.critical === "hit"
          ? " (kritis!)"
          : result.critical === "miss"
          ? " (gagal kritis!)"
          : "";
      const rollEntry: StoryEntry = {
        kind: "roll",
        text: `${pr.stat} → d20 ${result.d20} ${formatModifier(result.modifier)} = ${result.total} vs DC ${result.dc} → ${result.success ? "SUKSES" : "GAGAL"}${crit}`,
      };
      const withRoll: PlayState = { ...prev, pendingRoll: null, log: [...prev.log, rollEntry] };
      return enterScene(withRoll, story, target);
    });
  }

  if (!play) {
    return (
      <div className="app centered">
        <CharacterCreation storyTitle={story.title} onStart={handleStart} onBack={onExit} />
      </div>
    );
  }

  const scene = play.currentSceneId ? story.scenes[play.currentSceneId] : undefined;
  const gameOver = play.ended !== null;
  const showDice = Boolean(play.pendingRoll) && !gameOver;
  const showChoices = !play.pendingRoll && !gameOver && !play.stopped && scene && scene.choices.length > 0;
  const deadEnd = !play.pendingRoll && !gameOver && (play.stopped || (scene && scene.choices.length === 0));

  return (
    <div className="app game">
      <CharacterSheet character={play.character} onReset={onExit} />

      <main className="play-area">
        <div className="play-header">
          <h2 className="play-title">{story.title}</h2>
          <button className="ghost" onClick={onExit}>
            ← keluar
          </button>
        </div>

        <StoryLog story={play.log} />

        {showDice && play.pendingRoll && (
          <DiceRoller
            character={play.character}
            stat={play.pendingRoll.stat}
            dc={play.pendingRoll.dc}
            reason={play.pendingRoll.reason}
            onRolled={handleRolled}
          />
        )}

        {showChoices && scene && (
          <div className="choices">
            {scene.choices.map((c) => (
              <button key={c.id} className="choice" onClick={() => handleChoice(c)}>
                {c.text}
                {c.roll && <span className="choice-roll"> 🎲 {c.roll.stat} DC {c.roll.dc}</span>}
              </button>
            ))}
          </div>
        )}

        {deadEnd && (
          <div className="game-over">
            <p className="muted">Cerita berhenti di sini (tidak ada pilihan lanjutan).</p>
            <button className="primary big" onClick={() => setPlay(null)}>
              Main lagi
            </button>
          </div>
        )}

        {gameOver && (
          <div className="game-over">
            <button className="primary big" onClick={() => setPlay(null)}>
              Main lagi
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
