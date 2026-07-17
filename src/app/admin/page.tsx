"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";

export default function AdminRootPage() {
  const router = useRouter();
  const { user, token, isInitialized } = useAuthStore();

  useEffect(() => {
    if (isInitialized) {
      if (token && user && user.role === "admin") {
        router.replace("/admin/console");
      } else {
        router.replace("/admin/login");
      }
    }
  }, [isInitialized, token, user, router]);

  return (
    <div className="bg-festival-dark min-h-screen flex items-center justify-center">
      <div className="text-white/40 text-sm font-bold uppercase tracking-widest animate-pulse">
        Redirecting...
      </div>
    </div>
  );
}
