import { useState } from "react";
import type { Story } from "../types";
import { listStories, deleteStory, duplicateStory } from "../game/storyStorage";

interface Props {
  onPlay: (storyId: string) => void;
  onEdit: (storyId: string) => void;
  onNew: () => void;
}

function sceneCount(story: Story): number {
  return Object.keys(story.scenes).length;
}

export default function HomeMenu({ onPlay, onEdit, onNew }: Props) {
  const [stories, setStories] = useState<Story[]>(() => listStories());

  function refresh() {
    setStories(listStories());
  }

  function handleDelete(id: string) {
    if (!confirm("Hapus cerita ini secara permanen?")) return;
    deleteStory(id);
    refresh();
  }

  function handleDuplicate(id: string) {
    duplicateStory(id);
    refresh();
  }

  return (
    <div className="app centered">
      <div className="panel home">
        <h1>🎲 Solo DnD</h1>
        <p className="subtitle">Tulis ceritamu sendiri, lalu mainkan. Tanpa internet, tanpa biaya.</p>

        <button className="primary big" onClick={onNew}>
          + Buat Cerita Baru
        </button>

        <h2 className="home-section">Cerita kamu</h2>
        {stories.length === 0 && <p className="muted">Belum ada cerita. Buat yang pertama!</p>}

        <ul className="story-list">
          {stories.map((s) => (
            <li key={s.id} className="story-item">
              <div className="story-item-main">
                <strong>{s.title || "(tanpa judul)"}</strong>
                <span className="muted">{sceneCount(s)} scene</span>
              </div>
              <div className="story-item-actions">
                <button className="primary small" onClick={() => onPlay(s.id)}>
                  ▶ Main
                </button>
                <button className="ghost small" onClick={() => onEdit(s.id)}>
                  ✎ Edit
                </button>
                <button className="ghost small" onClick={() => handleDuplicate(s.id)}>
                  salin
                </button>
                <button className="ghost small danger" onClick={() => handleDelete(s.id)}>
                  hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
