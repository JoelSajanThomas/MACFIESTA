"use client";

import { useState } from "react";
import {
  RiUserHeartLine,
  RiShieldUserLine,
  RiCheckDoubleLine,
  RiPhoneLine,
  RiTimeLine,
  RiAddLine,
  RiShieldFlashLine,
  RiLock2Line,
  RiAlertLine,
  RiDeleteBinLine,
  RiSaveLine,
  RiCheckboxCircleLine,
  RiSparklingLine,
} from "react-icons/ri";
import {
  useVolunteerControl,
  VolunteerUser,
  VolunteerTask,
  saveVolunteersList,
  saveVolunteerTasks,
} from "@/lib/volunteerStore";

export function VolunteerManagement() {
  const { volunteers, assignedTasks, issues, updateTaskStatus } = useVolunteerControl();

  const [volList, setVolList] = useState<VolunteerUser[]>(volunteers);
  const [selectedVolId, setSelectedVolId] = useState<string>(volunteers[0]?.id || "v-101");
  const [statusMsg, setStatusMsg] = useState("");

  // New Volunteer Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newDept, setNewDept] = useState("Computer Applications (MCA)");
  const [newVenue, setNewVenue] = useState("Main Auditorium");

  // New Task Modal State
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("11:30 AM");
  const [taskPriority, setTaskPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("HIGH");

  const triggerSaved = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const selectedVol = volList.find((v) => v.id === selectedVolId) || volList[0];

  const handleTogglePermission = (permKey: keyof VolunteerUser["permissions"]) => {
    if (!selectedVol) return;
    const updated = volList.map((v) => {
      if (v.id === selectedVol.id) {
        return {
          ...v,
          permissions: {
            ...v.permissions,
            [permKey]: !v.permissions[permKey],
          },
        };
      }
      return v;
    });
    setVolList(updated);
    saveVolunteersList(updated);
    triggerSaved(`✓ Updated permission '${permKey}' for ${selectedVol.name}`);
  };

  const handleCreateVolunteer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail) return;

    const count = volList.length + 101;
    const newVol: VolunteerUser = {
      id: `v-${count}`,
      volunteerCode: `VOL-${count}`,
      name: newName,
      email: newEmail,
      phone: newPhone || "+91 94470 00000",
      department: newDept,
      assignedVenue: newVenue,
      shiftHours: "Full Day (09:00 AM - 05:00 PM)",
      status: "OFF_DUTY",
      permissions: {
        canVerifyRegistrations: true,
        canMarkAttendance: true,
        canUpdateTaskProgress: true,
        canAccessChecklist: true,
        canReportIssues: true,
        canDownloadFiles: true,
        canUploadProof: true,
        canUpdateVenueStatus: true,
      },
    };

    const updated = [...volList, newVol];
    setVolList(updated);
    saveVolunteersList(updated);
    setNewName("");
    setNewEmail("");
    setShowAddModal(false);
    triggerSaved(`✓ Volunteer Account ${newVol.volunteerCode} Created!`);
  };

  const handleAssignTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle || !selectedVol) return;

    const newTask: VolunteerTask = {
      id: `tsk-${Date.now()}`,
      volunteerId: selectedVol.id,
      title: taskTitle,
      description: taskDesc || "Execute assigned duty task as instructed.",
      deadline: taskDeadline,
      priority: taskPriority,
      status: "PENDING",
      checklist: [
        { id: `ck-${Date.now()}-1`, text: "Verify equipment readiness", completed: false },
        { id: `ck-${Date.now()}-2`, text: "Check-in with Department Coordinator", completed: false },
      ],
      createdAt: new Date().toLocaleString(),
    };

    saveVolunteerTasks([...assignedTasks, newTask]);
    setTaskTitle("");
    setTaskDesc("");
    setShowTaskModal(false);
    triggerSaved(`✓ Task Assigned to ${selectedVol.name}!`);
  };

  return (
    <div className="space-y-6 font-mono select-none">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-black/90 via-[#0A0D1A] to-[#05050A] border-2 border-arc-cyan/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marvel-red/10 border border-marvel-red/30 text-marvel-red text-[10px] font-bold uppercase tracking-widest">
            <RiShieldFlashLine className="animate-pulse" />
            <span>ROLE-BASED VOLUNTEER STAFF CONTROL</span>
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Volunteer Duty & <span className="marvel-bang-comic-gradient font-black">Permissions Manager</span>
          </h2>
          <p className="text-xs text-white/60">
            Create volunteer accounts, assign duty tasks, toggle per-volunteer feature permissions, and review reported issues.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {statusMsg && (
            <div className="px-3.5 py-1.5 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold rounded-xl animate-pulse flex items-center gap-1.5">
              <RiCheckDoubleLine />
              <span>{statusMsg}</span>
            </div>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary py-2.5 px-5 text-xs font-bold uppercase flex items-center gap-2 cursor-pointer shadow-[0_0_15px_#ED1D24]"
          >
            <RiAddLine className="text-base" />
            <span>Add Volunteer Staff</span>
          </button>
        </div>
      </div>

      {/* MAIN TWO-COLUMN DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Volunteer Roster (4 Cols) */}
        <div className="lg:col-span-4 marvel-card p-6 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <RiUserHeartLine className="text-marvel-red" />
            <span>Registered Volunteers ({volList.length})</span>
          </h3>

          <div className="space-y-2">
            {volList.map((vol) => {
              const isSelected = selectedVolId === vol.id;
              return (
                <div
                  key={vol.id}
                  onClick={() => setSelectedVolId(vol.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                    isSelected
                      ? "bg-marvel-red/15 border-marvel-red text-white shadow-[0_0_15px_rgba(237,29,36,0.3)]"
                      : "bg-black/40 border-white/10 text-white/70 hover:border-white/30"
                  }`}
                >
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-white text-sm">{vol.name}</span>
                    <span className="px-2 py-0.5 rounded bg-arc-cyan/20 text-arc-cyan text-[9px] font-bold">
                      {vol.volunteerCode}
                    </span>
                  </div>
                  <div className="text-[11px] text-white/50">{vol.department}</div>
                  <div className="flex justify-between items-center text-[10px] pt-1 border-t border-white/10">
                    <span className="text-metallic-gold font-bold">Venue: {vol.assignedVenue}</span>
                    <span className={vol.status === "CHECKED_IN" ? "text-emerald-400 font-bold" : "text-white/40"}>
                      ● {vol.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Volunteer Details & Permission Matrix (8 Cols) */}
        {selectedVol && (
          <div className="lg:col-span-8 space-y-6">
            {/* Selected Volunteer Header */}
            <div className="marvel-card p-6 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-arc-cyan font-bold uppercase">{selectedVol.volunteerCode} • {selectedVol.department}</div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                  {selectedVol.name}
                </h3>
                <div className="text-xs text-white/60">Phone: {selectedVol.phone} | Venue: {selectedVol.assignedVenue}</div>
              </div>

              <button
                onClick={() => setShowTaskModal(true)}
                className="px-4 py-2.5 bg-arc-cyan text-black font-bold text-xs rounded-xl hover:bg-white transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <RiAddLine className="text-base" />
                <span>Assign New Task</span>
              </button>
            </div>

            {/* Role-Based Permissions Toggles Grid */}
            <div className="marvel-card p-6 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-4">
              <h4 className="text-xs font-bold text-metallic-gold uppercase tracking-wider flex items-center gap-2">
                <RiShieldUserLine className="text-base" />
                <span>Role-Based Access Control (RBAC) Permissions Toggle</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {[
                  { key: "canVerifyRegistrations", label: "Scan & Verify Participant QR Passes" },
                  { key: "canMarkAttendance", label: "Clock Duty Check-In & Check-Out" },
                  { key: "canUpdateTaskProgress", label: "Mark Tasks Started / Completed" },
                  { key: "canAccessChecklist", label: "Interactive Task Verification Checklists" },
                  { key: "canReportIssues", label: "Dispatch Emergency & Technical Issues" },
                  { key: "canDownloadFiles", label: "Access Shared Rulebooks & Venue Maps" },
                  { key: "canUploadProof", label: "Upload Photo Proof for Tasks" },
                  { key: "canUpdateVenueStatus", label: "Update Live Auditorium Seating & Queue" },
                ].map((item) => {
                  const permKey = item.key as keyof VolunteerUser["permissions"];
                  const isEnabled = selectedVol.permissions[permKey];
                  return (
                    <div
                      key={item.key}
                      onClick={() => handleTogglePermission(permKey)}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                        isEnabled
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400"
                          : "bg-black/40 border-white/10 text-white/40 hover:border-white/20"
                      }`}
                    >
                      <span className="font-bold text-[11px]">{item.label}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${isEnabled ? "bg-emerald-500 text-black" : "bg-white/10 text-white/40"}`}>
                        {isEnabled ? "ENABLED" : "LOCKED"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reported Emergency Issues Log */}
            <div className="marvel-card p-6 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-4">
              <h4 className="text-xs font-bold text-marvel-red uppercase tracking-wider flex items-center gap-2">
                <RiAlertLine className="animate-pulse" />
                <span>Reported Emergency & Technical Incidents ({issues.length})</span>
              </h4>

              <div className="space-y-2 text-xs">
                {issues.map((i) => (
                  <div key={i.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[9px] font-bold">{i.category}</span>
                        <span className="font-bold text-white">{i.location}</span>
                        <span className="text-white/40 text-[10px]">by {i.volunteerName}</span>
                      </div>
                      <p className="text-white/70 mt-1">{i.description}</p>
                    </div>
                    <span className="text-[10px] text-arc-cyan font-bold">{i.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CREATE VOLUNTEER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full marvel-card p-6 rounded-3xl border border-arc-cyan/40 bg-[#0A0D1A] space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">Add New Volunteer Staff Account</h3>
            <form onSubmit={handleCreateVolunteer} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 font-bold mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Nair"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="rahul.vol@macfast.org"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-1">Assigned Department</label>
                <input
                  type="text"
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-1">Assigned Venue</label>
                <input
                  type="text"
                  value={newVenue}
                  onChange={(e) => setNewVenue(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2 px-5 font-bold uppercase cursor-pointer">
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN TASK MODAL */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full marvel-card p-6 rounded-3xl border border-arc-cyan/40 bg-[#0A0D1A] space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">Assign Task to {selectedVol?.name}</h3>
            <form onSubmit={handleAssignTask} className="space-y-3 text-xs">
              <div>
                <label className="block text-white/70 font-bold mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g. Verify Audio Mics at Stage B"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-1">Task Description</label>
                <textarea
                  rows={2}
                  placeholder="Task instructions..."
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/70 font-bold mb-1">Deadline Time</label>
                  <input
                    type="text"
                    value={taskDeadline}
                    onChange={(e) => setTaskDeadline(e.target.value)}
                    className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/70 font-bold mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                  >
                    <option value="LOW">Low</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="HIGH">High</option>
                    <option value="URGENT">Urgent</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 cursor-pointer"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary py-2 px-5 font-bold uppercase cursor-pointer">
                  Assign Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
