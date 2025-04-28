import { useState, useEffect } from "react";
import { User } from "@/types/types";

export function useUser(): {
  user: User | null;
  loading: boolean;
  error: string | null;
} {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch("/api/auth/checkAuth");

        if (!res.ok) {
          setUser(null);
          throw new Error("Not authenticated!");
        }

        const data = await res.json();

        setUser(data.user);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []);

  return { user, loading, error };
}
