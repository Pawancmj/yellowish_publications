// Firebase Storage upload helper for blog images.
// The project already uses Firebase Storage, so we reuse it (no second
// storage system). Images are downscaled client-side before upload when they
// are large, keeping storage + bandwidth lean.

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../firebase";

const MAX_DIMENSION = 1600;
const JPEG_QUALITY = 0.82;

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

// Downscale large images to keep uploads fast. Returns a Blob ready to upload.
export async function optimizeImage(file) {
  if (!file || !file.type || !file.type.startsWith("image/") || isSvg(file)) {
    return file;
  }
  try {
    const img = await loadImage(file);
    const { width, height } = img;
    const maxDim = Math.max(width, height);
    if (maxDim <= MAX_DIMENSION) return file;

    const scale = MAX_DIMENSION / maxDim;
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width * scale);
    canvas.height = Math.round(height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return await new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => (blob ? resolve(blob) : reject(new Error("Image optimization failed."))),
        "image/jpeg",
        JPEG_QUALITY
      );
    });
  } catch (error) {
    console.warn("Image optimization skipped:", error.message);
    return file;
  }
}

/**
 * Upload an image to Firebase Storage and return its download URL.
 * @param {File} file
 * @param {{ folder?: 'featured' | 'content', onProgress?: (pct:number)=>void }} options
 */
export async function uploadBlogImage(file, { folder = "featured", onProgress } = {}) {
  if (!file) throw new Error("No file selected.");
  const optimized = await optimizeImage(file);
  const ext = isSvg(optimized)
    ? ".svg"
    : (file.name.match(/\.[a-zA-Z0-9]{1,10}$/) || [".jpg"])[0];
  const base = (folder === "content" ? "blogs/content" : "blogs/featured");
  const filePath = `${base}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;

  const storageRef = ref(storage, filePath);
  const uploadTask = uploadBytesResumable(storageRef, optimized, {
    contentType: optimized.type || "image/jpeg",
  });

  if (onProgress) {
    uploadTask.on("state_changed", (snapshot) => {
      onProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
    });
  }

  await uploadTask;
  return await getDownloadURL(uploadTask.snapshot.ref);
}

// Remove a previously uploaded blog image from storage when the admin
// replaces/removes an image. Silently fails (fire-and-forget) so a missing
// file never blocks the UI.
export async function deleteBlogImage(urlOrPath) {
  if (!urlOrPath) return;
  try {
    const storageRef = ref(storage, urlOrPath);
    await import("firebase/storage").then(({ deleteObject }) => deleteObject(storageRef));
  } catch (error) {
    console.warn("Blog image cleanup skipped:", error.message);
  }
}