// Image helper — convert an uploaded file into a compressed base64 data URL.
// The project avoids Firebase Storage (which would require the paid plan),
// so blog images are stored inline in Firestore as data URLs, exactly like
// how text content is stored. Images are downscaled + recompressed so each
// one stays comfortably within Firestore's 1MB document limit.

const DEFAULT_MAX = 900;
const DEFAULT_QUALITY = 0.72;

function isSvg(file) {
  return /\.svg$/i.test(file.name) || file.type === "image/svg+xml";
}

function loadImage(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read the image file."));
    };
    img.src = url;
  });
}

/**
 * Convert a File to a compressed base64 data URL.
 * @param {File} file
 * @param {{ maxDimension?: number, quality?: number }} options
 */
export async function fileToDataUrl(file, { maxDimension = DEFAULT_MAX, quality = DEFAULT_QUALITY } = {}) {
  if (!file) throw new Error("No file selected.");

  // SVG stays as-is (tiny, text-based, no recompression needed).
  if (isSvg(file)) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Could not read the file."));
      reader.readAsDataURL(file);
    });
  }

  const img = await loadImage(file);
  const { width, height } = img;
  const maxDim = Math.max(width, height);
  const scale = maxDim > maxDimension ? maxDimension / maxDim : 1;

  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width * scale));
  canvas.height = Math.max(1, Math.round(height * scale));
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not process the image.");

  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error("Image processing failed."))),
      "image/jpeg",
      quality
    );
  });

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("Could not encode the image."));
    reader.readAsDataURL(blob);
  });
}