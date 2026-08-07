"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VolunteersPluralPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/volunteer/login");
  }, [router]);

  return (
    <div className="bg-[#05050A] min-h-screen flex items-center justify-center font-mono">
      <div className="text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">
        Redirecting to Volunteer Portal Login...
      </div>
    </div>
  );
}
