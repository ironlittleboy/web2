import { create } from "zustand";

interface SitesModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useSitesModal = create<SitesModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useSitesModal;