// src/hooks/useOnlineStatus.ts
import { useSocketStore } from "@/store/userOnlineStore";

/**
 * Hook to check if a user is online
 * 
 * @param userId The user ID to check
 * @returns An object with the user's online status
 */
export function useOnlineStatus(userId: string | undefined) {
  const { onlineUsers } = useSocketStore();
  
  // Return early if no userId provided
  if (!userId) {
    return {
      isOnline: false,
      onlineUsers
    };
  }
  
  return {
    isOnline: onlineUsers.includes(userId),
    onlineUsers
  };
}