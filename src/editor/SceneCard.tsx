import type { Scene, SceneChoice, StatKey, Ending } from "../types";
import { STAT_KEYS } from "../types";
import { newChoice } from "../game/storyFactory";

interface SceneOption {
  id: string;
  title: string;
}

interface Props {
  scene: Scene;
  scenes: SceneOption[]; // untuk dropdown tujuan
  isStart: boolean;
  onChange: (scene: Scene) => void;
  onMakeStart: () => void;
  onDelete: () => void;
}

// Dropdown memilih scene tujuan (boleh kosong = belum diatur).
function SceneSelect({
  value,
  scenes,
  onChange,
}: {
  value: string | null;
  scenes: SceneOption[];
  onChange: (id: string | null) => void;
}) {
  return (
    <select value={value ?? ""} onChange={(e) => onChange(e.target.value || null)}>
      <option value="">— belum diatur —</option>
      {scenes.map((s) => (
        <option key={s.id} value={s.id}>
          {s.title || s.id}
        </option>
      ))}
    </select>
  );
}

export default function SceneCard({
  scene,
  scenes,
  isStart,
  onChange,
  onMakeStart,
  onDelete,
}: Props) {
  function patch(p: Partial<Scene>) {
    onChange({ ...scene, ...p });
  }

  function patchChoice(id: string, p: Partial<SceneChoice>) {
    patch({ choices: scene.choices.map((c) => (c.id === id ? { ...c, ...p } : c)) });
  }

  function setChoiceType(c: SceneChoice, type: "goto" | "roll") {
    if (type === "goto") {
      patchChoice(c.id, { roll: null });
    } else {
      patchChoice(c.id, {
        goto: null,
        roll: { stat: "DEX", dc: 12, successSceneId: null, failSceneId: null },
      });
    }
  }

  const otherScenes = scenes; // termasuk diri sendiri (boleh loop balik)

  return (
    <div className={`scene-card ${isStart ? "is-start" : ""}`}>
      <div className="scene-card-head">
        <input
          className="scene-title-input"
          value={scene.title}
          onChange={(e) => patch({ title: e.target.value })}
          placeholder="Judul singkat scene"
        />
        <div className="scene-card-actions">
          {isStart ? (
            <span className="badge">scene awal</span>
          ) : (
            <button className="ghost small" onClick={onMakeStart}>
              jadikan awal
            </button>
          )}
          <button className="ghost small danger" onClick={onDelete}>
            hapus
          </button>
        </div>
      </div>
      <p className="scene-id">id: {scene.id}</p>

      <textarea
        className="scene-text"
        value={scene.text}
        onChange={(e) => patch({ text: e.target.value })}
        placeholder="Tulis narasi scene di sini…"
        rows={4}
      />

      <div className="scene-effects">
        <label>
          <span>Perubahan HP</span>
          <input
            type="number"
            value={scene.effects.hpChange}
            onChange={(e) =>
              patch({ effects: { ...scene.effects, hpChange: Number(e.target.value) || 0 } })
            }
          />
        </label>
        <label>
          <span>Dapat item (pisah koma)</span>
          <input
            value={scene.effects.itemsGained.join(", ")}
            onChange={(e) =>
              patch({
                effects: {
                  ...scene.effects,
                  itemsGained: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                },
              })
            }
            placeholder="mis. Obor, Kunci"
          />
        </label>
        <label>
          <span>Hilang item (pisah koma)</span>
          <input
            value={scene.effects.itemsLost.join(", ")}
            onChange={(e) =>
              patch({
                effects: {
                  ...scene.effects,
                  itemsLost: e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter(Boolean),
                },
              })
            }
            placeholder="mis. Ransel"
          />
        </label>
        <label>
          <span>Akhir cerita?</span>
          <select
            value={scene.ending ?? ""}
            onChange={(e) => patch({ ending: (e.target.value || null) as Ending })}
          >
            <option value="">Bukan akhir</option>
            <option value="victory">🏆 Menang</option>
            <option value="dead">💀 Kalah</option>
          </select>
        </label>
      </div>

      {scene.ending ? (
        <p className="muted scene-note">Scene akhir — pilihan tidak ditampilkan saat bermain.</p>
      ) : (
        <div className="scene-choices">
          <div className="scene-choices-head">Pilihan</div>
          {scene.choices.length === 0 && (
            <p className="muted scene-note">Belum ada pilihan. Tambahkan agar pemain bisa lanjut.</p>
          )}
          {scene.choices.map((c) => (
            <div key={c.id} className="choice-edit">
              <input
                className="choice-text-input"
                value={c.text}
                onChange={(e) => patchChoice(c.id, { text: e.target.value })}
                placeholder="Teks pilihan (mis. Buka pintu)"
              />
              <div className="choice-edit-row">
                <select
                  value={c.roll ? "roll" : "goto"}
                  onChange={(e) => setChoiceType(c, e.target.value as "goto" | "roll")}
                >
                  <option value="goto">Langsung pindah</option>
                  <option value="roll">Roll dadu dulu</option>
                </select>

                {!c.roll ? (
                  <label className="inline">
                    <span>→</span>
                    <SceneSelect
                      value={c.goto}
                      scenes={otherScenes}
                      onChange={(id) => patchChoice(c.id, { goto: id })}
                    />
                  </label>
                ) : (
                  <div className="roll-edit">
                    <label className="inline">
                      <span>Stat</span>
                      <select
                        value={c.roll.stat}
                        onChange={(e) =>
                          patchChoice(c.id, { roll: { ...c.roll!, stat: e.target.value as StatKey } })
                        }
                      >
                        {STAT_KEYS.map((k) => (
                          <option key={k} value={k}>
                            {k}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="inline">
                      <span>DC</span>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={c.roll.dc}
                        onChange={(e) =>
                          patchChoice(c.id, {
                            roll: { ...c.roll!, dc: Number(e.target.value) || 0 },
                          })
                        }
                      />
                    </label>
                    <label className="inline">
                      <span>Sukses →</span>
                      <SceneSelect
                        value={c.roll.successSceneId}
                        scenes={otherScenes}
                        onChange={(id) =>
                          patchChoice(c.id, { roll: { ...c.roll!, successSceneId: id } })
                        }
                      />
                    </label>
                    <label className="inline">
                      <span>Gagal →</span>
                      <SceneSelect
                        value={c.roll.failSceneId}
                        scenes={otherScenes}
                        onChange={(id) =>
                          patchChoice(c.id, { roll: { ...c.roll!, failSceneId: id } })
                        }
                      />
                    </label>
                  </div>
                )}

                <button
                  className="ghost small danger"
                  onClick={() => patch({ choices: scene.choices.filter((x) => x.id !== c.id) })}
                >
                  hapus
                </button>
              </div>
            </div>
          ))}
          <button
            className="ghost small"
            onClick={() => patch({ choices: [...scene.choices, newChoice()] })}
          >
            + tambah pilihan
          </button>
        </div>
      )}
    </div>
  );
}
