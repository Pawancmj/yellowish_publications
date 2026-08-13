// Featured image input for the blog form.
// Supports BOTH:
//   1. Direct upload — the file is downscaled + compressed and stored as a
//      base64 data URL right in the Firestore document (no Firebase Storage,
//      no paid plan needed).
//   2. URL paste — same pattern as book covers / author photos (e.g.
//      /seed-blog/…, Imgur, your own server).

import { useRef, useState } from "react";
import { FaImage, FaTrash, FaUpload, FaLink, FaSpinner } from "react-icons/fa";
import { fileToDataUrl } from "../../services/imageToDataUrl";
import "./BlogImageUpload.css";

export default function BlogImageUpload({ value, onChange, accept = "image/*" }) {
  const fileRef = useRef(null);
  const [mode, setMode] = useState("upload");
  const [draft, setDraft] = useState(value || "");
  const [converting, setConverting] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    const type = (file.type || "").toLowerCase();
    if (!type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG or WebP).");
      return;
    }
    setError("");
    setConverting(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      onChange(dataUrl);
      setDraft("");
    } catch (err) {
      setError(err.message || "Could not process this image.");
    } finally {
      setConverting(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const applyUrl = (url) => {
    onChange(url.trim());
    setPreviewError(false);
  };

  return (
    <div className="bimg-wrap">
      <div className="bimg-tabs">
        <button
          type="button"
          className={`bimg-tab ${mode === "upload" ? "active" : ""}`}
          onClick={() => setMode("upload")}
        >
          <FaUpload /> Upload
        </button>
        <button
          type="button"
          className={`bimg-tab ${mode === "url" ? "active" : ""}`}
          onClick={() => setMode("url")}
        >
          <FaLink /> Paste URL
        </button>
      </div>

      {mode === "upload" ? (
        <div
          className={`bimg-dropzone ${converting ? "busy" : ""}`}
          onClick={() => fileRef.current && fileRef.current.click()}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              fileRef.current && fileRef.current.click();
            }
          }}
          role="button"
          tabIndex={0}
        >
          {converting ? (
            <>
              <FaSpinner className="bimg-spin" />
              <span>Processing image…</span>
            </>
          ) : (
            <>
              <FaUpload />
              <span>Click to upload an image</span>
              <small>Automatically resized &amp; compressed — no Firebase Storage needed</small>
            </>
          )}
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            style={{ display: "none" }}
            onChange={(e) => handleFile(e.target.files && e.target.files[0])}
          />
        </div>
      ) : (
        <div className="bimg-url-row">
          <input
            type="text"
            className="bimg-url-input"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              setPreviewError(false);
            }}
            onBlur={() => applyUrl(draft)}
            placeholder="Paste image URL — https://example.com/image.jpg"
          />
          <button
            type="button"
            className="bimg-url-apply"
            onClick={() => applyUrl(draft)}
            title="Apply image URL"
          >
            <FaLink />
          </button>
        </div>
      )}

      {error && <p className="bimg-error">{error}</p>}

      {value ? (
        <div className="bimg-preview">
          <img
            src={value}
            alt="Featured"
            onError={() => setPreviewError(true)}
            onLoad={() => setPreviewError(false)}
          />
          <div className="bimg-actions">
            <button
              type="button"
              className="bimg-btn remove"
              onClick={() => {
                setDraft("");
                applyUrl("");
              }}
            >
              <FaTrash /> Remove
            </button>
          </div>
        </div>
      ) : (
        <div className="bimg-empty">
          <FaImage />
          <span>No image yet</span>
          <small>Upload one or paste a URL (e.g. /seed-blog/book1.png)</small>
        </div>
      )}

      {previewError && value && (
        <p className="bimg-error">Image could not be loaded. Check the link.</p>
      )}
    </div>
  );
}
