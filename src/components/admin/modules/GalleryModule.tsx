"use client";

import { useState } from "react";
import {
  RiImageLine,
  RiVideoLine,
  RiAddLine,
  RiDeleteBinLine,
  RiEyeLine,
  RiEyeOffLine,
  RiCheckDoubleLine,
  RiPlayLine,
  RiExternalLinkLine,
  RiCloseLine,
  RiSaveLine,
  RiSparklingLine,
  RiSearchLine,
} from "react-icons/ri";
import { useGalleryStore, GalleryMediaItem } from "@/lib/galleryStore";

export function GalleryModule() {
  const { items, images, videos, addItem, toggleActive, deleteItem } = useGalleryStore();

  const [activeTab, setActiveTab] = useState<"images" | "videos">("images");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusMsg, setStatusMsg] = useState("");

  // Modals
  const [showImageModal, setShowImageModal] = useState(false);
  const [showVideoModal, setShowVideoModal] = useState(false);

  // Add Image Form
  const [imgTitle, setImgTitle] = useState("");
  const [imgAlbum, setImgAlbum] = useState("Fest Highlights");
  const [imgCategory, setImgCategory] = useState<"gaming" | "cultural" | "technical" | "general">("cultural");
  const [imgUrl, setImgUrl] = useState("");

  // Add Video Form
  const [vidTitle, setVidTitle] = useState("");
  const [vidAlbum, setVidAlbum] = useState("Fest Highlights");
  const [vidCategory, setVidCategory] = useState<"gaming" | "cultural" | "technical" | "general">("cultural");
  const [vidUrl, setVidUrl] = useState("");
  const [vidThumb, setVidThumb] = useState("");

  const triggerToast = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3500);
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imgTitle || !imgUrl) return;

    addItem({
      type: "image",
      title: imgTitle,
      album: imgAlbum || "General Album",
      category: imgCategory,
      url: imgUrl,
    });

    setImgTitle("");
    setImgUrl("");
    setShowImageModal(false);
    triggerToast("✓ Image Added & Published Live to Website Gallery!");
  };

  const handleAddVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!vidTitle || !vidUrl) return;

    let processedUrl = vidUrl;
    if (vidUrl.includes("youtube.com/watch?v=")) {
      const vId = vidUrl.split("v=")[1]?.split("&")[0];
      if (vId) processedUrl = `https://www.youtube.com/embed/${vId}`;
    } else if (vidUrl.includes("youtu.be/")) {
      const vId = vidUrl.split("youtu.be/")[1]?.split("?")[0];
      if (vId) processedUrl = `https://www.youtube.com/embed/${vId}`;
    }

    addItem({
      type: "video",
      title: vidTitle,
      album: vidAlbum || "Video Highlights",
      category: vidCategory,
      url: processedUrl,
      thumbnailUrl: vidThumb || "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
    });

    setVidTitle("");
    setVidUrl("");
    setVidThumb("");
    setShowVideoModal(false);
    triggerToast("✓ Video Highlight Added & Published Live to Website Gallery!");
  };

  const filteredImages = images.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredVideos = videos.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.album.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 select-none font-mono">
      {/* Toast Alert */}
      {statusMsg && (
        <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold rounded-xl animate-pulse flex items-center gap-2">
          <RiCheckDoubleLine className="text-base" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass p-6 rounded-3xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0A0D1A]">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-arc-cyan/10 border border-arc-cyan/30 text-arc-cyan text-[10px] font-bold uppercase tracking-widest mb-1">
            <RiSparklingLine className="animate-spin-slow" />
            <span>REAL-TIME MEDIA & GALLERY CONTROLLER</span>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Media Gallery <span className="marvel-bang-comic-gradient font-black">Manager</span>
          </h2>
          <p className="text-xs text-white/50">
            Separately add, manage, and toggle photos and video highlights live on macfiesta.macfast.org.
          </p>
        </div>

        {/* Separate Action Buttons for Adding Image & Video */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setShowImageModal(true)}
            className="px-4 py-2.5 rounded-xl bg-arc-cyan text-black font-bold text-xs hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_#00D4FF]"
          >
            <RiImageLine className="text-base" />
            <span>+ Add Image Separately</span>
          </button>

          <button
            onClick={() => setShowVideoModal(true)}
            className="px-4 py-2.5 rounded-xl bg-marvel-red text-white font-bold text-xs hover:bg-rose-600 transition-colors cursor-pointer flex items-center gap-1.5 shadow-[0_0_15px_#ED1D24]"
          >
            <RiVideoLine className="text-base" />
            <span>+ Add Video Separately</span>
          </button>
        </div>
      </div>

      {/* TABS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-black/60 p-2 rounded-2xl border border-white/10">
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("images")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "images"
                ? "bg-arc-cyan text-black shadow-[0_0_15px_#00D4FF]"
                : "text-white/60 hover:text-white"
            }`}
          >
            <RiImageLine />
            <span>Images ({images.length})</span>
          </button>

          <button
            onClick={() => setActiveTab("videos")}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
              activeTab === "videos"
                ? "bg-marvel-red text-white shadow-[0_0_15px_#ED1D24]"
                : "text-white/60 hover:text-white"
            }`}
          >
            <RiVideoLine />
            <span>Videos ({videos.length})</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64 text-xs">
          <input
            type="text"
            placeholder="Search gallery media..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-black/80 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
          />
          <RiSearchLine className="absolute right-3 top-2.5 text-white/40" />
        </div>
      </div>

      {/* 1. IMAGES GALLERY GRID */}
      {activeTab === "images" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredImages.map((img) => (
            <div
              key={img.id}
              className={`rounded-2xl border p-3 space-y-3 transition-all ${
                img.active
                  ? "bg-black/60 border-white/10 hover:border-arc-cyan"
                  : "bg-black/30 border-white/5 opacity-50"
              }`}
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/80 border border-white/10 group">
                <img src={img.url} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-arc-cyan font-bold text-[9px] uppercase border border-arc-cyan/30">
                  {img.category}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white truncate">{img.title}</h4>
                <p className="text-[10px] text-white/50">{img.album} • {img.date}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <button
                  onClick={() => {
                    toggleActive(img.id);
                    triggerToast("✓ Image Visibility Toggled!");
                  }}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    img.active ? "text-emerald-400 hover:bg-emerald-500/20" : "text-white/40 hover:bg-white/10"
                  }`}
                  title={img.active ? "Hide on website" : "Show on website"}
                >
                  {img.active ? <RiEyeLine /> : <RiEyeOffLine />}
                  <span>{img.active ? "Live" : "Hidden"}</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm("Delete this image from gallery?")) {
                      deleteItem(img.id);
                      triggerToast("✓ Image Deleted!");
                    }
                  }}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  title="Delete Image"
                >
                  <RiDeleteBinLine />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 2. VIDEOS GALLERY GRID */}
      {activeTab === "videos" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredVideos.map((vid) => (
            <div
              key={vid.id}
              className={`rounded-2xl border p-3 space-y-3 transition-all ${
                vid.active
                  ? "bg-black/60 border-white/10 hover:border-marvel-red"
                  : "bg-black/30 border-white/5 opacity-50"
              }`}
            >
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-black/80 border border-white/10 group">
                <img src={vid.thumbnailUrl || vid.url} alt={vid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-marvel-red text-white flex items-center justify-center shadow-[0_0_15px_#ED1D24]">
                    <RiPlayLine size={20} />
                  </div>
                </div>
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-marvel-red font-bold text-[9px] uppercase border border-marvel-red/30">
                  VIDEO · {vid.category}
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="text-xs font-bold text-white truncate">{vid.title}</h4>
                <p className="text-[10px] text-white/50">{vid.album} • {vid.date}</p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
                <button
                  onClick={() => {
                    toggleActive(vid.id);
                    triggerToast("✓ Video Visibility Toggled!");
                  }}
                  className={`p-1.5 rounded-lg text-xs font-bold flex items-center gap-1 cursor-pointer ${
                    vid.active ? "text-emerald-400 hover:bg-emerald-500/20" : "text-white/40 hover:bg-white/10"
                  }`}
                  title={vid.active ? "Hide on website" : "Show on website"}
                >
                  {vid.active ? <RiEyeLine /> : <RiEyeOffLine />}
                  <span>{vid.active ? "Live" : "Hidden"}</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm("Delete this video from gallery?")) {
                      deleteItem(vid.id);
                      triggerToast("✓ Video Highlight Deleted!");
                    }
                  }}
                  className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  title="Delete Video"
                >
                  <RiDeleteBinLine />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 🖼️ MODAL 1: ADD IMAGE SEPARATELY */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full glass p-6 rounded-3xl border border-arc-cyan/40 bg-[#0A0D1A] space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <RiImageLine className="text-arc-cyan" />
                <span>Add Image to Gallery</span>
              </h3>
              <button onClick={() => setShowImageModal(false)} className="text-white/40 hover:text-white">
                <RiCloseLine size={20} />
              </button>
            </div>

            <form onSubmit={handleAddImage} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 font-bold mb-1">Image Title</label>
                <input
                  type="text"
                  placeholder="e.g. Battle of Bands Crowd"
                  value={imgTitle}
                  onChange={(e) => setImgTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 font-bold mb-1">Album / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Cultural Pro Show"
                    value={imgAlbum}
                    onChange={(e) => setImgAlbum(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-bold mb-1">Category</label>
                  <select
                    value={imgCategory}
                    onChange={(e) => setImgCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                  >
                    <option value="cultural">Cultural</option>
                    <option value="gaming">Gaming</option>
                    <option value="technical">Technical</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-1">Image URL / File Link</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={imgUrl}
                  onChange={(e) => setImgUrl(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white font-mono focus:border-arc-cyan focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowImageModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-arc-cyan text-black font-extrabold flex items-center gap-1.5 shadow-[0_0_15px_#00D4FF] cursor-pointer"
                >
                  <RiSaveLine size={16} /> Publish Image
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🎥 MODAL 2: ADD VIDEO SEPARATELY */}
      {showVideoModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full glass p-6 rounded-3xl border border-marvel-red/40 bg-[#0A0D1A] space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <RiVideoLine className="text-marvel-red" />
                <span>Add Video Highlight to Gallery</span>
              </h3>
              <button onClick={() => setShowVideoModal(false)} className="text-white/40 hover:text-white">
                <RiCloseLine size={20} />
              </button>
            </div>

            <form onSubmit={handleAddVideo} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 font-bold mb-1">Video Title</label>
                <input
                  type="text"
                  placeholder="e.g. DJ Night Teaser Aftermovie"
                  value={vidTitle}
                  onChange={(e) => setVidTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:border-marvel-red focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 font-bold mb-1">Album / Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. Aftermovie Highlights"
                    value={vidAlbum}
                    onChange={(e) => setVidAlbum(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:border-marvel-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-bold mb-1">Category</label>
                  <select
                    value={vidCategory}
                    onChange={(e) => setVidCategory(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:border-marvel-red focus:outline-none"
                  >
                    <option value="cultural">Cultural</option>
                    <option value="gaming">Gaming</option>
                    <option value="technical">Technical</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-1">Video URL / YouTube Embed URL</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={vidUrl}
                  onChange={(e) => setVidUrl(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white font-mono focus:border-marvel-red focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-1">Cover Thumbnail Image URL (Optional)</label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={vidThumb}
                  onChange={(e) => setVidThumb(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white font-mono focus:border-marvel-red focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowVideoModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/10 text-white font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-marvel-red text-white font-extrabold flex items-center gap-1.5 shadow-[0_0_15px_#ED1D24] cursor-pointer"
                >
                  <RiSaveLine size={16} /> Publish Video
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
