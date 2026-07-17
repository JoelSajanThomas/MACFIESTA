"use client";

import { useState, useEffect, useRef } from "react";
import { 
  RiNavigationLine, 
  RiCompass3Line, 
  RiMapPinRangeLine, 
  RiSearch2Line, 
  RiCameraLine, 
  RiVolumeUpLine, 
  RiVolumeMuteLine, 
  RiCloseLine, 
  RiRouteLine,
  RiPinDistanceLine,
  RiWalkLine,
  RiTimeLine
} from "react-icons/ri";
import { api } from "@/lib/api";

type Waypoint = {
  _id?: string;
  name: string;
  type: string;
  coord: string;
  building: string;
  floor: string;
};

const staticWaypoints: Waypoint[] = [
  { name: "Main Entrance / Gate", type: "entry", coord: "A1", building: "Main Block", floor: "Ground Floor" },
  { name: "MACFAST Main Seminar Hall", type: "hall", coord: "B3", building: "Main Block", floor: "1st Floor" },
  { name: "MCA Computer Lab 3", type: "lab", coord: "C2", building: "MCA Block", floor: "1st Floor" },
  { name: "Esports Lounge Arena", type: "arena", coord: "C4", building: "MCA Block", floor: "Ground Floor" },
  { name: "Outdoor Stage Grounds", type: "stage", coord: "D1", building: "Main Block", floor: "Ground Floor" },
  { name: "Food Court Canopy", type: "food", coord: "E2", building: "MBA Block", floor: "Ground Floor" },
  { name: "MBA Conference Room", type: "hall", coord: "F2", building: "MBA Block", floor: "2nd Floor" },
  { name: "Emergency Exit Route", type: "service", coord: "G1", building: "Main Block", floor: "Ground Floor" }
];

export default function CampusNavigatorPage() {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [waypoints, setWaypoints] = useState<Waypoint[]>(staticWaypoints);
  const [selectedWaypoint, setSelectedWaypoint] = useState<Waypoint | null>(null);
  const [arMode, setArMode] = useState(false);
  const [voiceGuidance, setVoiceGuidance] = useState(true);
  
  // Indoor navigation floor state
  const [selectedBuilding, setSelectedBuilding] = useState("Main Block");
  const [selectedFloor, setSelectedFloor] = useState("Ground Floor");

  // Geolocation & sensor states
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [deviceHeading, setDeviceHeading] = useState(0); // compass yaw
  const [remainingDistance, setRemainingDistance] = useState(45); // in meters
  const [eta, setEta] = useState(1); // in minutes
  const [sensorStatus, setSensorStatus] = useState("Ready");

  // Simulation Controls for Desktop/Emulator Testing
  const [simulatedHeading, setSimulatedHeading] = useState(0);
  const [simulatedDistance, setSimulatedDistance] = useState(45);

  // WebRTC camera video and Canvas overlays hooks
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameId = useRef<number | null>(null);

  // Fetch administrator configured POIs
  useEffect(() => {
    setMounted(true);
    async function loadAdminPOIs() {
      try {
        const res = await api.get("/admin/ar-navigation");
        if (res.data?.success && res.data.locations?.length > 0) {
          const fetched: Waypoint[] = res.data.locations.map((loc: any) => ({
            name: `${loc.building} - ${loc.room}`,
            type: loc.type.toLowerCase(),
            coord: loc._id.substring(3, 7),
            building: loc.building,
            floor: loc.floor
          }));
          setWaypoints([...staticWaypoints, ...fetched]);
        }
      } catch (err) {
        console.log("No dynamic admin POIs loaded, using fallback static waypoints", err);
      }
    }
    loadAdminPOIs();
  }, []);

  // Web Speech synthesis voice prompts
  const triggerVoiceGuidance = (text: string) => {
    if (!voiceGuidance) return;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      const speech = new SpeechSynthesisUtterance(text);
      speech.rate = 1.0;
      window.speechSynthesis.speak(speech);
    }
  };

  // Setup GPS Geolocation watcher
  useEffect(() => {
    if (!mounted) return;
    let watchId: number;
    if (typeof navigator !== "undefined" && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (pos) => {
          setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        },
        (err) => {
          console.log("GPS signal unavailable, running simulated waypoints", err);
        },
        { enableHighAccuracy: true }
      );
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [mounted]);

  // Setup Gyroscope & Compass Orientation
  useEffect(() => {
    if (!mounted) return;
    const handleOrientation = (e: DeviceOrientationEvent) => {
      if (e.alpha !== null) {
        // alpha represents heading relative to North
        setDeviceHeading(Math.round(e.alpha));
      }
    };
    if (typeof window !== "undefined" && "DeviceOrientationEvent" in window) {
      window.addEventListener("deviceorientation", handleOrientation);
    } else {
      setSensorStatus("Orientation sensors not supported (Simulating)");
    }
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("deviceorientation", handleOrientation);
      }
    };
  }, [mounted]);

  // High performance Canvas 3D arrow drawing loop
  function renderAROverlay() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      if (!ctx || !canvas) return;
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw target marker overlay circle
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 70, 0, 2 * Math.PI);
      ctx.strokeStyle = "rgba(6, 182, 212, 0.4)";
      ctx.lineWidth = 4;
      ctx.stroke();

      // 2. Compute dynamic arrow rotation angle
      // Vector calculations between device heading and waypoint target direction
      const currentHeading = deviceHeading || simulatedHeading;
      const targetAngle = (180 - currentHeading) % 360;

      ctx.save();
      ctx.translate(width / 2, height / 2 + 80);
      ctx.rotate((targetAngle * Math.PI) / 180);

      // 3. Render 3D shaded arrow pointing towards direction
      ctx.beginPath();
      ctx.moveTo(0, -35); // tip
      ctx.lineTo(15, 10);
      ctx.lineTo(6, 10);
      ctx.lineTo(6, 30);
      ctx.lineTo(-6, 30);
      ctx.lineTo(-6, 10);
      ctx.lineTo(-15, 10);
      ctx.closePath();

      const arrowGrad = ctx.createLinearGradient(-15, 0, 15, 0);
      arrowGrad.addColorStop(0, "#8B5CF6"); // purple
      arrowGrad.addColorStop(1, "#EC4899"); // pink
      ctx.fillStyle = arrowGrad;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#EC4899";
      ctx.fill();
      ctx.restore();

      // 4. Draw distance indicators
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(width / 2 - 110, 25, 220, 35);
      ctx.strokeStyle = "rgba(255,255,255,0.1)";
      ctx.strokeRect(width / 2 - 110, 25, 220, 35);

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 10px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(
        `TARGET DISTANCE: ${selectedWaypoint ? simulatedDistance : 0} METERS`,
        width / 2,
        46
      );

      animationFrameId.current = requestAnimationFrame(draw);
    };

    draw();
  }

  async function startARCamera() {
    try {
      if (typeof navigator !== "undefined" && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        let stream: MediaStream;
        try {
          // Attempt back camera first (environment facing)
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment", width: 640, height: 480 },
            audio: false
          });
        } catch (backErr) {
          console.warn("Back camera environment mode failed. Falling back to default camera.", backErr);
          // Fallback to default webcam
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false
          });
        }

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        // Start Canvas Draw loop
        renderAROverlay();
      } else {
        throw new Error("WebRTC Camera APIs are not supported in this browser environment or require a secure context (HTTPS).");
      }
    } catch (err: any) {
      console.error("Camera access failed:", err);
      alert(err.message || "Failed to initialize system camera. Grant camera permissions.");
      setArMode(false);
    }
  }

  function stopARCamera() {
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  // Handle AR Mode WebRTC Camera and Canvas loop
  useEffect(() => {
    if (!arMode) {
      stopARCamera();
      return;
    }
    startARCamera();
    return () => {
      stopARCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [arMode]);

  const startNavigation = (wp: Waypoint) => {
    setSelectedWaypoint(wp);
    setSelectedBuilding(wp.building);
    setSelectedFloor(wp.floor);
    setRemainingDistance(simulatedDistance);
    setEta(Math.max(1, Math.round(simulatedDistance / 1.2 / 60)));

    // Speak initial route prompt
    const instructions = `Campus Navigator: Voice wayfinding started towards ${wp.name}. Walk ${simulatedDistance} meters straight, then follow the arrows.`;
    triggerVoiceGuidance(instructions);
  };

  const handleSimulateWalk = () => {
    if (!selectedWaypoint) return;
    if (simulatedDistance <= 5) {
      setSimulatedDistance(0);
      setRemainingDistance(0);
      setEta(0);
      triggerVoiceGuidance(`Destination reached! You have arrived at ${selectedWaypoint.name}.`);
      alert(`Destination reached successfully!`);
      return;
    }
    const newDist = simulatedDistance - 10;
    setSimulatedDistance(newDist);
    setRemainingDistance(newDist);
    setEta(Math.max(1, Math.round(newDist / 1.2 / 60)));
    triggerVoiceGuidance(`Proceed straight. ${newDist} meters remaining.`);
  };

  const getARInstructions = (wp: Waypoint | null) => {
    if (!wp) return "Select a destination from the registry list to load camera wayfinding paths.";
    return `Guidance towards ${wp.name}: Proceed straight down the main corridor. Elevators are accessible on your left.`;
  };

  if (!mounted) {
    return (
      <div className="bg-festival-dark min-h-screen pt-28 flex items-center justify-center">
        <div className="text-white text-xs font-bold uppercase tracking-widest animate-pulse">Loading WebXR sensors...</div>
      </div>
    );
  }

  const filtered = waypoints.filter((w) => w.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-festival-dark min-h-screen pt-28 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Page Header info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white" style={{ fontFamily: "var(--font-heading)" }}>
              AR Campus <span className="gradient-text-gold neon-gold">Navigator</span>
            </h1>
            <p className="text-white/60 text-xs md:text-sm">
              Integrated real-time spatial directions, WebRTC camera overlay, and indoor SVG floor maps.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setVoiceGuidance(!voiceGuidance)}
              className="p-3 bg-white/5 border border-white/10 rounded-full text-white/70 hover:text-white transition-all cursor-pointer text-sm"
              title={voiceGuidance ? "Mute Voice Prompts" : "Enable Voice Guidance"}
            >
              {voiceGuidance ? <RiVolumeUpLine /> : <RiVolumeMuteLine />}
            </button>
          </div>
        </div>

        {/* Navigator Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Control Panel: Waypoint Lists & Routing Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Turn-by-Turn Guidance Summary Card */}
            {selectedWaypoint && (
              <div className="glass p-5 rounded-2xl border border-festival-gold/20 shadow-md space-y-4 animate-scale-in">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-festival-gold tracking-widest">Active Routing Info</span>
                  <button 
                    onClick={() => { setSelectedWaypoint(null); setArMode(false); }}
                    className="text-white/40 hover:text-white text-xs cursor-pointer"
                  >
                    <RiCloseLine />
                  </button>
                </div>
                
                <h3 className="text-md font-bold text-white uppercase">{selectedWaypoint.name}</h3>
                
                <div className="grid grid-cols-3 gap-3 text-center text-xs">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <RiPinDistanceLine className="mx-auto text-festival-cyan text-sm mb-1" />
                    <span className="block text-[8px] text-white/30 uppercase">Distance</span>
                    <span className="font-bold text-white">{remainingDistance}m</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <RiTimeLine className="mx-auto text-festival-pink text-sm mb-1" />
                    <span className="block text-[8px] text-white/30 uppercase">ETA</span>
                    <span className="font-bold text-white">{eta} min</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <RiWalkLine className="mx-auto text-festival-purple text-sm mb-1" />
                    <span className="block text-[8px] text-white/30 uppercase">Speed</span>
                    <span className="font-bold text-white">1.2 m/s</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={handleSimulateWalk}
                    className="flex-1 py-2.5 text-xs bg-white/10 hover:bg-white/15 border border-white/10 hover:border-white text-white rounded-xl uppercase font-bold cursor-pointer transition-colors"
                  >
                    Simulate Walking
                  </button>
                </div>
              </div>
            )}

            {/* Waypoint Registries list search */}
            <div className="glass p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="relative">
                <RiSearch2Line className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
                <input
                  type="text"
                  placeholder="Search rooms, computer labs, exits..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-2.5 bg-white/5 border border-white/10 rounded-xl focus:border-festival-gold/50 focus:outline-none text-white text-xs"
                />
              </div>

              {/* Waypoint table items */}
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {filtered.map((wp) => (
                  <div
                    key={wp.name}
                    onClick={() => setSelectedWaypoint(wp)}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex justify-between items-center ${
                      selectedWaypoint?.name === wp.name
                        ? "bg-festival-gold/10 border-festival-gold text-festival-gold"
                        : "bg-white/2 border-white/5 hover:border-white/10 text-white"
                    }`}
                  >
                    <div className="space-y-0.5 text-left text-xs">
                      <span className="block font-bold">{wp.name}</span>
                      <span className="block text-[9px] uppercase tracking-wider text-white/40">{wp.building} • {wp.floor}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startNavigation(wp);
                      }}
                      className="p-2 rounded-lg bg-white/5 hover:bg-festival-gold hover:text-festival-dark transition-colors cursor-pointer text-xs"
                    >
                      <RiNavigationLine />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Viewport Panel: AR Camera with overlay vs Indoor Floor SVG Map */}
          <div className="lg:col-span-7">
            <div className="glass h-[480px] rounded-3xl border border-white/5 overflow-hidden relative shadow-2xl bg-black">
              
              {/* --- 1. AR CAMERA MODE VIEWPORT --- */}
              {arMode ? (
                <div className="relative w-full h-full flex flex-col justify-between p-6">
                  {/* Background Live Webcam Video tag */}
                  <video 
                    ref={videoRef}
                    playsInline 
                    muted 
                    className="absolute inset-0 w-full h-full object-cover z-0"
                  />

                  {/* HTML5 Canvas overlay arrow graphics */}
                  <canvas 
                    ref={canvasRef}
                    width={480}
                    height={480}
                    className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                  />

                  {/* Control Layout Buttons */}
                  <div className="z-20 flex justify-between items-center">
                    <span className="text-[9px] uppercase font-bold text-white/80 bg-black/60 px-3 py-1 rounded-full tracking-wider border border-white/10 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-festival-pink animate-pulse" />
                      <span>AR CAMERA STREAMING</span>
                    </span>

                    <button
                      onClick={() => setArMode(false)}
                      className="px-4 py-2 text-xs bg-black/70 hover:bg-black/95 text-white font-bold border border-white/10 rounded-xl cursor-pointer"
                    >
                      Switch to Map
                    </button>
                  </div>

                  {/* Bottom turn-by-turn text box */}
                  <div className="z-20 space-y-4">
                    {/* Desktop Simulation Sliders */}
                    <div className="bg-black/80 p-3 rounded-xl border border-white/10 max-w-sm mx-auto text-xs space-y-1.5">
                      <div className="flex justify-between items-center text-[10px] text-white/50 uppercase font-bold">
                        <span>Simulate Yaw Heading</span>
                        <span>{simulatedHeading}°</span>
                      </div>
                      <input 
                        type="range" 
                        min="0" 
                        max="360" 
                        value={simulatedHeading} 
                        onChange={(e) => setSimulatedHeading(Number(e.target.value))}
                        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-festival-gold"
                      />
                    </div>

                    <div className="glass-strong p-4 rounded-xl border border-white/10 max-w-md mx-auto">
                      <span className="block text-[9px] uppercase tracking-widest text-festival-gold font-bold">Turn-by-turn instruction</span>
                      <p className="text-white text-xs mt-1 leading-relaxed">{getARInstructions(selectedWaypoint)}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* --- 2. INDOOR FLOOR SVG MAP VIEWPORT --- */
                <div className="relative w-full h-full flex flex-col justify-between p-6 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.02)_10%,transparent_80%)]">
                  {/* Grid Lines background */}
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

                  {/* Building & Floor Selector */}
                  <div className="z-10 flex flex-wrap gap-2 justify-between items-center">
                    <div className="flex gap-2">
                      <select 
                        value={selectedBuilding} 
                        onChange={(e) => setSelectedBuilding(e.target.value)}
                        className="p-2 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                      >
                        <option value="Main Block" className="bg-festival-dark">Main Block</option>
                        <option value="MCA Block" className="bg-festival-dark">MCA Block</option>
                        <option value="MBA Block" className="bg-festival-dark">MBA Block</option>
                      </select>
                      <select 
                        value={selectedFloor} 
                        onChange={(e) => setSelectedFloor(e.target.value)}
                        className="p-2 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:outline-none"
                      >
                        <option value="Ground Floor" className="bg-festival-dark">Ground Floor</option>
                        <option value="1st Floor" className="bg-festival-dark">1st Floor</option>
                        <option value="2nd Floor" className="bg-festival-dark">2nd Floor</option>
                      </select>
                    </div>

                    <button
                      onClick={() => setArMode(true)}
                      className="btn-primary flex items-center gap-1.5 text-xs px-4 py-2 bg-gradient-to-r from-festival-purple to-festival-pink cursor-pointer"
                    >
                      <RiCameraLine />
                      <span>Launch AR Camera</span>
                    </button>
                  </div>

                  {/* Render Custom styled Indoor Vector Floor plan with active pathways */}
                  <div className="w-full h-56 flex items-center justify-center my-auto">
                    <svg className="w-full max-w-sm h-full text-white/20" viewBox="0 0 400 220" style={{ filter: "drop-shadow(0px 0px 20px rgba(0,0,0,0.4))" }}>
                      {/* Outer boundary corridors block */}
                      <rect x="10" y="10" width="380" height="200" rx="15" fill="rgba(255,255,255,0.01)" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                      
                      {/* Room segments definitions */}
                      <rect x="30" y="30" width="80" height="60" rx="8" fill="rgba(139, 92, 246, 0.05)" stroke="rgba(139, 92, 246, 0.2)" strokeWidth="1.5" />
                      <text x="70" y="65" fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="bold" textAnchor="middle">Entrance Block</text>

                      <rect x="150" y="30" width="100" height="60" rx="8" fill="rgba(236, 72, 153, 0.05)" stroke="rgba(236, 72, 153, 0.2)" strokeWidth="1.5" />
                      <text x="200" y="65" fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="bold" textAnchor="middle">Halls & Labs</text>

                      <rect x="290" y="30" width="80" height="60" rx="8" fill="rgba(6, 182, 212, 0.05)" stroke="rgba(6, 182, 212, 0.2)" strokeWidth="1.5" />
                      <text x="330" y="65" fill="rgba(255,255,255,0.6)" fontSize="10" fontWeight="bold" textAnchor="middle">Lounge Arena</text>

                      <rect x="30" y="130" width="100" height="60" rx="8" fill="rgba(255, 255, 255, 0.02)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
                      <text x="80" y="165" fill="rgba(255,255,255,0.4)" fontSize="9" textAnchor="middle">Stairs & Elevator</text>

                      <rect x="270" y="130" width="100" height="60" rx="8" fill="rgba(234, 179, 8, 0.03)" stroke="rgba(234, 179, 8, 0.2)" strokeWidth="1" />
                      <text x="320" y="165" fill="rgba(255,255,255,0.6)" fontSize="9" fontWeight="bold" textAnchor="middle">Emergency Exit</text>

                      {/* Active routing path line if waypoint selected */}
                      {selectedWaypoint && (
                        <>
                          <path 
                            d="M 70 90 L 70 110 L 200 110 L 200 90" 
                            fill="none" 
                            stroke="#EAB308" 
                            strokeWidth="3" 
                            strokeDasharray="6 4"
                            className="animate-pulse"
                          />
                          <circle cx="200" cy="90" r="5" fill="#EAB308" />
                          <circle cx="70" cy="90" r="5" fill="#8B5CF6" />
                        </>
                      )}
                    </svg>
                  </div>

                  {/* Dynamic pin layout labels */}
                  <div className="z-10 flex justify-between items-center text-[10px] text-white/30 uppercase tracking-widest" style={{ fontFamily: "var(--font-heading)" }}>
                    <span>Sensors: {sensorStatus}</span>
                    <span>Building: {selectedBuilding}</span>
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
