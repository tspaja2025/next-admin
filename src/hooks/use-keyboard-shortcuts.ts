import { useCallback, useEffect } from "react";
import type { ShortcutActions } from "@/lib/types";

export function useKeyboardShortcuts(actions: ShortcutActions) {
  const handler = useCallback(
    (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case "n":
            e.preventDefault();
            if (e.shiftKey) {
              actions.newCategory?.();
            } else {
              actions.newNote?.();
            }
            break;
          case "f":
            e.preventDefault();
            if (e.shiftKey) {
              actions.toggleFilters?.();
            } else {
              actions.focusSearch?.();
            }
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
            if (actions.saveNote) {
              e.preventDefault();
              actions.saveNote();
            }
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
    [actions],
  );

  useEffect(() => {
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handler]);
}
