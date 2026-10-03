import { useSyncExternalStore } from "react";

// Tiny global store so the nav button and the keyboard shortcut share one palette.
let open = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

export const palette = {
  open: () => {
    open = true;
    emit();
  },
  close: () => {
    open = false;
    emit();
  },
  toggle: () => {
    open = !open;
    emit();
  },
};

export function usePaletteOpen() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => open,
    () => false,
  );
}
