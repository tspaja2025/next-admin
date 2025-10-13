import type { Action, Note, NoteEditorState } from "@/components/providers/types";

export function noteEditorReducer(
  state: NoteEditorState,
  action: Action,
): NoteEditorState {
  switch (action.type) {
    case "SET_TITLE":
      return { ...state, title: action.payload };
    case "SET_CONTENT":
      return { ...state, content: action.payload };
    case "ADD_TAG":
      return {
        ...state,
        tags: state.tags.includes(action.payload)
          ? state.tags
          : [...state.tags, action.payload],
      };
    case "REMOVE_TAG":
      return {
        ...state,
        tags: state.tags.filter((t) => t !== action.payload),
      };
    case "SET_CATEGORY":
      return { ...state, category: action.payload };
    case "RESET":
      return action.payload;
    default:
      return state;
  }
}

export function initNoteState(note?: Note): NoteEditorState {
  return {
    id: note?.id ?? crypto.randomUUID(),
    title: note?.title ?? "",
    content: note?.content ?? "",
    tags: note?.tags ?? [],
    category: note?.category ?? "general",
  };
}
