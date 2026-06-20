import { useEffect, useMemo, useState } from "react";
import type { Scene, Story } from "../types";
import { sceneList, newScene } from "../game/storyFactory";
import { getStory, saveStory } from "../game/storyStorage";
import SceneCard from "./SceneCard";

interface Props {
  storyId: string;
  onExit: () => void;
  onPlay: (storyId: string) => void;
}

export default function StoryEditor({ storyId, onExit, onPlay }: Props) {
  const [story, setStory] = useState<Story | null>(() => getStory(storyId));
  const [saved, setSaved] = useState(false);

  // Simpan otomatis setiap ada perubahan.
  useEffect(() => {
    if (!story) return;
    saveStory(story);
    setSaved(true);
    const t = window.setTimeout(() => setSaved(false), 1200);
    return () => window.clearTimeout(t);
  }, [story]);

  const sceneOptions = useMemo(
    () => (story ? sceneList(story).map((s) => ({ id: s.id, title: s.title })) : []),
    [story]
  );

  if (!story) {
    return (
      <div className="app centered">
        <div className="panel">
          <p>Cerita tidak ditemukan.</p>
          <button className="primary" onClick={onExit}>
            Kembali
          </button>
        </div>
      </div>
    );
  }

  function updateScene(updated: Scene) {
    setStory((prev) =>
      prev ? { ...prev, scenes: { ...prev.scenes, [updated.id]: updated } } : prev
    );
  }

  function deleteScene(id: string) {
    if (!confirm("Hapus scene ini?")) return;
    setStory((prev) => {
      if (!prev) return prev;
      const scenes = { ...prev.scenes };
      delete scenes[id];
      const startSceneId = prev.startSceneId === id ? null : prev.startSceneId;
      return { ...prev, scenes, startSceneId };
    });
  }

  function addScene() {
    const s = newScene();
    setStory((prev) =>
      prev ? { ...prev, scenes: { ...prev.scenes, [s.id]: s } } : prev
    );
  }

  const scenes = sceneList(story);

  return (
    <div className="app editor">
      <header className="editor-bar">
        <button className="ghost" onClick={onExit}>
          ← Kembali
        </button>
        <input
          className="story-title-input"
          value={story.title}
          onChange={(e) => setStory({ ...story, title: e.target.value })}
          placeholder="Judul cerita"
        />
        <label className="inline">
          <span>Scene awal</span>
          <select
            value={story.startSceneId ?? ""}
            onChange={(e) => setStory({ ...story, startSceneId: e.target.value || null })}
          >
            <option value="">— pilih —</option>
            {sceneOptions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title || s.id}
              </option>
            ))}
          </select>
        </label>
        <span className={`save-indicator ${saved ? "on" : ""}`}>✓ tersimpan</span>
        <button className="primary" onClick={() => onPlay(story.id)}>
          ▶ Main
        </button>
      </header>

      <div className="editor-body">
        {scenes.length === 0 && (
          <p className="muted">Belum ada scene. Klik "Tambah Scene" untuk mulai.</p>
        )}
        {scenes.map((scene) => (
          <SceneCard
            key={scene.id}
            scene={scene}
            scenes={sceneOptions}
            isStart={story.startSceneId === scene.id}
            onChange={updateScene}
            onMakeStart={() => setStory({ ...story, startSceneId: scene.id })}
            onDelete={() => deleteScene(scene.id)}
          />
        ))}
        <button className="primary big add-scene" onClick={addScene}>
          + Tambah Scene
        </button>
      </div>
    </div>
  );
}
