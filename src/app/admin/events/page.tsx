"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminEventsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/console");
  }, [router]);

  return (
    <div className="bg-zinc-950 min-h-screen flex items-center justify-center text-amber-400 text-xs font-bold uppercase tracking-widest animate-pulse">
      Redirecting to Admin Console Events Arena...
    </div>
  );
}
