import { create } from 'zustand';
import api from './api';

const useUserStore = create((set) => ({
  users: [],
  loadUsers: async () => {
    try {
      const users = await api.getUsers();
      set({ users });
    } catch (error) {
      console.error('Failed to load users:', error);
    }
  },
}));

export default useUserStore;
