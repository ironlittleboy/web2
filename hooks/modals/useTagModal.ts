import { create } from "zustand";

interface TagModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useTagModal = create<TagModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));