// app/profiles/[userId]/page.tsx
"use client";

import { useParams } from "next/navigation";
import OtherProfilePage from "@/components/otherProfile";
import UserProfile from "@/components/userProfile";
import { useUser } from "@/hooks/useAuthedUser";
import { useOtherProfile } from "@/hooks/useOtherProfile";
import { OtherProfile } from "@/types/types";

export default function AccountPage() {
  // 1) grab the dynamic segment:
  const { userId } = useParams();

  // 2) fetch the “other” profile
  const { profile, profileLoading, profileError } = useOtherProfile(
    userId as string
  );

  // 3) fetch your own auth’d user
  const { user, loading: authLoading, error: authError } = useUser();

  const loadingProp = authLoading || profileLoading;

  const errorProp = authError || profileError;

  // 4) loading / error states
  if (profileLoading || authLoading)
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background to-secondary/5">
        <div className="flex flex-col items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-primary/10 animate-pulse"></div>
          <div className="h-4 w-48 bg-primary/10 rounded animate-pulse"></div>
          <div className="h-3 w-32 bg-primary/10 rounded animate-pulse"></div>
        </div>
      </div>
    );
  if (profileError) return <div>Error: {profileError}</div>;
  if (authError) return <div>Error: {authError}</div>;

  // 5) decide which component to render
  const isOwnProfile = user?._id === profile?._id;
  return isOwnProfile ? (
    <UserProfile user={user!} loading={false} error={null} />
  ) : (
    <OtherProfilePage
      profile={profile!}
      currentUser={user}
      loading={loadingProp}
      error={errorProp}
    />
  );
}
