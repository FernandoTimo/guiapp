export async function generateThumbnail(base64: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d")!;
      const size = 150; // Tamaño de miniatura
      canvas.width = size;
      canvas.height = size;

      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(img, 0, 0, size, size);

      const thumbnailBase64 = canvas.toDataURL("image/png");
      resolve(thumbnailBase64);
    };
    img.src = base64;
  });
}
