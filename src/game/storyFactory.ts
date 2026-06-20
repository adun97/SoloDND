import type { Story, Scene, SceneChoice } from "../types";
import { emptyEffects } from "../types";

export function genId(prefix: string): string {
  return prefix + "_" + Math.random().toString(36).slice(2, 8);
}

export function newChoice(): SceneChoice {
  return { id: genId("c"), text: "Pilihan baru", goto: null, roll: null };
}

export function newScene(title = "Scene baru"): Scene {
  return {
    id: genId("s"),
    title,
    text: "",
    effects: emptyEffects(),
    ending: null,
    choices: [],
  };
}

export function newStory(title = "Cerita Baru"): Story {
  const first = newScene("Awal");
  return {
    id: genId("story"),
    title,
    startSceneId: first.id,
    scenes: { [first.id]: first },
  };
}

export function sceneList(story: Story): Scene[] {
  return Object.values(story.scenes);
}
