"use client";

import { useState, useEffect, useCallback } from "react";
import { Editor } from "./Editor";
import { FileText } from "lucide-react";
import { Button } from "../../components/ui/button";

type Note = {
  id: string;
  title: string;
  content: any;
  updatedAt: string;
};

function NotesClient() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadNotes();
  }, []);

  // TODO: Replace with API call
  const loadNotes = async () => {
    setLoading(true);

    // Local mock data (optional)
    const initialNote: Note = {
      id: crypto.randomUUID(),
      title: "Untitled",
      content: { type: "doc", content: [{ type: "paragraph" }] },
      updatedAt: new Date().toISOString(),
    };

    setNotes([initialNote]);
    setSelectedNote(initialNote);
    setLoading(false);
  };

  // TODO: Replace with POST /notes
  const createNote = () => {
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: "Untitled",
      content: { type: "doc", content: [{ type: "paragraph" }] },
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setSelectedNote(newNote);
  };

  // TODO: Replace with PATCH /notes/:id
  const updateNote = useCallback((noteId: string, updates: Partial<Note>) => {
    setSaving(true);

    setNotes((prev) =>
      prev
        .map((note) =>
          note.id === noteId
            ? {
                ...note,
                ...updates,
                updatedAt: new Date().toISOString(),
              }
            : note
        )
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        )
    );

    setSelectedNote((prev) =>
      prev && prev.id === noteId ? { ...prev, ...updates } : prev
    );

    setSaving(false);
  }, []);

  // TODO: Replace with DELETE /notes/:id
  const deleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((n) => n.id !== noteId);
    setNotes(updatedNotes);

    if (selectedNote?.id === noteId) {
      setSelectedNote(updatedNotes[0] || null);
    }
  };

  // TODO: Replace with POST /notes (duplicate)
  const duplicateNote = (noteId: string) => {
    const note = notes.find((n) => n.id === noteId);
    if (!note) return;

    const duplicated: Note = {
      ...note,
      id: crypto.randomUUID(),
      title: `${note.title} (Copy)`,
      updatedAt: new Date().toISOString(),
    };

    setNotes((prev) => [duplicated, ...prev]);
    setSelectedNote(duplicated);
  };

  const handleContentChange = useCallback(
    (content: any) => {
      if (!selectedNote) return;
      updateNote(selectedNote.id, { content });
    },
    [selectedNote, updateNote]
  );

  const handleTitleChange = useCallback(
    (title: string) => {
      if (!selectedNote) return;
      updateNote(selectedNote.id, { title });
    },
    [selectedNote, updateNote]
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-1 flex flex-col">
        {selectedNote ? (
          <>
            <div className="border-b px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {saving ? "Saving..." : "Saved"}
                </span>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  onClick={() => duplicateNote(selectedNote.id)}>
                  Duplicate
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteNote(selectedNote.id)}>
                  Delete
                </Button>
              </div>
            </div>

            <Editor
              key={selectedNote.id}
              content={selectedNote.content}
              title={selectedNote.title}
              onChange={handleContentChange}
              onTitleChange={handleTitleChange}
            />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-16 h-16 bg-background mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">No note selected</h2>
              <p className="text-muted-foreground mb-4">
                Create a new note to get started
              </p>
              <Button onClick={createNote}>Create Note</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NotesClient;
