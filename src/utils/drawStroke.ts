import { Stroke } from "@/features/sketch/hooks/useSketchStore";

export function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  if (!stroke.points || stroke.points.length < 2) return; // ✅ seguridad extra

  ctx.lineWidth = stroke.size;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = stroke.tool === "eraser" ? "#0a0a0a" : stroke.color;
  ctx.globalCompositeOperation =
    stroke.tool === "eraser" ? "destination-out" : "source-over";

  ctx.beginPath();
  ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

  for (let i = 1; i < stroke.points.length; i++) {
    const midX = (stroke.points[i - 1].x + stroke.points[i].x) / 2;
    const midY = (stroke.points[i - 1].y + stroke.points[i].y) / 2;
    ctx.quadraticCurveTo(
      stroke.points[i - 1].x,
      stroke.points[i - 1].y,
      midX,
      midY
    );
  }

  ctx.lineTo(
    stroke.points[stroke.points.length - 1].x,
    stroke.points[stroke.points.length - 1].y
  );
  ctx.stroke();
}
