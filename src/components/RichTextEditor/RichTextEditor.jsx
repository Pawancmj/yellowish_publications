// Professional rich-text editor for blog content (Tiptap / ProseMirror).
// Supports: bold, italic, underline, strike, headings, paragraphs, lists,
// links, images (uploaded as compressed base64 data URLs — no Firebase
// Storage needed), blockquotes, code blocks, alignment, undo/redo.
//
// Output is HTML. On save, the parent normalizes it (`normalizeContentHtml`)
// so the public Blog Detail page can render it with its existing styles.

import { useRef, useState } from "react";
import { fileToDataUrl } from "../../services/imageToDataUrl";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import ImageExtension from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaStrikethrough,
  FaHeading,
  FaParagraph,
  FaListUl,
  FaListOl,
  FaQuoteRight,
  FaCode,
  FaLink,
  FaUnlink,
  FaImage,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
  FaUndo,
  FaRedo,
} from "react-icons/fa";
import "./RichTextEditor.css";

const ToolButton = ({ active, disabled, onClick, title, children }) => (
  <button
    type="button"
    className={`rte-btn ${active ? "active" : ""}`}
    disabled={disabled}
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    title={title}
    aria-label={title}
  >
    {children}
  </button>
);

export default function RichTextEditor({ value = "", onChange, placeholder = "Start writing your blog..." }) {
  const imageFileRef = useRef(null);
  const [linkOpen, setLinkOpen] = useState(false);
  const [href, setHref] = useState("");
  const [imageOpen, setImageOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageBusy, setImageBusy] = useState(false);
  const [imageError, setImageError] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      ImageExtension.configure({ inline: false, allowBase64: true }),
      Placeholder.configure({ placeholder }),
    ],
    content: value,
    editorProps: {
      attributes: { class: "rte-content", "aria-label": "Blog content editor" },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  });

  if (!editor) return null;

  const insertLink = () => {
    const prev = editor.getAttributes("link").href;
    if (prev) setHref(prev);
    setLinkOpen((o) => !o);
  };

  const applyLink = () => {
    let target = href.trim();
    if (!target) {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      setLinkOpen(false);
      return;
    }
    if (!/^https?:\/\//i.test(target)) target = "https://" + target;
    editor.chain().focus().extendMarkRange("link").setLink({ href: target }).run();
    setLinkOpen(false);
  };

  const insertImage = () => {
    setImageError("");
    setImageUrl(editor?.getAttributes("image")?.src || "");
    setImageOpen((o) => !o);
  };

  const handleImageFile = async (file) => {
    if (!file) return;
    setImageError("");
    setImageBusy(true);
    try {
      const dataUrl = await fileToDataUrl(file, { maxDimension: 800, quality: 0.7 });
      editor.chain().focus().setImage({ src: dataUrl, alt: "" }).run();
      setImageOpen(false);
      setImageUrl("");
    } catch (err) {
      setImageError(err.message || "Could not process this image.");
    } finally {
      setImageBusy(false);
      if (imageFileRef.current) imageFileRef.current.value = "";
    }
  };

  const applyImage = () => {
    const src = imageUrl.trim();
    if (!src) return;
    editor.chain().focus().setImage({ src, alt: "" }).run();
    setImageOpen(false);
    setImageUrl("");
  };

  const isLinkActive = editor.isActive("link");

  return (
    <div className="rte-wrap">
      <div className="rte-toolbar">
        <div className="rte-group">
          <ToolButton active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()} title="Bold">
            <FaBold />
          </ToolButton>
          <ToolButton active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()} title="Italic">
            <FaItalic />
          </ToolButton>
          <ToolButton active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()} title="Underline">
            <FaUnderline />
          </ToolButton>
          <ToolButton active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()} title="Strikethrough">
            <FaStrikethrough />
          </ToolButton>
        </div>

        <div className="rte-group">
          <ToolButton active={editor.isActive("paragraph")} onClick={() => editor.chain().focus().setParagraph().run()} title="Paragraph">
            <FaParagraph />
          </ToolButton>
          <ToolButton active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">
            <FaHeading />2
          </ToolButton>
          <ToolButton active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} title="Heading 3">
            <FaHeading />3
          </ToolButton>
        </div>

        <div className="rte-group">
          <ToolButton active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()} title="Bullet list">
            <FaListUl />
          </ToolButton>
          <ToolButton active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()} title="Numbered list">
            <FaListOl />
          </ToolButton>
          <ToolButton active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()} title="Align left">
            <FaAlignLeft />
          </ToolButton>
          <ToolButton active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()} title="Align center">
            <FaAlignCenter />
          </ToolButton>
          <ToolButton active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()} title="Align right">
            <FaAlignRight />
          </ToolButton>
        </div>

        <div className="rte-group">
          <ToolButton active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()} title="Blockquote">
            <FaQuoteRight />
          </ToolButton>
          <ToolButton active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()} title="Code block">
            <FaCode />
          </ToolButton>
          <div className="rte-link-wrap">
            <ToolButton active={isLinkActive} onClick={insertLink} title="Insert link">
              <FaLink />
            </ToolButton>
            {linkOpen && (
              <div className="rte-link-pop">
                <input
                  type="text"
                  placeholder="https://example.com"
                  value={href}
                  onChange={(e) => setHref(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") applyLink();
                    if (e.key === "Escape") setLinkOpen(false);
                  }}
                  autoFocus
                />
                <button type="button" className="rte-link-apply" onClick={applyLink} disabled={!href.trim()}>
                  Add
                </button>
                {isLinkActive && (
                  <button
                    type="button"
                    className="rte-link-remove"
                    onClick={() => {
                      editor.chain().focus().extendMarkRange("link").unsetLink().run();
                      setLinkOpen(false);
                    }}
                    title="Remove link"
                  >
                    <FaUnlink />
                  </button>
                )}
              </div>
            )}
          </div>
          <ToolButton active={false} onClick={insertImage} title="Insert image">
            <FaImage />
          </ToolButton>
          {imageOpen && (
            <div className="rte-link-pop rte-image-pop">
              <button
                type="button"
                className="rte-image-upload"
                onClick={() => imageFileRef.current && imageFileRef.current.click()}
                disabled={imageBusy}
              >
                {imageBusy ? "Processing…" : "Upload image"}
              </button>
              <input
                ref={imageFileRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => handleImageFile(e.target.files && e.target.files[0])}
              />
              <div className="rte-image-or">— or paste URL —</div>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") applyImage();
                  if (e.key === "Escape") setImageOpen(false);
                }}
              />
              <button type="button" className="rte-link-apply" onClick={applyImage} disabled={!imageUrl.trim()}>
                Insert
              </button>
              {imageError && <div className="rte-image-error">{imageError}</div>}
            </div>
          )}
        </div>

        <div className="rte-group rte-group-end">
          <ToolButton disabled={!editor.can().chain().focus().undo().run()} onClick={() => editor.chain().focus().undo().run()} title="Undo">
            <FaUndo />
          </ToolButton>
          <ToolButton disabled={!editor.can().chain().focus().redo().run()} onClick={() => editor.chain().focus().redo().run()} title="Redo">
            <FaRedo />
          </ToolButton>
        </div>
      </div>

      <EditorContent editor={editor} />
    </div>
  );
}