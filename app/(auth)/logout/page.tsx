"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();
  useEffect(() => {
    async function request() {
      const req = await fetch("http://localhost:3005/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      console.log(req);
      if (req.ok) router.push("/");
      else console.log("Error logging out!");
    }
    request();
  }, [router]);
  return null;
}
