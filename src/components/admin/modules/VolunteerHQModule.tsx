"use client";

import { useState } from "react";
import {
  RiUserHeartLine,
  RiShieldFlashLine,
  RiCheckDoubleLine,
  RiAddLine,
  RiSearchLine,
  RiTimeLine,
  RiAlertLine,
  RiFileDownloadLine,
  RiShieldUserLine,
  RiBuilding2Line,
  RiTaskLine,
  RiQrCodeLine,
  RiMegaphoneLine,
  RiFileChartLine,
  RiDeleteBinLine,
  RiEditLine,
  RiCheckLine,
  RiCloseLine,
  RiSparklingLine,
} from "react-icons/ri";
import {
  useVolunteerControl,
  VolunteerUser,
  VolunteerTask,
  VolunteerIssueReport,
  saveVolunteersList,
  saveVolunteerTasks,
} from "@/lib/volunteerStore";

export function VolunteerHQModule() {
  const { volunteers, assignedTasks, issues, updateTaskStatus } = useVolunteerControl();

  const [activeTab, setActiveTab] = useState<"dashboard" | "roster" | "tasks" | "attendance" | "announcements" | "reports">("dashboard");
  const [volList, setVolList] = useState<VolunteerUser[]>(volunteers);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDeptFilter, setSelectedDeptFilter] = useState("ALL");
  const [selectedVolId, setSelectedVolId] = useState<string>(volunteers[0]?.id || "v-101");
  const [statusMsg, setStatusMsg] = useState("");

  // Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newDept, setNewDept] = useState("Computer Applications (MCA)");
  const [newVenue, setNewVenue] = useState("Main Auditorium");

  // New Task States
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDeadline, setTaskDeadline] = useState("11:30 AM");
  const [taskPriority, setTaskPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("HIGH");

  // Broadcast Announcement State
  const [annTarget, setAnnTarget] = useState("ALL");
  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");

  const triggerSaved = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3500);
  };

  const selectedVol = volList.find((v) => v.id === selectedVolId) || volList[0];

  const filteredVolunteers = volList.filter((v) => {
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) || v.volunteerCode.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = selectedDeptFilter === "ALL" || v.department === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

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
    triggerSaved(`✓ Permission '${String(permKey)}' updated for ${selectedVol.name}`);

  };

  const handleAddVolunteer = (e: React.FormEvent) => {
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
      status: "CHECKED_IN",
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
    triggerSaved(`✓ Volunteer Account ${newVol.volunteerCode} Created Successfully!`);
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
        { id: `ck-${Date.now()}-2`, text: "Check-in with Department Lead", completed: false },
      ],
      createdAt: new Date().toLocaleString(),
    };

    saveVolunteerTasks([...assignedTasks, newTask]);
    setTaskTitle("");
    setTaskDesc("");
    setShowTaskModal(false);
    triggerSaved(`✓ Duty Task Assigned to ${selectedVol.name}!`);
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle || !annMessage) return;
    setAnnTitle("");
    setAnnMessage("");
    triggerSaved(`✓ Targeted Announcement Dispatched to ${annTarget} Volunteers!`);
  };

  return (
    <div className="space-y-6 font-mono select-none">
      {/* MODULE HEADER */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-black/90 via-[#0A0D1A] to-[#05050A] border-2 border-arc-cyan/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-[0_0_40px_rgba(0,212,255,0.15)]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-marvel-red/10 border border-marvel-red/30 text-marvel-red text-[10px] font-bold uppercase tracking-widest">
            <RiShieldFlashLine className="animate-pulse" />
            <span>ENTERPRISE VOLUNTEER OPERATIONS & RBAC HUB</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Volunteer HQ <span className="marvel-bang-comic-gradient font-black">Command Studio</span>
          </h2>
          <p className="text-xs text-white/60">
            Manage volunteer credentials, role-based permissions, shift rosters, task checklists & emergency alerts.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {statusMsg && (
            <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold rounded-xl animate-pulse flex items-center gap-2">
              <RiCheckDoubleLine className="text-base" />
              <span>{statusMsg}</span>
            </div>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary py-2.5 px-5 text-xs font-bold uppercase flex items-center gap-2 cursor-pointer shadow-[0_0_15px_#ED1D24]"
          >
            <RiAddLine className="text-base" />
            <span>+ Add Volunteer</span>
          </button>
        </div>
      </div>

      {/* NAV TAB RAIL */}
      <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none gap-1">
        {[
          { id: "dashboard" as const, label: "Operations Telemetry", icon: RiShieldFlashLine },
          { id: "roster" as const, label: `Staff Roster (${volList.length})`, icon: RiUserHeartLine },
          { id: "tasks" as const, label: `Task Assignments (${assignedTasks.length})`, icon: RiTaskLine },
          { id: "attendance" as const, label: "Attendance & Duty Logs", icon: RiTimeLine },
          { id: "announcements" as const, label: "Targeted Broadcasts", icon: RiMegaphoneLine },
          { id: "reports" as const, label: "Reports & Exports", icon: RiFileChartLine },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "bg-marvel-red text-white shadow-[0_0_15px_#ED1D24]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
              style={{ fontFamily: "var(--font-heading)" }}
            >
              <Icon />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. OPERATIONS TELEMETRY DASHBOARD */}
      {activeTab === "dashboard" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-black/40 border border-white/10 space-y-1">
              <span className="text-white/50 text-[10px] uppercase font-bold">Total Enrolled Volunteers</span>
              <div className="text-3xl font-black text-white">{volList.length}</div>
              <span className="text-emerald-400 text-[10px]">100% Verified Accounts</span>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-emerald-500/30 space-y-1">
              <span className="text-white/50 text-[10px] uppercase font-bold">On-Duty Check-ins</span>
              <div className="text-3xl font-black text-emerald-400">
                {volList.filter((v) => v.status === "CHECKED_IN").length}
              </div>
              <span className="text-emerald-400 text-[10px]">● Active Ground Duty</span>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-amber-500/30 space-y-1">
              <span className="text-white/50 text-[10px] uppercase font-bold">Off-Duty / Standby</span>
              <div className="text-3xl font-black text-amber-400">
                {volList.filter((v) => v.status === "OFF_DUTY").length}
              </div>
              <span className="text-amber-400 text-[10px]">Shift Break</span>
            </div>

            <div className="p-5 rounded-2xl bg-black/40 border border-arc-cyan/30 space-y-1">
              <span className="text-white/50 text-[10px] uppercase font-bold">Task Completion Rate</span>
              <div className="text-3xl font-black text-arc-cyan">
                {assignedTasks.length > 0
                  ? Math.round((assignedTasks.filter((t: VolunteerTask) => t.status === "COMPLETED").length / assignedTasks.length) * 100)
                  : 100}%
              </div>
              <span className="text-arc-cyan text-[10px]">Live Dispatch Metrics</span>
            </div>
          </div>

          {/* Incident Reports Summary */}
          <div className="marvel-card p-6 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-4">
            <h3 className="text-sm font-bold text-marvel-red uppercase tracking-wider flex items-center gap-2">
              <RiAlertLine className="animate-pulse" />
              <span>Live Emergency & Incident Reports ({issues.length})</span>
            </h3>

            <div className="space-y-2 text-xs">
              {issues.length === 0 ? (
                <p className="text-white/40">No emergency reports submitted.</p>
              ) : (
                issues.map((i: VolunteerIssueReport) => (
                  <div key={i.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-marvel-red/20 text-marvel-red text-[9px] font-bold">{i.category}</span>
                        <span className="font-bold text-white">{i.location}</span>
                        <span className="text-white/40 text-[10px]">by {i.volunteerName}</span>
                      </div>
                      <p className="text-white/70 mt-1">{i.description}</p>
                    </div>
                    <span className="text-[10px] text-arc-cyan font-bold">{i.timestamp}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 2. VOLUNTEER STAFF ROSTER & RBAC */}
      {activeTab === "roster" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 marvel-card p-6 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                <RiUserHeartLine className="text-marvel-red" />
                <span>Volunteer Staff List</span>
              </h3>
            </div>

            {/* Search and Dept Filter */}
            <div className="space-y-2 text-xs">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by name or VOL ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                />
                <RiSearchLine className="absolute right-3.5 top-3 text-white/40" />
              </div>
            </div>

            <div className="space-y-2">
              {filteredVolunteers.map((vol) => {
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

          {/* Selected Volunteer Details & Permission Matrix */}
          {selectedVol && (
            <div className="lg:col-span-7 space-y-6">
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

              {/* RBAC Permissions Toggles Grid */}
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
            </div>
          )}
        </div>
      )}

      {/* 3. TASK ASSIGNMENTS */}
      {activeTab === "tasks" && (
        <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Active Duty Tasks & Checklists
            </h3>
            <button onClick={() => setShowTaskModal(true)} className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_#ED1D24]">
              <RiAddLine />
              <span>Assign New Task</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {assignedTasks.map((t: VolunteerTask) => (
              <div key={t.id} className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-marvel-red/20 text-marvel-red font-bold text-[9px] uppercase">{t.priority}</span>
                    <span className="font-bold text-white text-sm">{t.title}</span>
                  </div>
                  <span className="text-arc-cyan font-bold text-[10px]">Deadline: {t.deadline}</span>
                </div>
                <p className="text-white/60">{t.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. TARGETED ANNOUNCEMENTS */}
      {activeTab === "announcements" && (
        <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
          <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
            Send Targeted Volunteer Broadcast
          </h3>

          <form onSubmit={handleSendAnnouncement} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 font-bold mb-1">Target Audience</label>
                <select
                  value={annTarget}
                  onChange={(e) => setAnnTarget(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                >
                  <option value="ALL">All Enrolled Volunteers</option>
                  <option value="MCA">MCA Department Volunteers</option>
                  <option value="MBA">MBA Department Volunteers</option>
                  <option value="SECURITY">Gate Security Team</option>
                </select>
              </div>

              <div>
                <label className="block text-white/70 font-bold mb-1">Broadcast Headline</label>
                <input
                  type="text"
                  placeholder="e.g. Briefing Meeting at 01:30 PM"
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/70 font-bold mb-1">Broadcast Message Body</label>
              <textarea
                rows={3}
                placeholder="Message instructions..."
                value={annMessage}
                onChange={(e) => setAnnMessage(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>

            <button type="submit" className="btn-primary py-3 px-6 text-xs uppercase font-bold flex items-center gap-2 cursor-pointer shadow-[0_0_20px_#ED1D24]">
              <RiMegaphoneLine />
              <span>Dispatch Targeted Volunteer Broadcast</span>
            </button>
          </form>
        </div>
      )}

      {/* CREATE VOLUNTEER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-md w-full marvel-card p-6 rounded-3xl border border-arc-cyan/40 bg-[#0A0D1A] space-y-4">
            <h3 className="text-base font-bold text-white uppercase tracking-wider">Add New Volunteer Staff Account</h3>
            <form onSubmit={handleAddVolunteer} className="space-y-3 text-xs">
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
    </div>
  );
}
