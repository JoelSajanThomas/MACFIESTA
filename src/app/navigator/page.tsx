"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  RiNavigationLine, 
  RiCompass3Line, 
  RiMapPinRangeLine, 
  RiSearch2Line, 
  RiCameraLine,
  RiArrowLeftLine,
  RiSignalWifiErrorLine,
  RiCompassDiscoverLine,
  RiBaseStationLine,
  RiRestartLine,
  RiPlayLine,
  RiPauseLine,
  RiCheckboxCircleLine,
  RiQuestionLine,
  RiCloseLine
} from "react-icons/ri";

// Campus Waypoints with real-world MACFAST coordinates (Centred around 9.3789, 76.5796)
const waypoints = [
  { name: "Main Entrance / Parking", type: "entry", coord: "A1", lat: 9.37875, lon: 76.57920, description: "Main entry gates & central parking area" },
  { name: "MACFAST Main Seminar Hall", type: "hall", coord: "B3", lat: 9.37895, lon: 76.57955, description: "Auditorium & primary seminar hall" },
  { name: "MCA Computer Lab 3", type: "lab", coord: "C2", lat: 9.37920, lon: 76.57945, description: "Technical lab room on the second floor" },
  { name: "Esports Lounge Arena", type: "arena", coord: "C4", lat: 9.37910, lon: 76.57970, description: "Gaming hub & tournament rooms" },
  { name: "Outdoor Stage Grounds", type: "stage", coord: "D1", lat: 9.37860, lon: 76.57980, description: "Cultural stage and event lawn grounds" },
  { name: "Food Court Canopy", type: "food", coord: "E2", lat: 9.37845, lon: 76.57950, description: "Rest stops and food stalls zone" },
  { name: "Restrooms & Exits", type: "service", coord: "F1", lat: 9.37890, lon: 76.57930, description: "Utility rooms & side emergency exit" }
];

export default function CampusNavigatorPage() {
  const [search, setSearch] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [selectedWaypoint, setSelectedWaypoint] = useState<typeof waypoints[0] | null>(null);
  const [arMode, setArMode] = useState(false);

  // GPS & Sensor States
  const [userLocation, setUserLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [compassHeading, setCompassHeading] = useState<number>(0);
  const [isCalibrating, setIsCalibrating] = useState(false);
  const [calibrationOffset, setCalibrationOffset] = useState<number>(0);
  const [isIOSPermissionNeeded, setIsIOSPermissionNeeded] = useState(false);
  const [showCalibrationGuide, setShowCalibrationGuide] = useState(false);

  // Simulation Mode States
  const [isSimulationMode, setIsSimulationMode] = useState(true); // Default to true for desktop testing
  const [simSpeed, setSimSpeed] = useState<number>(1.5); // speed in m/s
  const [isWalking, setIsWalking] = useState(false);

  // Camera stream elements
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");

  // DOM Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const watchIdRef = useRef<number | null>(null);

  // Initial user location coordinate setup
  useEffect(() => {
    setUserLocation({ lat: 9.37885, lon: 76.57940 });
    
    if (
      typeof window !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      setIsIOSPermissionNeeded(true);
    }
  }, []);

  // Filter waypoints based on search keyword with simulated visual loading lag
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setIsSearching(true);
    const timer = setTimeout(() => {
      setIsSearching(false);
    }, 400);
    return () => clearTimeout(timer);
  };

  const filtered = waypoints.filter((w) => w.name.toLowerCase().includes(search.toLowerCase()));

  // Active watchPosition GPS integration
  useEffect(() => {
    if (isSimulationMode) {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    if (typeof window === "undefined" || !navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      return;
    }

    setGpsError(null);
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude
        });
      },
      (err) => {
        console.error(err);
        setGpsError(`GPS Access Denied. Fallback to Simulation Mode.`);
        setIsSimulationMode(true);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [isSimulationMode]);

  // Handle Compass Sensor / Device Orientation events
  useEffect(() => {
    const handleOrientation = (e: DeviceOrientationEvent) => {
      const webkitCompass = (e as any).webkitCompassHeading;
      if (webkitCompass !== undefined && webkitCompass !== null) {
        setCompassHeading(webkitCompass);
      } else if (e.alpha !== null) {
        setCompassHeading((360 - e.alpha) % 360);
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("deviceorientation", handleOrientation);
      window.addEventListener("deviceorientationabsolute", handleOrientation);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleOrientation);
        window.removeEventListener("deviceorientationabsolute", handleOrientation);
      }
    };
  }, []);

  // Distance & Bearing calculations helper
  const getDistanceAndBearing = useCallback(() => {
    if (!userLocation || !selectedWaypoint) return { distance: 0, bearing: 0 };
    const lat1 = userLocation.lat;
    const lon1 = userLocation.lon;
    const lat2 = selectedWaypoint.lat;
    const lon2 = selectedWaypoint.lon;

    const dy = (lat2 - lat1) * 111111;
    const dx = (lon2 - lon1) * 111111 * Math.cos((lat1 * Math.PI) / 180);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    let bearing = (Math.atan2(dx, dy) * 180) / Math.PI;
    if (bearing < 0) bearing += 360;

    return { distance, bearing };
  }, [userLocation, selectedWaypoint]);

  const stopCameraStream = useCallback(() => {
    if (cameraStream) {
      cameraStream.getTracks().forEach((track) => track.stop());
      setCameraStream(null);
    }
  }, [cameraStream]);

  const startCameraStream = useCallback(async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err: any) {
      console.error(err);
      setCameraError("Camera access denied or device is not ready.");
    }
  }, [facingMode]);

  // Handle Camera streams setup in AR Mode
  useEffect(() => {
    if (!arMode) {
      stopCameraStream();
      return;
    }

    startCameraStream();

    return () => {
      stopCameraStream();
    };
  }, [arMode, facingMode, startCameraStream, stopCameraStream]);

  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === "environment" ? "user" : "environment"));
  };

  const requestiOSSensorPermission = async () => {
    if (
      typeof window !== "undefined" &&
      typeof (DeviceOrientationEvent as any).requestPermission === "function"
    ) {
      try {
        const res = await (DeviceOrientationEvent as any).requestPermission();
        if (res === "granted") {
          setIsIOSPermissionNeeded(false);
        } else {
          alert("Compass sensor access denied. Using manual compass inputs.");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  const triggerHaptic = (pattern: number | number[]) => {
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(pattern);
    }
  };

  const triggerCalibration = () => {
    setIsCalibrating(true);
    triggerHaptic([100, 50, 100]);
    if (selectedWaypoint) {
      const { bearing: currentBearing } = getDistanceAndBearing();
      const idealOffset = (currentBearing - compassHeading + 360) % 360;
      setCalibrationOffset(idealOffset);
    } else {
      setCalibrationOffset(0);
    }
    setTimeout(() => {
      setIsCalibrating(false);
    }, 1500);
  };

  const { distance, bearing } = getDistanceAndBearing();

  // ETA Estimation: Walking average speed (1.4 meters per second)
  const etaMinutes = Math.ceil(distance / (isSimulationMode ? simSpeed : 1.4) / 60);

  // Simulation Walking loop triggers
  useEffect(() => {
    if (!isSimulationMode || !isWalking || !userLocation || !selectedWaypoint) return;

    const interval = setInterval(() => {
      const { distance: d, bearing: b } = getDistanceAndBearing();

      // Stop walking if arrived (threshold < 2 meters)
      if (d <= 2) {
        setIsWalking(false);
        triggerHaptic([300, 100, 300]);
        clearInterval(interval);
        return;
      }

      // Compute step delta
      const bearingRad = (b * Math.PI) / 180;
      const stepSize = simSpeed * 0.2; // 200ms step updates
      const dy = Math.cos(bearingRad) * stepSize;
      const dx = Math.sin(bearingRad) * stepSize;

      // Update location
      const newLat = userLocation.lat + dy / 111111;
      const newLon = userLocation.lon + dx / (111111 * Math.cos((userLocation.lat * Math.PI) / 180));

      setUserLocation({ lat: newLat, lon: newLon });
    }, 200);

    return () => clearInterval(interval);
  }, [isSimulationMode, isWalking, userLocation, selectedWaypoint, simSpeed, getDistanceAndBearing]);

  // AR Overlay dynamic render loop
  useEffect(() => {
    if (!arMode || !canvasRef.current || !userLocation || !selectedWaypoint) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let frameId: number;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 640;
      canvas.height = canvas.parentElement?.clientHeight || 450;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const drawLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const netHeading = (compassHeading + calibrationOffset) % 360;
      let relativeAngle = bearing - netHeading;
      if (relativeAngle < -180) relativeAngle += 360;
      if (relativeAngle > 180) relativeAngle -= 360;

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2 + 50;

      // Position the panel dynamically based on bearing
      const xOffset = Math.sin((relativeAngle * Math.PI) / 180) * (canvas.width / 3);
      const isVisible = Math.abs(relativeAngle) < 90; // Only visible if target is in front 180-deg field of camera

      if (isVisible) {
        const targetX = centerX + xOffset;
        const targetY = centerY - 100;

        // Draw dotted path vector line to floor pointer
        ctx.beginPath();
        ctx.strokeStyle = "rgba(234,179,8,0.5)";
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 4]);
        ctx.moveTo(targetX, targetY + 35);
        ctx.lineTo(targetX, centerY);
        ctx.stroke();
        ctx.setLineDash([]);

        // Billboard glassmorphic display
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.5)";
        ctx.shadowBlur = 12;

        ctx.fillStyle = "rgba(10, 15, 30, 0.85)";
        ctx.strokeStyle = "rgba(234,179,8,0.5)";
        ctx.lineWidth = 2;
        const rectW = 210;
        const rectH = 70;
        ctx.beginPath();
        ctx.roundRect(targetX - rectW / 2, targetY - rectH / 2, rectW, rectH, 16);
        ctx.fill();
        ctx.stroke();

        // Destination title text
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "900 11px Orbitron, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(selectedWaypoint.name.toUpperCase(), targetX, targetY - 12);

        // Distance & ETA text
        ctx.fillStyle = "#EAB308";
        ctx.font = "900 13px Inter, sans-serif";
        ctx.fillText(`${distance.toFixed(1)}m`, targetX - 35, targetY + 14);

        ctx.fillStyle = "rgba(255,255,255,0.7)";
        ctx.font = "bold 10px Inter, sans-serif";
        ctx.fillText(`ETA: ~${etaMinutes} min`, targetX + 35, targetY + 14);

        // Target center pointer
        ctx.beginPath();
        ctx.arc(targetX, centerY, 9, 0, 2 * Math.PI);
        ctx.fillStyle = "#EAB308";
        ctx.fill();
        ctx.strokeStyle = "#FFFFFF";
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.restore();
      }

      // Draw relative guidance HUD direction arrow
      const arrowY = canvas.height - 85;
      ctx.save();
      ctx.translate(centerX, arrowY);
      ctx.rotate((relativeAngle * Math.PI) / 180);

      const grad = ctx.createLinearGradient(0, -35, 0, 15);
      grad.addColorStop(0, "#FACC15");
      grad.addColorStop(1, "#7C3AED");

      ctx.beginPath();
      ctx.moveTo(0, -40); // tip
      ctx.lineTo(22, 10);
      ctx.lineTo(9, 5);
      ctx.lineTo(9, 25);
      ctx.lineTo(-9, 25);
      ctx.lineTo(-9, 5);
      ctx.lineTo(-22, 10);
      ctx.closePath();

      ctx.fillStyle = grad;
      ctx.shadowColor = "rgba(124,58,237,0.7)";
      ctx.shadowBlur = 18;
      ctx.fill();

      ctx.restore();

      frameId = requestAnimationFrame(drawLoop);
    };

    drawLoop();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [arMode, userLocation, selectedWaypoint, compassHeading, calibrationOffset, distance, etaMinutes, bearing]);

  const startNavigation = (wp: typeof waypoints[0]) => {
    setSelectedWaypoint(wp);
    setIsWalking(false);
    triggerHaptic(80);
  };

  // Turn Instructions Logic based on relative angles
  const getTurnDetails = () => {
    if (!selectedWaypoint) return { instruction: "Awaiting Destination Selection", type: "straight" };
    
    const netHeading = (compassHeading + calibrationOffset) % 360;
    let rel = bearing - netHeading;
    if (rel < -180) rel += 360;
    if (rel > 180) rel -= 360;

    if (distance <= 3) return { instruction: "You have arrived at your destination!", type: "arrival" };
    if (rel > 45 && rel < 135) return { instruction: "In 15 meters, turn right", type: "right" };
    if (rel < -45 && rel > -135) return { instruction: "In 15 meters, turn left", type: "left" };
    if (Math.abs(rel) >= 135) return { instruction: "Turn around (Make a U-Turn)", type: "uturn" };
    return { instruction: `Proceed straight for ${distance.toFixed(0)} meters`, type: "straight" };
  };

  const turnDetails = getTurnDetails();

  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16 text-white/90 selection:bg-festival-gold selection:text-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-white/5 pb-6">
          <div>
            <Link 
              href="/" 
              className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-festival-gold hover:text-festival-gold-light transition-colors mb-3 focus:outline-none focus:ring-1 focus:ring-festival-gold/50 rounded-lg px-2 py-1"
            >
              <RiArrowLeftLine className="text-sm" />
              <span>Back to home</span>
            </Link>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              AR Campus <span className="gradient-text-gold neon-gold">Navigator</span>
            </h1>
            <p className="text-white/50 text-xs sm:text-sm mt-1">
              Integrated real-time WebXR coordinates, vector maps, and mobile sensory pathfinding.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setIsSimulationMode(!isSimulationMode);
                triggerHaptic(50);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border transition-all ${
                isSimulationMode 
                  ? "bg-festival-gold/10 border-festival-gold text-festival-gold shadow-[0_0_10px_rgba(234,179,8,0.1)]" 
                  : "bg-white/5 border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {isSimulationMode ? "Simulation Active" : "GPS Location Active"}
            </button>
            {isIOSPermissionNeeded && (
              <button
                onClick={requestiOSSensorPermission}
                className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest bg-festival-purple/20 border border-festival-purple text-festival-purple-light animate-pulse"
              >
                Enable iOS Compass
              </button>
            )}
          </div>
        </div>

        {/* Dynamic Warning Banners */}
        {gpsError && !isSimulationMode && (
          <div className="p-4.5 bg-festival-pink/10 border border-festival-pink/30 rounded-2xl flex items-center gap-3 text-sm text-festival-pink-light">
            <RiSignalWifiErrorLine className="text-2xl shrink-0 animate-bounce" />
            <p>{gpsError}</p>
          </div>
        )}

        {/* Wayfinder Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Waypoint select drawer */}
          <div className="lg:col-span-4 space-y-6">
            
            <div className="glass p-5 sm:p-6 rounded-3xl border border-white/5 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 flex items-center gap-2 border-b border-white/5 pb-3">
                <RiCompassDiscoverLine className="text-lg text-festival-gold" />
                <span>Search Campus</span>
              </h3>

              <div className="relative">
                <RiSearch2Line className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40 text-lg" />
                <input
                  type="text"
                  placeholder="Search labs, halls, food court..."
                  value={search}
                  onChange={handleSearchChange}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-2xl focus:border-festival-gold/50 focus:outline-none text-white text-sm placeholder:text-white/30"
                />
              </div>

              {/* Waypoint selections list / skeletons */}
              <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                {isSearching ? (
                  // Loading skeletons placeholder
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="p-4 bg-white/2 border border-white/5 rounded-2xl animate-pulse space-y-2">
                      <div className="h-4 bg-white/10 rounded-lg w-3/4" />
                      <div className="h-3 bg-white/5 rounded-lg w-1/2" />
                    </div>
                  ))
                ) : (
                  filtered.map((wp) => (
                    <div
                      key={wp.name}
                      onClick={() => startNavigation(wp)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex justify-between items-center text-left ${
                        selectedWaypoint?.name === wp.name
                          ? "bg-festival-gold/10 border-festival-gold text-festival-gold shadow-[0_0_15px_rgba(234,179,8,0.15)]"
                          : "bg-white/2 border-white/5 hover:border-white/10 text-white"
                      }`}
                    >
                      <div className="space-y-0.5 max-w-[80%]">
                        <span className="block font-black text-xs sm:text-sm tracking-wide leading-tight truncate">{wp.name}</span>
                        <span className="block text-[9px] uppercase tracking-wider text-white/40">{wp.type} • Zone {wp.coord}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          startNavigation(wp);
                        }}
                        className="p-2.5 rounded-xl bg-white/5 hover:bg-festival-gold hover:text-festival-dark transition-all focus:outline-none"
                        aria-label={`Select wayfinder target ${wp.name}`}
                      >
                        <RiNavigationLine className="text-sm" />
                      </button>
                    </div>
                  ))
                )}
                {!isSearching && filtered.length === 0 && (
                  <div className="text-center text-white/30 py-8 text-xs font-bold uppercase tracking-wider">
                    No matching waypoints found
                  </div>
                )}
              </div>
            </div>

            {/* Simulation controls panel */}
            {isSimulationMode && selectedWaypoint && (
              <div className="glass p-5 rounded-3xl border border-white/5 space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-white/50 flex items-center gap-2 border-b border-white/5 pb-2.5">
                  <RiBaseStationLine className="text-lg text-festival-cyan" />
                  <span>Simulation controls</span>
                </h4>
                
                <div className="text-xs text-white/60 leading-relaxed space-y-3">
                  <p>Simulation active. Click walk below to simulate coordinates approach.</p>
                  
                  {/* Stats grids */}
                  <div className="grid grid-cols-2 gap-2 bg-white/3 p-3 rounded-2xl text-center">
                    <div>
                      <span className="block text-[9px] text-white/40 uppercase tracking-widest">Walk Speed</span>
                      <span className="block text-sm font-black text-white mt-0.5">{simSpeed} m/s</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-white/40 uppercase tracking-widest">Compass Heading</span>
                      <span className="block text-sm font-black text-white mt-0.5">{compassHeading}°</span>
                    </div>
                  </div>

                  {/* Manual Heading Slider */}
                  <div className="space-y-1">
                    <label className="text-[10px] text-white/40 uppercase tracking-wider block">Adjust Heading Angle</label>
                    <input
                      type="range"
                      min="0"
                      max="359"
                      value={compassHeading}
                      onChange={(e) => setCompassHeading(parseInt(e.target.value))}
                      className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-festival-gold"
                    />
                  </div>

                  {/* Manual walking speed controls */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSimSpeed((s) => Math.max(0.5, s - 0.5))}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-xl flex-1 text-xs font-bold focus:outline-none"
                    >
                      Slower
                    </button>
                    <button
                      onClick={() => setSimSpeed((s) => Math.min(5, s + 0.5))}
                      className="p-2 bg-white/5 hover:bg-white/10 rounded-xl flex-1 text-xs font-bold focus:outline-none"
                    >
                      Faster
                    </button>
                  </div>

                  {/* Walking triggers */}
                  <button
                    onClick={() => {
                      setIsWalking(!isWalking);
                      triggerHaptic(60);
                    }}
                    className={`w-full py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 border transition-all ${
                      isWalking 
                        ? "bg-festival-pink/10 border-festival-pink text-festival-pink-light shadow-[0_0_15px_rgba(236,72,153,0.15)]"
                        : "bg-festival-gold hover:bg-festival-gold-light text-festival-dark border-transparent font-black"
                    }`}
                  >
                    {isWalking ? <RiPauseLine className="text-base" /> : <RiPlayLine className="text-base" />}
                    <span>{isWalking ? "Stop Walking" : "Start Walking"}</span>
                  </button>
                </div>
              </div>
            )}

          </div>

          {/* AR screen overlay viewport */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Main navigation container */}
            <div className="glass rounded-3xl border border-white/5 overflow-hidden relative shadow-2xl bg-black min-h-[480px] flex flex-col">
              
              {/* Header overlays HUD */}
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-20 pointer-events-none">
                <span className="bg-festival-dark/85 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl text-[10px] uppercase font-bold text-white tracking-widest flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-festival-cyan animate-pulse" />
                  <span>{arMode ? "AR Viewport" : "2D Radar view"}</span>
                </span>

                {selectedWaypoint && (
                  <div className="bg-festival-dark/85 backdrop-blur-md border border-white/10 px-3.5 py-2 rounded-xl text-right flex flex-col text-xs font-medium">
                    <span className="text-white/40 text-[9px] uppercase tracking-widest font-black">Target Dist</span>
                    <span className="text-festival-gold font-black mt-0.5">{distance.toFixed(1)} meters</span>
                  </div>
                )}
              </div>

              {arMode ? (
                /* AR Mode Viewport */
                <div className="relative w-full flex-1 flex flex-col justify-end min-h-[480px]">
                  
                  {/* Camera Video Back stream rendering */}
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />

                  {/* AR Overlay Canvas Layer */}
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full z-10"
                  />

                  {/* Spinning Compass Rose HUD widget */}
                  <div className="absolute top-18 right-4 z-20 w-16 h-16 rounded-full border border-white/20 bg-festival-dark/80 backdrop-blur-md shadow-lg flex items-center justify-center">
                    <div 
                      className="w-full h-full relative flex items-center justify-center transition-transform duration-300"
                      style={{ transform: `rotate(${-compassHeading}deg)` }}
                    >
                      <span className="absolute top-0.5 text-[8px] font-black text-festival-gold">N</span>
                      <span className="absolute bottom-0.5 text-[8px] font-black text-white/40">S</span>
                      <span className="absolute right-0.5 text-[8px] font-black text-white/40">E</span>
                      <span className="absolute left-0.5 text-[8px] font-black text-white/40">W</span>
                      <RiCompass3Line className="text-white/20 text-3xl" />
                    </div>
                    {/* Fixed pointer */}
                    <div className="absolute top-0 w-1 h-2 bg-festival-gold rounded-full" />
                  </div>

                  {/* Camera tools menu bar */}
                  <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                    <button
                      onClick={() => setShowCalibrationGuide(true)}
                      className="p-3 bg-festival-dark/80 backdrop-blur-md hover:bg-festival-dark border border-white/10 rounded-2xl text-white/70 hover:text-white transition-all text-sm focus:outline-none"
                      title="Compass calibration wizard help"
                    >
                      <RiQuestionLine />
                    </button>
                    <button
                      onClick={toggleFacingMode}
                      className="p-3 bg-festival-dark/80 backdrop-blur-md hover:bg-festival-dark border border-white/10 rounded-2xl text-white/70 hover:text-white transition-all text-sm focus:outline-none"
                      title="Switch device camera"
                    >
                      <RiCameraLine />
                    </button>
                    <button
                      onClick={triggerCalibration}
                      className="p-3 bg-festival-dark/80 backdrop-blur-md hover:bg-festival-dark border border-white/10 rounded-2xl text-white/70 hover:text-white transition-all text-sm focus:outline-none"
                      title="Calibrate alignment offset"
                    >
                      <RiRestartLine className={isCalibrating ? "animate-spin text-festival-gold" : ""} />
                    </button>
                  </div>

                  {/* Camera load status alerts */}
                  {cameraError && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 bg-black/90 z-20 text-center space-y-4">
                      <RiSignalWifiErrorLine className="text-4xl text-festival-pink animate-bounce" />
                      <div>
                        <h4 className="font-bold text-white uppercase tracking-wider">Camera Device Error</h4>
                        <p className="text-xs text-white/50 max-w-sm mt-1">{cameraError}</p>
                      </div>
                      <button
                        onClick={startCameraStream}
                        className="btn-outline text-xs px-4 py-2"
                      >
                        Retry Camera Stream
                      </button>
                    </div>
                  )}

                  {/* Switch to map selector */}
                  <div className="absolute bottom-4 left-4 z-20">
                    <button
                      onClick={() => setArMode(false)}
                      className="px-4 py-2.5 bg-festival-dark/85 backdrop-blur-md hover:bg-festival-dark border border-white/10 rounded-2xl text-xs font-bold tracking-wider uppercase text-white hover:text-festival-gold transition-colors"
                    >
                      Switch to Map View
                    </button>
                  </div>

                </div>
              ) : (
                /* Campus 2D Radar View */
                <div className="flex-1 flex flex-col justify-between p-6 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.02)_10%,transparent_90%)] relative min-h-[480px]">
                  
                  {/* Cyber Grid background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

                  {/* Main Grid display rendering user path */}
                  <div className="flex-1 flex items-center justify-center relative mt-6">
                    {selectedWaypoint ? (
                      /* Display visual relative vector coordinates map */
                      <div className="w-full max-w-[340px] aspect-square rounded-full border border-white/5 bg-white/2 relative flex items-center justify-center shadow-inner">
                        <div className="absolute inset-4 rounded-full border border-white/5" />
                        <div className="absolute inset-16 rounded-full border border-white/5" />
                        <div className="absolute inset-28 rounded-full border border-white/5" />
                        
                        {/* Radar sweeping radial lines */}
                        <div 
                          className="absolute inset-0 rounded-full bg-gradient-to-tr from-festival-cyan/0 via-festival-cyan/0 to-festival-cyan/8 opacity-25" 
                          style={{
                            transform: `rotate(${Date.now() / 20 % 360}deg)`,
                            transformOrigin: "center"
                          }}
                        />

                        {/* User node center marker */}
                        <div className="relative w-4 h-4 bg-festival-cyan rounded-full border border-white flex items-center justify-center z-10 shadow-lg">
                          <RiCompass3Line 
                            className="text-white text-xs" 
                            style={{ transform: `rotate(${(bearing - compassHeading) % 360}deg)` }}
                          />
                        </div>

                        {/* Waypoint dot node positioned relatively */}
                        {(() => {
                          const netAngle = (bearing - compassHeading - 90) * (Math.PI / 180);
                          const scaleRadius = Math.min(130, Math.max(45, distance * 2));
                          const nodeX = Math.cos(netAngle) * scaleRadius;
                          const nodeY = Math.sin(netAngle) * scaleRadius;
                          return (
                            <motion.div
                              animate={{ x: nodeX, y: nodeY }}
                              transition={{ type: "spring", stiffness: 60 }}
                              className="absolute w-5 h-5 bg-festival-gold rounded-full border border-white flex items-center justify-center shadow-lg"
                              title={selectedWaypoint.name}
                            >
                              <RiMapPinRangeLine className="text-festival-dark text-xs" />
                            </motion.div>
                          );
                        })()}

                        {/* Compass cardinal directions tags */}
                        <span className="absolute top-1 text-[8px] font-black text-white/30 uppercase tracking-widest">N</span>
                        <span className="absolute bottom-1 text-[8px] font-black text-white/30 uppercase tracking-widest">S</span>
                        <span className="absolute right-2 text-[8px] font-black text-white/30 uppercase tracking-widest">E</span>
                        <span className="absolute left-2 text-[8px] font-black text-white/30 uppercase tracking-widest">W</span>
                      </div>
                    ) : (
                      <div className="text-center space-y-3 max-w-sm">
                        <RiCompassDiscoverLine className="text-4xl text-white/20 mx-auto animate-pulse" />
                        <h4 className="font-bold text-white/40 uppercase tracking-widest text-xs">No Active Route</h4>
                        <p className="text-xs text-white/30 leading-relaxed font-medium">
                          Select a target waypoint from the left roster layout to load guidance paths, ETA details, and launch the AR camera view.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Bottom details page layout */}
                  <div className="z-10 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 border-t border-white/5 pt-4">
                    {selectedWaypoint ? (
                      <div className="flex items-center gap-3 text-left">
                        <div className="p-2.5 bg-festival-gold/15 border border-festival-gold/25 rounded-2xl text-festival-gold text-lg shrink-0">
                          <RiMapPinRangeLine />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white leading-tight">{selectedWaypoint.name}</h4>
                          <span className="text-[10px] text-white/40 uppercase tracking-wider block mt-0.5">{selectedWaypoint.description}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs text-white/20 uppercase tracking-wider font-bold">
                        Awaiting waypoint selection
                      </div>
                    )}

                    <div className="flex gap-3">
                      {selectedWaypoint && (
                        <button
                          onClick={() => {
                            setArMode(true);
                            triggerHaptic(50);
                          }}
                          className="px-5 py-2.5 bg-gradient-to-r from-festival-purple to-festival-pink hover:opacity-90 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-1.5 transition-all focus:outline-none"
                        >
                          <RiCameraLine className="text-sm" />
                          <span>Launch AR View</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Turn by Turn animated prompt details */}
            {selectedWaypoint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-5 rounded-3xl border border-white/5 flex items-center gap-4 text-left shadow-lg relative overflow-hidden"
              >
                {/* SVG Turn guide icon */}
                <div className="p-3 bg-festival-purple/15 border border-festival-purple/20 text-festival-purple-light rounded-2xl text-2xl shrink-0">
                  {turnDetails.type === "left" && (
                    <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                  )}
                  {turnDetails.type === "right" && (
                    <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  )}
                  {turnDetails.type === "uturn" && (
                    <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89" />
                    </svg>
                  )}
                  {(turnDetails.type === "straight" || turnDetails.type === "arrival") && (
                    <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  )}
                </div>
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-white/40 font-black">Live Navigation Cue</span>
                  <h4 className="font-bold text-sm sm:text-base text-white mt-0.5">{turnDetails.instruction}</h4>
                </div>
              </motion.div>
            )}

            {/* Arrival Indicator Panel when distance <= 3 */}
            {selectedWaypoint && distance <= 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-5 bg-festival-gold/10 border border-festival-gold/30 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-lg"
              >
                <div className="flex items-center gap-3 text-left">
                  <div className="p-3 bg-festival-gold text-festival-dark rounded-full text-xl animate-bounce">
                    <RiCheckboxCircleLine />
                  </div>
                  <div>
                    <h4 className="font-black text-base text-white uppercase tracking-wider">Arrived at Destination</h4>
                    <p className="text-xs text-white/60 mt-0.5">You have reached {selectedWaypoint.name}. Proceed to the entry check desk.</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedWaypoint(null)}
                  className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold tracking-widest uppercase border border-white/10 focus:outline-none"
                >
                  Clear Route
                </button>
              </motion.div>
            )}

            {/* Help guidelines */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="glass p-5 rounded-3xl border border-white/5 space-y-1.5 text-left">
                <h5 className="font-bold text-xs uppercase text-festival-gold">Calibration Guide</h5>
                <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                  If the AR direction pointers feel unaligned, point your device camera around in a figure-8 motion to calibrate your device compass, or click the calibrate icon to reset local offset vectors.
                </p>
              </div>
              <div className="glass p-5 rounded-3xl border border-white/5 space-y-1.5 text-left">
                <h5 className="font-bold text-xs uppercase text-festival-purple-light">Coordinate Accuracy</h5>
                <p className="text-[11px] text-white/50 leading-relaxed font-medium">
                  Indoor usage or concrete building layers may cause GPS signal drift. If location coordinates lag, switch to **Simulation Mode** to control your campus route manually.
                </p>
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* Sensor figure-8 Calibration Guide modal popup */}
      <AnimatePresence>
        {showCalibrationGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass max-w-sm w-full p-6 rounded-3xl border border-white/10 text-center space-y-5 shadow-2xl relative"
            >
              <button
                onClick={() => setShowCalibrationGuide(false)}
                className="absolute top-4 right-4 text-white/40 hover:text-white focus:outline-none text-xl"
              >
                <RiCloseLine />
              </button>

              <div className="w-16 h-16 rounded-full bg-festival-gold/15 text-festival-gold flex items-center justify-center mx-auto text-3xl">
                <RiRestartLine className="animate-spin" />
              </div>

              <div className="space-y-2">
                <h4 className="font-black text-lg uppercase tracking-wider text-white">Sensor Calibration</h4>
                <p className="text-xs text-white/50 leading-relaxed font-medium">
                  To calibrate your device's built-in compass and gyroscope, wave your phone horizontally in a smooth **figure-8 motion** several times.
                </p>
              </div>

              {/* Animated figure-8 vector indicator */}
              <div className="h-16 flex items-center justify-center relative">
                <svg className="w-32 h-12 text-festival-gold/40" viewBox="0 0 100 40">
                  <path 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="3" 
                    strokeDasharray="5,5"
                    d="M 25,20 C 10,5 10,35 25,20 C 40,5 60,35 75,20 C 90,5 90,35 75,20 C 60,5 40,35 25,20 Z" 
                  />
                  {/* Moving dot pointer */}
                  <circle r="4" fill="#EAB308">
                    <animateMotion 
                      dur="3s" 
                      repeatCount="indefinite" 
                      path="M 25,20 C 10,5 10,35 25,20 C 40,5 60,35 75,20 C 90,5 90,35 75,20 C 60,5 40,35 25,20 Z" 
                    />
                  </circle>
                </svg>
              </div>

              <button
                onClick={() => {
                  setShowCalibrationGuide(false);
                  triggerHaptic(50);
                }}
                className="w-full py-3 bg-festival-gold hover:bg-festival-gold-light text-festival-dark rounded-2xl font-black text-xs uppercase tracking-widest border border-transparent focus:outline-none"
              >
                Calibration Complete
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
