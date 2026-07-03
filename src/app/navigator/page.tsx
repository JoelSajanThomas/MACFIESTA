"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { RiNavigationLine, RiCompass3Line, RiMapPinRangeLine, RiSearch2Line, RiCameraLine } from "react-icons/ri";

const waypoints = [
  { name: "Main Entrance / Parking", type: "entry", coord: "A1" },
  { name: "MACFAST Main Seminar Hall", type: "hall", coord: "B3" },
  { name: "MCA Computer Lab 3", type: "lab", coord: "C2" },
  { name: "Esports Lounge Arena", type: "arena", coord: "C4" },
  { name: "Outdoor Stage Grounds", type: "stage", coord: "D1" },
  { name: "Food Court Canopy", type: "food", coord: "E2" },
  { name: "Restrooms & Exits", type: "service", coord: "F1" }
];

export default function CampusNavigatorPage() {
  const [search, setSearch] = useState("");
  const [selectedWaypoint, setSelectedWaypoint] = useState<any | null>(null);
  const [arMode, setArMode] = useState(false);

  const filtered = waypoints.filter((w) => w.name.toLowerCase().includes(search.toLowerCase()));

  const startNavigation = (wp: any) => {
    setSelectedWaypoint(wp);
    alert(`Voice Navigation started: Proceed 50 meters straight towards ${wp.name}.`);
  };

  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
            AR Campus <span className="gradient-text-gold neon-gold">Navigator</span>
          </h1>
          <p className="text-white/60 text-sm md:text-base">
            Integrated 3D wayfinding maps, voice guidance coordinates, and mobile camera WebXR overlays.
          </p>
        </div>

        {/* Navigator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left panel - Search & waypoint list */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="relative">
                <RiSearch2Line className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
                <input
                  type="text"
                  placeholder="Search halls, labs, parking..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-sm"
                />
              </div>

              {/* Waypoint list */}
              <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                {filtered.map((wp) => (
                  <div
                    key={wp.name}
                    onClick={() => setSelectedWaypoint(wp)}
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                      selectedWaypoint?.name === wp.name
                        ? "bg-festival-gold/10 border-festival-gold text-festival-gold"
                        : "bg-white/2 border-white/5 hover:border-white/10 text-white"
                    }`}
                  >
                    <div className="space-y-1 text-left">
                      <span className="block font-bold text-sm">{wp.name}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-white/40">{wp.type} • Zone {wp.coord}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startNavigation(wp);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-festival-gold hover:text-festival-dark transition-colors"
                      aria-label={`Navigate to ${wp.name}`}
                    >
                      <RiNavigationLine />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right panel - Simulated 3D Campus Map or Camera viewport */}
          <div className="lg:col-span-7">
            <div className="glass h-[450px] rounded-3xl border border-white/5 overflow-hidden relative shadow-2xl bg-black">
              
              {arMode ? (
                /* AR Camera Mock Viewport */
                <div className="w-full h-full flex flex-col justify-between p-6 items-center text-center bg-zinc-900/50">
                  <div className="w-fit p-3.5 rounded-full bg-festival-pink/15 border border-festival-pink/30 text-festival-pink animate-pulse text-2xl">
                    <RiCameraLine />
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-center animate-bounce text-4xl text-festival-gold">
                      <RiNavigationLine className="-rotate-45" />
                    </div>
                    <div className="glass p-4 rounded-xl border border-white/10 max-w-sm">
                      <span className="block text-xs uppercase tracking-widest text-festival-gold font-bold">AR Arrow Marker</span>
                      <p className="text-white text-xs mt-1">Walk 20 meters straight towards MACFAST main lobby, then take left.</p>
                    </div>
                  </div>

                  <button
                    onClick={() => setArMode(false)}
                    className="btn-outline text-xs px-5 py-2.5"
                  >
                    Switch to Map View
                  </button>
                </div>
              ) : (
                /* 2D/3D map grid representation */
                <div className="w-full h-full flex flex-col justify-between p-6 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.03)_10%,transparent_80%)]">
                  {/* Styled coordinates lines */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />
                  
                  <div className="flex justify-between items-center z-10">
                    <span className="text-xs uppercase font-bold text-white/40 tracking-wider flex items-center gap-1.5" style={{ fontFamily: "var(--font-heading)" }}>
                      <RiCompass3Line />
                      <span>2D / 3D Grid Map View</span>
                    </span>

                    <button
                      onClick={() => setArMode(true)}
                      className="btn-primary flex items-center gap-1.5 text-xs px-4 py-2 bg-gradient-to-r from-festival-purple to-festival-pink"
                    >
                      <RiCameraLine />
                      <span>Launch AR Mode</span>
                    </button>
                  </div>

                  {/* Pin selected element indicator */}
                  {selectedWaypoint ? (
                    <div className="z-10 flex flex-col items-center justify-center space-y-2 max-w-xs mx-auto text-center animate-scale-in">
                      <div className="p-3.5 bg-festival-gold/15 border border-festival-gold/30 text-festival-gold rounded-full animate-bounce text-xl">
                        <RiMapPinRangeLine />
                      </div>
                      <div className="glass p-4 rounded-xl border border-white/5">
                        <span className="block font-bold text-sm text-white">{selectedWaypoint.name}</span>
                        <span className="block text-[10px] text-white/40 uppercase mt-0.5">Location ID: {selectedWaypoint.coord}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="z-10 text-center text-white/30 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
                      Select a destination waypoint to track guidance paths
                    </div>
                  )}

                  <div className="z-10 flex justify-between text-[10px] text-white/20 uppercase tracking-widest" style={{ fontFamily: "var(--font-heading)" }}>
                    <span>Grid Region: C-4</span>
                    <span>Scale 1:500</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
