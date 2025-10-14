import { useCallback, useEffect } from "react";
import type { ShortcutActions } from "@/lib/types";

export function useKeyboardShortcuts(
  actions: ShortcutActions,
  disabled = false,
) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (disabled) return;
      const target = e.target as HTMLElement;
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      )
        return;

      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault();
            e.shiftKey ? actions.newCategory?.() : actions.newNote?.();
            break;
          case "f":
            e.preventDefault();
            e.shiftKey ? actions.toggleFilters?.() : actions.focusSearch?.();
            break;
          case "g":
            e.preventDefault();
            actions.toggleGrid?.();
            break;
          case "l":
            e.preventDefault();
            actions.toggleList?.();
            break;
          case "s":
            e.preventDefault();
            actions.saveNote?.();
            break;
          case "e":
            e.preventDefault();
            actions.exportNotes?.();
            break;
        }
      } else if (e.key === "Escape") {
        actions.closeDialog?.();
      }
    },
    [actions, disabled],
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}
