import { User } from "@/types/types";
import { useEffect, useState } from "react";

export function useTokenUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const res = await fetch("http://localhost:3005/api/auth/me", {
          credentials: "include",
        });

        if (!res.ok) {
          // Try refreshing the token
          const refreshRes = await fetch(
            "http://localhost:3005/api/auth/refresh",
            {
              method:"POST",
              credentials: "include",
            }
          );

          if (!refreshRes.ok) throw new Error("Could not refresh token");

          // Retry /me after refresh
          const retry = await fetch("http://localhost:3005/api/auth/me", {
            credentials: "include",
          });

          if (!retry.ok) throw new Error("Still unauthorized");

          const retryData = await retry.json();
          setUser(retryData.user);
        } else {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err: any) {
        setUser(null);
        setError(err.message || "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  return { user, loading, error };
}
