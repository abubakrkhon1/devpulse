// src/store/userOnlineStore.ts
import { create } from 'zustand';

// Define types for our store
type OnlineUsersState = {
  onlineUsers: string[];
  setOnlineUsers: (users: string[]) => void;
  addOnlineUser: (userId: string) => void;
  removeOnlineUser: (userId: string) => void;
  isUserOnline: (userId: string) => boolean;
  getOnlineCount: () => number;
}

// Create the store with types
export const useSocketStore = create<OnlineUsersState>((set, get) => ({
  // State
  onlineUsers: [],
  
  // Actions
  setOnlineUsers: (users: string[]) => set({ onlineUsers: users }),
  
  addOnlineUser: (userId: string) => set((state) => {
    // Only add if not already in the list
    if (!state.onlineUsers.includes(userId)) {
      return { onlineUsers: [...state.onlineUsers, userId] };
    }
    return state;
  }),
  
  removeOnlineUser: (userId: string) => set((state) => ({
    onlineUsers: state.onlineUsers.filter(id => id !== userId)
  })),
  
  isUserOnline: (userId: string) => {
    const { onlineUsers } = get();
    return onlineUsers.includes(userId);
  },
  
  // For debugging purposes
  getOnlineCount: () => get().onlineUsers.length
}));