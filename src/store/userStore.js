import { create } from 'zustand';
import { fetchUsers } from './api';

const useUserStore = create((set) => ({
  users: [],
  loadUsers: async () => {
    const users = await fetchUsers();
    set({ users });
  },
}));

export default useUserStore;
