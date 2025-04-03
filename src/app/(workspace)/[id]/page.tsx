import ScriptSection from "@/components/editor/script/ScriptSection";
import TimelineSection from "@/components/editor/timeline/TimelineSection";
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
