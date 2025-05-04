// hooks/useOtherProfile.ts
import { useState, useEffect } from "react";
import { OtherProfile, User } from "@/types/types";

export function useOtherProfile(userId?: string) {
  const [profile, setProfile] = useState<OtherProfile | null>(null);
  const [profileLoading, setLoading] = useState<boolean>(!!userId);
  const [profileError, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      // if no userId yet, don't fetch and clear state
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    (async () => {
      try {
        // console.log("fetching profile for", userId);
        const res = await fetch(`/api/profiles/${userId}`);
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        const data = await res.json();
        // console.log("profile API returned", data.otherProfile);
        setProfile(data.otherProfile);
      } catch (err: any) {
        console.error("Failed to fetch other profile:", err);
        setError(err.message);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  return { profile, profileLoading, profileError };
}
