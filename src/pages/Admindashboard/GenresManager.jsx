// src/pages/Admindashboard/GenresManager.jsx

import { useEffect, useMemo, useRef, useState } from "react";

import {
  FaCheckCircle,
  FaEdit,
  FaExclamationCircle,
  FaPlus,
  FaSpinner,
  FaTrash,
} from "react-icons/fa";

import {
  filterBooksByGenre,
  genreSignature,
  makeGenreId,
  normalizeGenreName,
  normalizeGenres,
  validateGenreName,
  withRenamedGenre,
} from "../../utils/genres";

const GenresManager = ({
  genres = [],
  genresLoading = false,
  genresError = null,
  books = [],
  onSave,
}) => {
  const initializedRef = useRef(false);

  const [draft, setDraft] = useState(() =>
    normalizeGenres(genres)
  );
  const [search, setSearch] = useState("");
  const [newName, setNewName] = useState("");
  const [newActive, setNewActive] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  // Initialize once the genre listener has produced its first value.
  // Like Featured Books, we do not re-sync on every snapshot: Firestore emits
  // optimistic local snapshots that revert after a denied write, which would
  // wipe an admin's unsaved draft.
  useEffect(() => {
    if (genresLoading || initializedRef.current) {
      return;
    }

    initializedRef.current = true;
    setDraft(normalizeGenres(genres));
  }, [genresLoading, genres]);

  const savedSignature = genreSignature(genres);
  const draftSignature = genreSignature(draft);
  const dirty = savedSignature !== draftSignature;

  const bookCounts = useMemo(() => {
    const counts = new Map();

    draft.forEach((genre) => {
      counts.set(
        genre.id,
        filterBooksByGenre(books, genre).length
      );
    });

    return counts;
  }, [books, draft]);

  const filteredGenres = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return draft;

    return draft.filter((genre) =>
      genre.name.toLowerCase().includes(term)
    );
  }, [draft, search]);

  const notify = (type, text) =>
    setMessage({ type, text });

  const resetEditState = () => {
    setEditingId(null);
    setEditingName("");
  };

  const handleAdd = (event) => {
    event.preventDefault();

    const error = validateGenreName(newName, draft);

    if (error) {
      notify("error", error);
      return;
    }

    const name = normalizeGenreName(newName);
    const now = new Date().toISOString();
    const existingIds = new Set(
      draft.map((genre) => String(genre.id))
    );

    const genre = {
      id: makeGenreId(name, existingIds),
      name,
      isActive: newActive,
      aliases: [],
      createdAt: now,
      updatedAt: now,
    };

    setDraft((previous) => [...previous, genre]);
    setNewName("");
    setNewActive(true);
    notify(
      "success",
      `“${name}” added. Save changes to publish it on the homepage.`
    );
  };

  const startEdit = (genre) => {
    setEditingId(genre.id);
    setEditingName(genre.name);
    notify("", "");
  };

  const cancelEdit = () => {
    resetEditState();
    notify("", "");
  };

  const saveEdit = (genreId) => {
    const genre = draft.find(
      (item) => String(item.id) === String(genreId)
    );

    if (!genre) return;

    const error = validateGenreName(
      editingName,
      draft,
      genre.id
    );

    if (error) {
      notify("error", error);
      return;
    }

    const renamed = withRenamedGenre(genre, editingName);

    setDraft((previous) =>
      previous.map((item) =>
        String(item.id) === String(genreId)
          ? renamed
          : item
      )
    );

    resetEditState();

    notify(
      "success",
      `Renamed to “${renamed.name}”. Save changes to update the homepage.`
    );
  };

  const toggleActive = (genreId) => {
    const genre = draft.find(
      (item) => String(item.id) === String(genreId)
    );

    if (!genre) return;

    const nextActive = genre.isActive === false;

    setDraft((previous) =>
      previous.map((item) =>
        String(item.id) === String(genreId)
          ? {
              ...item,
              isActive: nextActive,
              updatedAt: new Date().toISOString(),
            }
          : item
      )
    );

    notify(
      "success",
      `“${genre.name}” will be ${
        nextActive ? "shown on" : "hidden from"
      } the homepage after you save changes.`
    );
  };

  const requestDelete = (genre) => {
    setDeleteTarget(genre);
    notify("", "");
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;

    const removed = deleteTarget;

    setDraft((previous) =>
      previous.filter(
        (genre) =>
          String(genre.id) !== String(removed.id)
      )
    );

    if (String(editingId) === String(removed.id)) {
      resetEditState();
    }

    setDeleteTarget(null);

    notify(
      "success",
      `“${removed.name}” removed from the draft. Save changes to update the homepage.`
    );
  };

  const handleDiscard = () => {
    setDraft(normalizeGenres(genres));
    resetEditState();
    setNewName("");
    setNewActive(true);
    notify("", "");
  };

  const handleSave = async () => {
    if (saving) return;

    setSaving(true);
    notify("", "");

    try {
      const result = await onSave(draft);

      if (result?.error) {
        notify(
          "error",
          result.error.message
            ? `Could not save genres: ${result.error.message}`
            : "Could not save genres. Please sign in as an admin and try again."
        );
      } else {
        notify(
          "success",
          "Genres saved. The homepage filters are up to date."
        );
      }
    } catch (error) {
      notify(
        "error",
        error?.message
          ? `Could not save genres: ${error.message}`
          : "Could not save genres. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const activeCount = draft.filter(
    (genre) => genre.isActive !== false
  ).length;

  return (
    <>
      <div className="genre-manager-card">

        {genresError ? (
          <p className="fb-warning">
            <FaExclamationCircle />
            The saved genre configuration could not be
            loaded. Genres derived from existing books are
            shown instead. Check the Firestore rules and
            your admin sign-in before saving.
          </p>
        ) : null}

        {genresLoading ? (
          <p className="hero-manager-loading">
            <FaSpinner className="hero-manager-spin" />{" "}
            Loading genres…
          </p>
        ) : (
          <>
            <form
              className="genre-add-form"
              onSubmit={handleAdd}
            >
              <div className="genre-add-main">
                <label htmlFor="new-genre-name">
                  Add a genre
                </label>

                <input
                  id="new-genre-name"
                  type="text"
                  value={newName}
                  maxLength={60}
                  placeholder="e.g. Fiction"
                  onChange={(event) => {
                    setNewName(event.target.value);
                    notify("", "");
                  }}
                />
              </div>

              <label className="genre-add-active">
                <input
                  type="checkbox"
                  checked={newActive}
                  onChange={(event) =>
                    setNewActive(event.target.checked)
                  }
                />
                Active on homepage
              </label>

              <button
                type="submit"
                className="add-btn"
              >
                <FaPlus /> Add Genre
              </button>
            </form>

            <div className="fb-toolbar">
              <input
                className="fb-search"
                type="search"
                value={search}
                placeholder="Search genres…"
                aria-label="Search genres"
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

              <span className="fb-count">
                {draft.length} genres · {activeCount}{" "}
                active
              </span>
            </div>

            {filteredGenres.length === 0 ? (
              <p className="fb-empty">
                {draft.length === 0
                  ? "No genres yet. Add one above so readers can filter the Books Published section."
                  : `No genres match “${search}”.`}
              </p>
            ) : (
              <ul className="genre-list">
                {filteredGenres.map((genre) => {
                  const isEditing =
                    String(editingId) ===
                    String(genre.id);

                  const count =
                    bookCounts.get(genre.id) || 0;

                  return (
                    <li
                      key={genre.id}
                      className={
                        genre.isActive === false
                          ? "genre-row is-inactive"
                          : "genre-row"
                      }
                    >
                      <div className="genre-info">
                        {isEditing ? (
                          <input
                            className="genre-edit-input"
                            type="text"
                            value={editingName}
                            maxLength={60}
                            autoFocus
                            aria-label={`Rename ${genre.name}`}
                            onChange={(event) => {
                              setEditingName(
                                event.target.value
                              );
                              notify("", "");
                            }}
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                saveEdit(genre.id);
                              }

                              if (
                                event.key === "Escape"
                              ) {
                                event.preventDefault();
                                cancelEdit();
                              }
                            }}
                          />
                        ) : (
                          <strong>{genre.name}</strong>
                        )}

                        <span
                          className={
                            genre.isActive === false
                              ? "genre-book-count is-inactive"
                              : "genre-book-count"
                          }
                        >
                          {count}{" "}
                          {count === 1 ? "book" : "books"}
                        </span>

                        {genre.aliases.length > 0 ? (
                          <span
                            className="genre-alias-note"
                            title={genre.aliases.join(
                              ", "
                            )}
                          >
                            {genre.aliases.length} previous
                            {genre.aliases.length === 1
                              ? " name"
                              : " names"}
                          </span>
                        ) : null}
                      </div>

                      <div className="genre-row-actions">
                        {isEditing ? (
                          <>
                            <button
                              type="button"
                              className="save-btn genre-action"
                              onClick={() =>
                                saveEdit(genre.id)
                              }
                            >
                              Save
                            </button>

                            <button
                              type="button"
                              className="cancel-btn genre-action"
                              onClick={cancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className={
                                genre.isActive === false
                                  ? "genre-switch"
                                  : "genre-switch is-on"
                              }
                              role="switch"
                              aria-checked={
                                genre.isActive !== false
                              }
                              onClick={() =>
                                toggleActive(genre.id)
                              }
                            >
                              <span
                                className="genre-switch-track"
                                aria-hidden="true"
                              >
                                <span className="genre-switch-thumb" />
                              </span>
                              {genre.isActive === false
                                ? "Inactive"
                                : "Active"}
                            </button>

                            <button
                              type="button"
                              className="edit-btn"
                              onClick={() =>
                                startEdit(genre)
                              }
                            >
                              <FaEdit /> Edit
                            </button>

                            <button
                              type="button"
                              className="delete-btn"
                              onClick={() =>
                                requestDelete(genre)
                              }
                            >
                              <FaTrash /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}

            {message.text ? (
              <p
                className={
                  message.type === "error"
                    ? "hero-manager-msg error"
                    : "hero-manager-msg success"
                }
                role="status"
              >
                {message.type === "error" ? (
                  <FaExclamationCircle />
                ) : (
                  <FaCheckCircle />
                )}
                {message.text}
              </p>
            ) : null}

            <div className="fb-actions">
              <span
                className={
                  dirty
                    ? "fb-dirty"
                    : "fb-dirty is-saved"
                }
              >
                {dirty
                  ? "Unsaved changes"
                  : "All changes saved"}
              </span>

              <button
                type="button"
                className="cancel-btn"
                onClick={handleDiscard}
                disabled={!dirty || saving}
              >
                Discard
              </button>

              <button
                type="button"
                className="save-btn"
                onClick={handleSave}
                disabled={!dirty || saving}
              >
                {saving ? (
                  <>
                    <FaSpinner className="hero-manager-spin" />{" "}
                    Saving…
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </>
        )}

      </div>

      {deleteTarget ? (
        <div
          className="genre-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setDeleteTarget(null);
            }
          }}
        >
          <div
            className="genre-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="genre-delete-title"
          >
            <h3 id="genre-delete-title">
              Delete “{deleteTarget.name}”?
            </h3>

            <p>
              This removes the genre from the homepage
              filters. Its books remain published and stay
              available under All Books. No book records
              are changed.
            </p>

            <div className="genre-modal-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={() =>
                  setDeleteTarget(null)
                }
              >
                Cancel
              </button>

              <button
                type="button"
                className="delete-btn"
                onClick={confirmDelete}
              >
                <FaTrash /> Delete Genre
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default GenresManager;
