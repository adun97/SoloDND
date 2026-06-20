import { useEffect, useRef } from "react";
import type { StoryEntry } from "../types";

interface Props {
  story: StoryEntry[];
}

const PREFIX: Record<StoryEntry["kind"], string> = {
  narration: "",
  player: "🧍 ",
  roll: "🎲 ",
  system: "ℹ️ ",
};

export default function StoryLog({ story }: Props) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [story]);

  return (
    <div className="story-log">
      {story.map((entry, i) => (
        <p key={i} className={`entry ${entry.kind}`}>
          {PREFIX[entry.kind]}
          {entry.text}
        </p>
      ))}
      <div ref={endRef} />
    </div>
  );
}
