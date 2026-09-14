"use client";

import { useState, useEffect } from "react";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import {
  getWordLists,
  createWordList,
  updateWordList,
  deleteWordList,
  getWords,
  createWord,
  updateWord,
  deleteWord,
  type ApiWordList,
  type ApiWord,
} from "@/lib/apiClient";

export default function WordListsPage() {
  const [lists, setLists] = useState<ApiWordList[]>([]);
  const [selectedListId, setSelectedListId] = useState<number | null>(null);
  const [words, setWords] = useState<ApiWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  // New list form
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");

  // New word form
  const [newWordEnglish, setNewWordEnglish] = useState("");
  const [newWordPhonemes, setNewWordPhonemes] = useState("");

  // Inline rename (list only)
  const [editingListId, setEditingListId] = useState<number | null>(null);
  const [editListName, setEditListName] = useState("");

  // Inline edit (word)
  const [editingWordId, setEditingWordId] = useState<number | null>(null);
  const [editWordEnglish, setEditWordEnglish] = useState("");
  const [editWordPhonemes, setEditWordPhonemes] = useState("");

  // Delete targets (open modals)
  const [deleteListTarget, setDeleteListTarget] = useState<ApiWordList | null>(null);
  const [deleteWordTarget, setDeleteWordTarget] = useState<ApiWord | null>(null);

  // ---- Load lists ----
  const loadLists = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getWordLists();
      setLists(data);
      if (data.length > 0 && selectedListId === null) {
        setSelectedListId(data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load lists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLists();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ---- Load words ----
  const loadWords = async (listId: number) => {
    try {
      const data = await getWords(listId);
      setWords(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load words");
    }
  };

  useEffect(() => {
    if (selectedListId === null) {
      setWords([]);
      return;
    }
    loadWords(selectedListId);
  }, [selectedListId]);

  const flash = (text: string) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  };

  // ---------- Word list CRUD ----------

  const handleCreateList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListName.trim()) return;
    try {
      const created = await createWordList({
        name: newListName.trim(),
        description: newListDescription.trim() || undefined,
      });
      setNewListName("");
      setNewListDescription("");
      await loadLists();
      setSelectedListId(created.id);
      flash(`Created list "${created.name}"`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create list");
    }
  };

  const startEditList = (list: ApiWordList) => {
    setEditingListId(list.id);
    setEditListName(list.name);
  };

  const cancelEditList = () => {
    setEditingListId(null);
    setEditListName("");
  };

  const saveEditList = async (id: number) => {
    if (!editListName.trim()) return;
    try {
      await updateWordList(id, { name: editListName.trim() });
      setEditingListId(null);
      await loadLists();
      flash("List renamed");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update list");
    }
  };

  const confirmDeleteList = async () => {
    if (!deleteListTarget) return;
    const id = deleteListTarget.id;
    try {
      await deleteWordList(id);
      if (selectedListId === id) setSelectedListId(null);
      setDeleteListTarget(null);
      await loadLists();
      flash("List deleted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete list");
      setDeleteListTarget(null);
    }
  };

  // ---------- Word CRUD ----------

  const handleCreateWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedListId || !newWordEnglish.trim() || !newWordPhonemes.trim()) return;

    const phonemes = newWordPhonemes
      .split(/[\s,]+/)
      .map((p) => p.trim())
      .filter(Boolean);

    if (phonemes.length === 0) {
      setError("Enter at least one phoneme");
      return;
    }

    try {
      await createWord({
        listId: selectedListId,
        english: newWordEnglish.trim(),
        transcription: phonemes.join(" "),
        phonemes,
      });
      setNewWordEnglish("");
      setNewWordPhonemes("");
      await loadWords(selectedListId);
      flash("Word added");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add word");
    }
  };

  const startEditWord = (word: ApiWord) => {
    setEditingWordId(word.id);
    setEditWordEnglish(word.english);
    setEditWordPhonemes(
      [...word.phonemes]
        .sort((a, b) => a.position - b.position)
        .map((p) => p.symbol)
        .join(" ")
    );
  };

  const cancelEditWord = () => {
    setEditingWordId(null);
    setEditWordEnglish("");
    setEditWordPhonemes("");
  };

  const saveEditWord = async (id: number) => {
    if (!editWordEnglish.trim() || !editWordPhonemes.trim()) return;

    const phonemes = editWordPhonemes
      .split(/[\s,]+/)
      .map((p) => p.trim())
      .filter(Boolean);

    try {
      await updateWord(id, {
        english: editWordEnglish.trim(),
        transcription: phonemes.join(" "),
        phonemes,
      });
      setEditingWordId(null);
      if (selectedListId) await loadWords(selectedListId);
      flash("Word updated");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update word");
    }
  };

  const confirmDeleteWord = async () => {
    if (!deleteWordTarget) return;
    try {
      await deleteWord(deleteWordTarget.id);
      setDeleteWordTarget(null);
      if (selectedListId) await loadWords(selectedListId);
      flash("Word deleted");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete word");
      setDeleteWordTarget(null);
    }
  };

  // ---------- Render ----------
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          📚 Word List Manager
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Create, read, update, and delete phoneme-based word lists used by the Wordle and Word Search builders.
        </p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-300 p-3 rounded-lg text-sm">
          {error}
          <button
            onClick={() => setError(null)}
            className="float-right font-semibold"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {message && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-300 p-3 rounded-lg text-sm">
          {message}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* LEFT: List of word lists */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">
              Word Lists ({lists.length})
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {lists.map((list) => {
                const isEditing = editingListId === list.id;

                return (
                  <div
                    key={list.id}
                    className={`p-3 rounded-lg border transition-colors ${
                      selectedListId === list.id
                        ? "bg-primary-50 dark:bg-primary-900/20 border-primary-400"
                        : "bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    {isEditing ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={editListName}
                          onChange={(e) => setEditListName(e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                          autoFocus
                        />
                        <button
                          onClick={() => saveEditList(list.id)}
                          className="text-xs px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditList}
                          className="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div
                        className="flex justify-between items-start gap-2 cursor-pointer"
                        onClick={() => setSelectedListId(list.id)}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {list.name}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {list._count?.words ?? 0} words
                          </p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEditList(list);
                            }}
                            className="text-xs px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                            aria-label={`Rename list ${list.name}`}
                            title="Rename"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteListTarget(list);
                            }}
                            className="text-xs px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                            aria-label={`Delete list ${list.name}`}
                            title="Delete"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
              {lists.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No lists yet. Create one below.
                </p>
              )}
            </div>
          </div>

          {/* Create list form */}
          <form
            onSubmit={handleCreateList}
            className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 space-y-3"
          >
            <h3 className="font-semibold text-gray-900 dark:text-white">
              ➕ New Word List
            </h3>
            <input
              type="text"
              placeholder="Name"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
              required
            />
            <textarea
              placeholder="Description (optional)"
              value={newListDescription}
              onChange={(e) => setNewListDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg"
            >
              Create List
            </button>
          </form>
        </div>

        {/* RIGHT: Words in selected list */}
        <div className="lg:col-span-2 space-y-4">
          {selectedListId === null ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center border border-gray-200 dark:border-gray-700">
              <p className="text-gray-600 dark:text-gray-400">
                Select a word list from the left to manage its words.
              </p>
            </div>
          ) : (
            <>
              {/* Add word form */}
              <form
                onSubmit={handleCreateWord}
                className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700 space-y-3"
              >
                <h3 className="font-semibold text-gray-900 dark:text-white">
                  ➕ Add Word to Selected List
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="English word (e.g., ship)"
                    value={newWordEnglish}
                    onChange={(e) => setNewWordEnglish(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Phonemes separated by spaces (e.g., ʃ ɪ p)"
                    value={newWordPhonemes}
                    onChange={(e) => setNewWordPhonemes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg"
                >
                  Add Word
                </button>
              </form>

              {/* Words list */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Words ({words.length})
                </h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {words.map((word) => {
                    const sortedPhonemes = [...word.phonemes].sort(
                      (a, b) => a.position - b.position
                    );
                    const isEditing = editingWordId === word.id;

                    return (
                      <div
                        key={word.id}
                        className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-700"
                      >
                        {isEditing ? (
                          <div className="space-y-2">
                            <div className="grid sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={editWordEnglish}
                                onChange={(e) => setEditWordEnglish(e.target.value)}
                                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm"
                                placeholder="English word"
                                autoFocus
                              />
                              <input
                                type="text"
                                value={editWordPhonemes}
                                onChange={(e) => setEditWordPhonemes(e.target.value)}
                                className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm font-mono"
                                placeholder="Phonemes (space-separated)"
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => saveEditWord(word.id)}
                                className="text-xs px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditWord}
                                className="text-xs px-3 py-1 bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 rounded"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <span className="font-medium text-gray-900 dark:text-white">
                                {word.english}
                              </span>
                              <span className="ml-3 font-mono text-sm text-gray-600 dark:text-gray-400">
                                /{sortedPhonemes.map((p) => p.symbol).join(" ")}/
                              </span>
                              <span className="ml-3 text-xs text-gray-500 dark:text-gray-400">
                                {word.phonemes.length} phonemes
                              </span>
                            </div>
                            <div className="flex gap-1">
                              <button
                                onClick={() => startEditWord(word)}
                                className="text-sm px-2 py-1 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
                                aria-label={`Edit ${word.english}`}
                                title="Edit"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => setDeleteWordTarget(word)}
                                className="text-sm px-2 py-1 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                aria-label={`Delete ${word.english}`}
                                title="Delete"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  {words.length === 0 && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      No words in this list yet. Add one above.
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Delete confirmations - modal dialogs */}
      <ConfirmDialog
        open={deleteListTarget !== null}
        title="Delete word list?"
        message={
          deleteListTarget
            ? `Are you sure you want to delete "${deleteListTarget.name}"? All ${deleteListTarget._count?.words ?? 0} words in this list will be permanently removed.`
            : ""
        }
        confirmLabel="Delete list"
        onConfirm={confirmDeleteList}
        onCancel={() => setDeleteListTarget(null)}
      />

      <ConfirmDialog
        open={deleteWordTarget !== null}
        title="Delete word?"
        message={
          deleteWordTarget
            ? `Are you sure you want to delete "${deleteWordTarget.english}"? This cannot be undone.`
            : ""
        }
        confirmLabel="Delete word"
        onConfirm={confirmDeleteWord}
        onCancel={() => setDeleteWordTarget(null)}
      />
    </div>
  );
}