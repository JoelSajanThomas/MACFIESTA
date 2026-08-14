"use client";

import { useEffect } from "react";

/**
 * Loads Bootstrap's JavaScript bundle on the client side only.
 * This enables interactive Bootstrap components: modals, dropdowns,
 * tooltips, popovers, collapse, offcanvas, etc.
 *
 * Placed here (not directly in layout) to keep it a Client Component
 * while the root layout remains a Server Component.
 */
export function BootstrapClient() {
  useEffect(() => {
    // Dynamically import Bootstrap JS so it only runs in the browser.
    // Import from the main 'bootstrap' entry point so TypeScript can
    // resolve the built-in type declarations that ship with Bootstrap 5.
    import("bootstrap").catch(() => {
      // Silent fail — CSS-only Bootstrap still works without JS
    });
  }, []);

  return null;
}
