"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NavigatorRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/accommodation");
  }, [router]);

  return (
    <div className="bg-festival-dark min-h-screen pt-28 flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-4 border-festival-gold border-t-transparent rounded-full animate-spin" />
      <p className="text-white/70 text-sm font-semibold tracking-wider uppercase">
        Redirecting to Accommodation Facilities...
      </p>
    </div>
  );
}
