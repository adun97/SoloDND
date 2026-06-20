import type { Story } from "../types";
import { EXAMPLE_STORY } from "./exampleStory";

const KEY = "solo-dnd-stories-v1";
const SEEDED = "solo-dnd-seeded-v1";

function readAll(): Story[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Story[];
  } catch {
    return [];
  }
}

function writeAll(stories: Story[]): void {
  localStorage.setItem(KEY, JSON.stringify(stories));
}

// Pada pemakaian pertama, tanam cerita contoh agar tidak kosong.
export function listStories(): Story[] {
  if (!localStorage.getItem(SEEDED)) {
    const existing = readAll();
    if (existing.length === 0) {
      writeAll([EXAMPLE_STORY]);
    }
    localStorage.setItem(SEEDED, "1");
  }
  return readAll();
}

export function getStory(id: string): Story | null {
  return readAll().find((s) => s.id === id) ?? null;
}

export function saveStory(story: Story): void {
  const all = readAll();
  const idx = all.findIndex((s) => s.id === story.id);
  if (idx === -1) all.push(story);
  else all[idx] = story;
  writeAll(all);
}

export function deleteStory(id: string): void {
  writeAll(readAll().filter((s) => s.id !== id));
}

export function duplicateStory(id: string): Story | null {
  const src = getStory(id);
  if (!src) return null;
  const copy: Story = {
    ...structuredClone(src),
    id: "story_" + Math.random().toString(36).slice(2, 8),
    title: src.title + " (salinan)",
  };
  saveStory(copy);
  return copy;
}
