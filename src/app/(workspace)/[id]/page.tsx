import ScriptSection from "@/components/editor/script/ScriptSection";
import TimelineSection from "@/features/timeline/components/TimelineSection";
import SketchSection from "@/features/sketch/components/SketchSection";

export default function EditorPage() {
  return (
    <>
      <ScriptSection />
      <TimelineSection />
      <SketchSection />
    </>
  );
}
