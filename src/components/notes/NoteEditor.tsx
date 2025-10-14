"use client";

import { useEffect, useReducer } from "react";
import { NoteCategorySelector } from "@/components/notes/NoteCategorySelector";
import { NoteContentInput } from "@/components/notes/NoteContentInput";
import { NoteTagEditor } from "@/components/notes/NoteTagEditor";
import { NoteTitleInput } from "@/components/notes/NoteTitleInput";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { initNoteState, noteEditorReducer } from "@/lib/note-reducer";
import type { Note, NoteEditorProps } from "@/lib/types";

export function NoteEditor({
  note,
  categories,
  isOpen,
  onClose,
  onSave,
}: NoteEditorProps) {
  const [state, dispatch] = useReducer(
    noteEditorReducer,
    note ?? undefined,
    initNoteState,
  );

  useEffect(() => {
    dispatch({
      type: "RESET",
      payload: note ? initNoteState(note) : initNoteState(),
    });
  }, [note]);

  const handleSave = () => {
    if (!state.title.trim()) return; // prevent empty titles

    const newNote: Partial<Note> = {
      id: state.id,
      title: state.title.trim(),
      content: state.content.trim(),
      tags: state.tags,
      category: state.category,
      isPinned: note?.isPinned || false,
      createdAt: note?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      onSave(newNote);
      onClose();
    } catch (err) {
      console.error("Failed to save note:", err);
    }
  };

  useKeyboardShortcuts({
    saveNote: handleSave,
    closeDialog: onClose,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{note ? "Edit Note" : "New Note"}</DialogTitle>
          <DialogDescription>Edit or Add New Note</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <NoteTitleInput
            value={state.title}
            onChange={(val) => dispatch({ type: "SET_TITLE", payload: val })}
          />
          <NoteCategorySelector
            value={state.category}
            categories={categories}
            onChange={(val) => dispatch({ type: "SET_CATEGORY", payload: val })}
          />
          <NoteTagEditor
            tags={state.tags}
            onAdd={(tag) => dispatch({ type: "ADD_TAG", payload: tag })}
            onRemove={(tag) => dispatch({ type: "REMOVE_TAG", payload: tag })}
          />
          <NoteContentInput
            value={state.content}
            onChange={(val) => dispatch({ type: "SET_CONTENT", payload: val })}
          />
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Create Note</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
