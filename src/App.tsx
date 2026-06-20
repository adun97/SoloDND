import { useState } from "react";
import { getStory, saveStory } from "./game/storyStorage";
import { newStory } from "./game/storyFactory";
import HomeMenu from "./components/HomeMenu";
import StoryEditor from "./editor/StoryEditor";
import PlayView from "./components/PlayView";

type View =
  | { name: "home" }
  | { name: "edit"; storyId: string }
  | { name: "play"; storyId: string };

export default function App() {
  const [view, setView] = useState<View>({ name: "home" });

  function handleNew() {
    const story = newStory();
    saveStory(story);
    setView({ name: "edit", storyId: story.id });
  }

  if (view.name === "home") {
    return (
      <HomeMenu
        onNew={handleNew}
        onPlay={(storyId) => setView({ name: "play", storyId })}
        onEdit={(storyId) => setView({ name: "edit", storyId })}
      />
    );
  }

  if (view.name === "edit") {
    return (
      <StoryEditor
        storyId={view.storyId}
        onExit={() => setView({ name: "home" })}
        onPlay={(storyId) => setView({ name: "play", storyId })}
      />
    );
  }

  // view.name === "play"
  const story = getStory(view.storyId);
  if (!story) {
    setView({ name: "home" });
    return null;
  }
  return <PlayView story={story} onExit={() => setView({ name: "home" })} />;
}
