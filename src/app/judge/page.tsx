"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JudgeRootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/judge/login");
  }, [router]);

  return (
    <div className="bg-[#05050A] min-h-screen flex items-center justify-center font-mono">
      <div className="text-metallic-gold/50 text-xs font-bold uppercase tracking-widest animate-pulse">
        Redirecting to Executive Jury Portal...
      </div>
    </div>
  );
}
