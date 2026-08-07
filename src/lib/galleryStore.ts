"use client";

import { useState, useEffect } from "react";

export interface GalleryMediaItem {
  id: string;
  type: "image" | "video";
  title: string;
  category: "gaming" | "cultural" | "technical" | "general";
  url: string;
  thumbnailUrl?: string;
  album: string;
  date: string;
  active: boolean;
}

const DEFAULT_GALLERY_ITEMS: GalleryMediaItem[] = [
  {
    id: "img-1",
    type: "image",
    category: "gaming",
    title: "Thor Gaming Arena Esports Finals",
    album: "Esports Tournament",
    url: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    date: "2026-08-07",
    active: true,
  },
  {
    id: "img-2",
    type: "image",
    category: "cultural",
    title: "Choreo Dance & Dusk 'N Dawn Live Pro Show",
    album: "Cultural Pro Night",
    url: "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=800&auto=format&fit=crop",
    date: "2026-08-07",
    active: true,
  },
  {
    id: "img-3",
    type: "image",
    category: "technical",
    title: "Byte & Code Hackathon Dev Labs",
    album: "Tech Hackathon",
    url: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=800&auto=format&fit=crop",
    date: "2026-08-07",
    active: true,
  },
  {
    id: "vid-1",
    type: "video",
    category: "cultural",
    title: "MacFiesta Official Teaser Video",
    album: "Fest Highlights",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop",
    date: "2026-08-07",
    active: true,
  },
  {
    id: "img-4",
    type: "image",
    category: "general",
    title: "Inauguration Lighting Ceremony",
    album: "Opening Ceremony",
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
    date: "2026-08-07",
    active: true,
  },
  {
    id: "vid-2",
    type: "video",
    category: "gaming",
    title: "Valorant Tournament Winning Moments",
    album: "Esports Tournament",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnailUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
    date: "2026-08-07",
    active: true,
  },
];

let syncChannel: BroadcastChannel | null = null;
let listeners: Array<() => void> = [];

if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    syncChannel = new BroadcastChannel("macfiesta_gallery_sync");
    syncChannel.onmessage = () => {
      notifyListeners();
    };
  } catch {}
}

function notifyListeners() {
  listeners.forEach((l) => l());
  if (syncChannel) {
    try {
      syncChannel.postMessage("updated");
    } catch {}
  }
}

export function getGalleryItems(): GalleryMediaItem[] {
  if (typeof window === "undefined") return DEFAULT_GALLERY_ITEMS;
  try {
    const saved = localStorage.getItem("macfiesta_gallery_items");
    return saved ? JSON.parse(saved) : DEFAULT_GALLERY_ITEMS;
  } catch {
    return DEFAULT_GALLERY_ITEMS;
  }
}

export function saveGalleryItems(items: GalleryMediaItem[]): GalleryMediaItem[] {
  try {
    localStorage.setItem("macfiesta_gallery_items", JSON.stringify(items));
  } catch {}
  notifyListeners();
  return items;
}

export function addGalleryItem(item: Omit<GalleryMediaItem, "id" | "date" | "active">): GalleryMediaItem {
  const current = getGalleryItems();
  const newItem: GalleryMediaItem = {
    ...item,
    id: `${item.type}-${Date.now()}`,
    date: new Date().toISOString().slice(0, 10),
    active: true,
  };
  const updated = [newItem, ...current];
  saveGalleryItems(updated);
  return newItem;
}

export function toggleGalleryItemActive(id: string): GalleryMediaItem[] {
  const current = getGalleryItems();
  const updated = current.map((item) => (item.id === id ? { ...item, active: !item.active } : item));
  saveGalleryItems(updated);
  return updated;
}

export function deleteGalleryItem(id: string): GalleryMediaItem[] {
  const current = getGalleryItems();
  const updated = current.filter((item) => item.id !== id);
  saveGalleryItems(updated);
  return updated;
}

export function useGalleryStore() {
  const [items, setItems] = useState<GalleryMediaItem[]>([]);

  const refresh = () => {
    setItems(getGalleryItems());
  };

  useEffect(() => {
    refresh();

    const handleChange = () => refresh();
    listeners.push(handleChange);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "macfiesta_gallery_items") handleChange();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("storage", handleStorage);
    }

    return () => {
      listeners = listeners.filter((l) => l !== handleChange);
      if (typeof window !== "undefined") {
        window.removeEventListener("storage", handleStorage);
      }
    };
  }, []);

  return {
    items,
    images: items.filter((i) => i.type === "image"),
    videos: items.filter((i) => i.type === "video"),
    addItem: addGalleryItem,
    toggleActive: toggleGalleryItemActive,
    deleteItem: deleteGalleryItem,
    saveItems: saveGalleryItems,
  };
}
