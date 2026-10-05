// Shared image field for the whole Admin Panel (books, authors, trusted
// authors, blog featured image, inline blog images, authors-hero portraits).
//
// Supports BOTH:
//   1. Direct upload — the file is validated (type + size), downscaled and
//      compressed by `fileToDataUrl`, then stored as a base64 data URL right
//      in the existing Firestore image field (no Firebase Storage, no paid
//      plan needed — Storage requires Blaze since Feb 2026).
//   2. URL paste — the input stays available so URL-based records keep
//      working exactly as before.
//
// Always shows a preview, loading state, error messages, and Remove/Replace.

import { useEffect, useRef, useState } from "react";
import { FaImage, FaLink, FaSpinner, FaTrash, FaUpload } from "react-icons/fa";
import { fileToDataUrl } from "../../services/imageToDataUrl";
import "./ImageUpload.css";

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/svg+xml",
];

const ACCEPT_ATTR = ACCEPTED_TYPES.join(",");

const MAX_FILE_BYTES = 10 * 1024 * 1024; // 10 MB before compression
const MAX_ENCODED_CHARS = 900 * 1024; // stays under Firestore's 1MB doc limit

const TYPE_ERROR =
  "Please choose a JPG, JPEG, PNG or WEBP image file.";
const SIZE_ERROR =
  "This image is too large — please choose a file under 10 MB.";
const ENCODED_ERROR =
  "This image is still too large after processing — please choose a smaller image.";

export default function ImageUpload({
  value = "",
  onChange,
  label = "Image",
  required = false,
  disabled = false,
  errorText = "",
  help = "",
  placeholder,
  compact = false,
  showRemove = true,
  showUrl = true,
  maxDimension = 900,
  quality = 0.72,
  onUrlKeyDown,
}) {
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [previewFailed, setPreviewFailed] = useState(false);

  const isDataUrl =
    typeof value === "string" && value.startsWith("data:");

  // A new value (typed URL, upload, remove) gets a fresh preview attempt.
  useEffect(() => {
    setPreviewFailed(false);
  }, [value]);

  const pickFile = () => {
    if (disabled || busy) return;
    if (fileRef.current) fileRef.current.click();
  };

  const handleFile = async (file) => {
    if (!file) return;

    const type = (file.type || "").toLowerCase();
    const acceptedByType = ACCEPTED_TYPES.includes(type);
    const acceptedByExt =
      !type && /\.(jpe?g|png|webp|svg)$/i.test(file.name || "");

    if (!acceptedByType && !acceptedByExt) {
      setError(TYPE_ERROR);
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setError(SIZE_ERROR);
      return;
    }

    setError("");
    setBusy(true);

    try {
      const dataUrl = await fileToDataUrl(file, {
        maxDimension,
        quality,
      });

      if (dataUrl.length > MAX_ENCODED_CHARS) {
        throw new Error(ENCODED_ERROR);
      }

      if (onChange) onChange(dataUrl);
    } catch (err) {
      setError(
        (err && err.message) || "Could not process this image."
      );
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const handleRemove = () => {
    setError("");
    setPreviewFailed(false);
    if (onChange) onChange("");
  };

  const handleUrlChange = (e) => {
    setError("");
    setPreviewFailed(false);
    if (onChange) onChange(e.target.value);
  };

  const urlPlaceholder =
    placeholder ||
    (isDataUrl
      ? "Uploaded image — paste a URL to replace it"
      : "https://example.com/image.jpg");

  return (
    <div
      className={
        compact ? "image-upload compact" : "image-upload"
      }
    >
      {label ? (
        <span className="image-upload-label">
          {label}
          {required ? " *" : ""}
        </span>
      ) : null}

      <div className="image-upload-preview">
        {value && !previewFailed ? (
          <img
            src={value}
            alt="Preview"
            onError={() => setPreviewFailed(true)}
          />
        ) : value ? (
          <span className="image-upload-preview-failed">
            Couldn't load a preview — check that the link is a
            direct, public image URL.
          </span>
        ) : (
          <span className="image-upload-empty">
            <FaImage />
            <span>No image yet</span>
          </span>
        )}

        {busy ? (
          <div className="image-upload-busy">
            <FaSpinner className="image-upload-spin" />
            <span>Processing image…</span>
          </div>
        ) : null}
      </div>

      <div className="image-upload-actions">
        <button
          type="button"
          className="image-upload-btn upload"
          onClick={pickFile}
          disabled={disabled || busy}
        >
          <FaUpload />{" "}
          {value ? "Replace image" : "Upload image"}
        </button>

        {showRemove && value ? (
          <button
            type="button"
            className="image-upload-btn remove"
            onClick={handleRemove}
            disabled={disabled || busy}
          >
            <FaTrash /> Remove
          </button>
        ) : null}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT_ATTR}
        style={{ display: "none" }}
        onChange={(e) =>
          handleFile(e.target.files && e.target.files[0])
        }
      />

      {showUrl ? (
        <div className="image-upload-url">
          <input
            type="text"
            value={isDataUrl ? "" : value || ""}
            onChange={handleUrlChange}
            onKeyDown={onUrlKeyDown}
            disabled={disabled}
            placeholder={urlPlaceholder}
          />
          <FaLink
            className="image-upload-url-icon"
            aria-hidden="true"
          />
        </div>
      ) : null}

      {error || errorText ? (
        <p className="image-upload-error">
          {error || errorText}
        </p>
      ) : null}

      {help ? (
        <small className="image-upload-help">{help}</small>
      ) : null}
    </div>
  );
}
