"use client";

import { useState } from "react";
import {
  RiGalleryLine,
  RiVideoLine,
  RiFolderOpenLine,
  RiUploadCloudLine,
} from "react-icons/ri";

export function GalleryModule() {
  const [photos] = useState([
    { id: "p1", title: "Inauguration Lighting Ceremony", album: "Day 1 Highlights", date: "Sep 24, 2026", size: "2.4 MB" },
    { id: "p2", title: "Battle of Bands Stage Performance", album: "Cultural Night", date: "Sep 24, 2026", size: "4.1 MB" },
  ]);

  return (
    <div className="space-y-6 select-none">
      <div className="glass p-4 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Media Gallery & Photo / Video Albums Center
          </h2>
          <p className="text-xs text-white/40">Upload festival photography and video highlights for website display</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
        {photos.map((p) => (
          <div key={p.id} className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <h4 className="font-extrabold text-white">{p.title}</h4>
            <p className="text-[10px] text-white/40">{p.album} • {p.size}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
