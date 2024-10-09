import { create } from "zustand";

interface UserModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useUserModal = create<UserModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

export default useUserModal;