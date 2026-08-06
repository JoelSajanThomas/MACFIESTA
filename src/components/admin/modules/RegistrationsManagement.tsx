"use client";

import { useState } from "react";
import { DataTable, Column } from "../shared/DataTable";
import {
  RiQrCodeLine,
  RiCheckDoubleLine,
  RiCloseCircleLine,
  RiFileList3Line,
  RiMoneyDollarCircleLine,
  RiEditLine,
  RiForbidLine,
  RiDeleteBinLine,
  RiCloseLine,
  RiSaveLine,
} from "react-icons/ri";

import { exportToCSV } from "@/lib/exportUtils";

interface RegistrationRecord {
  _id: string;
  passCode: string;
  userName?: string;
  userEmail?: string;
  eventTitle?: string;
  status: "ACTIVE" | "CANCELLED" | "CHECKED_IN" | "BANNED" | string;
  amountPaid?: number;
  qrCheckedIn?: boolean;
  createdAt?: string;
}

interface RegistrationsManagementProps {
  registrations: RegistrationRecord[];
  onRefresh?: () => void;
  onCheckIn?: (passCode: string) => void;
  onCancelReg?: (id: string) => void;
}

export function RegistrationsManagement({
  registrations,
  onRefresh,
  onCheckIn,
  onCancelReg,
}: RegistrationsManagementProps) {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [regList, setRegList] = useState<RegistrationRecord[]>(registrations);

  // Edit Registration Modal State
  const [editingReg, setEditingReg] = useState<RegistrationRecord | null>(null);
  const [editName, setEditName] = useState("");
  const [editEvent, setEditEvent] = useState("");
  const [editAmount, setEditAmount] = useState(150);

  const displayRegs = regList.length > 0 ? regList : registrations;

  const handleExportCSV = () => {
    const dataToExport = displayRegs.map((r) => ({
      ID: r._id,
      "Pass Code": r.passCode,
      Name: r.userName || "Delegate",
      Email: r.userEmail || "N/A",
      Event: r.eventTitle || "General Pass",
      Status: r.status,
      "Amount Paid": r.amountPaid || 0,
      "QR Checked In": r.qrCheckedIn ? "Yes" : "No",
      "Date Registered": r.createdAt || new Date().toISOString(),
    }));
    exportToCSV("MacFiesta_Registrations", dataToExport);
  };

  const filtered = displayRegs.filter((reg) => {
    if (statusFilter === "all") return true;
    return reg.status?.toLowerCase() === statusFilter.toLowerCase();
  });

  const handleOpenEdit = (reg: RegistrationRecord) => {
    setEditingReg(reg);
    setEditName(reg.userName || "Delegate User");
    setEditEvent(reg.eventTitle || "All Access Fest Pass");
    setEditAmount(reg.amountPaid ?? 150);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReg) return;

    setRegList((prev) =>
      prev.map((r) =>
        r._id === editingReg._id
          ? {
              ...r,
              userName: editName,
              eventTitle: editEvent,
              amountPaid: editAmount,
            }
          : r
      )
    );
    setEditingReg(null);
    onRefresh?.();
  };

  const handleBanPass = (id: string, currentStatus?: string) => {
    const newStatus = currentStatus === "BANNED" ? "ACTIVE" : "BANNED";
    setRegList((prev) =>
      prev.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
    );
    onRefresh?.();
  };

  const handleDeletePass = (id: string) => {
    if (confirm("Are you sure you want to permanently revoke & remove this registration pass?")) {
      setRegList((prev) => prev.filter((r) => r._id !== id));
      onCancelReg?.(id);
    }
  };

  const columns: Column<RegistrationRecord>[] = [
    {
      key: "passCode",
      header: "Pass Code & Delegate",
      render: (row) => (
        <div>
          <span className="font-mono text-xs font-black text-[#F5B301] uppercase bg-[#F5B301]/10 px-2 py-0.5 rounded border border-[#F5B301]/30">
            {row.passCode || row._id?.substring(0, 8)}
          </span>
          <p className="font-bold text-white text-xs mt-1">{row.userName || "Delegate User"}</p>
          <p className="text-[10px] text-zinc-400 font-mono">{row.userEmail || "delegate@macfast.ac.in"}</p>
        </div>
      ),
    },
    {
      key: "eventTitle",
      header: "Registered Event",
      render: (row) => (
        <span className="text-xs font-semibold text-zinc-200">
          {row.eventTitle || "All Access Fest Pass"}
        </span>
      ),
    },
    {
      key: "amountPaid",
      header: "Fee Paid",
      render: (row) => (
        <span className="text-xs font-bold text-emerald-400">
          ₹{(row.amountPaid ?? 150).toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      header: "Pass Status",
      render: (row) => {
        const isCheckedIn = row.status === "CHECKED_IN" || row.qrCheckedIn;
        const isBanned = row.status === "BANNED";
        const isCancelled = row.status === "CANCELLED";
        return (
          <span
            className={`text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full border ${
              isCheckedIn
                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                : isBanned || isCancelled
                ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
            }`}
          >
            {isCheckedIn ? "Checked In" : isBanned ? "Banned / Revoked" : isCancelled ? "Cancelled" : "Active Pass"}
          </span>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-3xl bg-zinc-900/60 border border-zinc-800/80">
        <div className="flex flex-wrap items-center gap-2">
          {[
            { id: "all", label: "All Passes" },
            { id: "active", label: "Active Passes" },
            { id: "checked_in", label: "Checked-In (QR Gate)" },
            { id: "banned", label: "Revoked / Banned" },
            { id: "cancelled", label: "Cancelled" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === tab.id
                  ? "bg-[#F5B301] text-zinc-950 shadow-md"
                  : "bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 rounded-2xl bg-[#F5B301] hover:bg-amber-300 text-zinc-950 font-black text-xs flex items-center gap-1.5 shadow-md cursor-pointer ml-auto"
        >
          <RiFileList3Line size={16} />
          <span>Export CSV Roster</span>
        </button>
      </div>

      {/* Main Table */}
      <DataTable
        title="Super Admin Delegate Registrations Directory"
        columns={columns}
        data={filtered}
        searchKey="passCode"
        searchPlaceholder="Search pass code, delegate name, event..."
        onRefresh={onRefresh}
        exportFileName="macfiesta_registrations"
        actions={(row) => (
          <div className="flex items-center justify-end gap-1.5">
            {/* QR Check-In Action */}
            {row.status !== "CHECKED_IN" && (
              <button
                onClick={() => {
                  setRegList((prev) =>
                    prev.map((r) =>
                      r._id === row._id ? { ...r, status: "CHECKED_IN", qrCheckedIn: true } : r
                    )
                  );
                  onCheckIn?.(row.passCode);
                }}
                className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-bold flex items-center gap-1 cursor-pointer"
                title="Force QR Check-In"
              >
                <RiQrCodeLine size={14} />
                <span>Check-In</span>
              </button>
            )}

            {/* Edit Registration */}
            <button
              onClick={() => handleOpenEdit(row)}
              className="p-1.5 rounded-lg bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white text-xs cursor-pointer"
              title="Edit Registration Pass"
            >
              <RiEditLine size={14} />
            </button>

            {/* Ban / Revoke Pass */}
            <button
              onClick={() => handleBanPass(row._id, row.status)}
              className={`p-1.5 rounded-lg border text-xs cursor-pointer ${
                row.status === "BANNED"
                  ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                  : "bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20"
              }`}
              title={row.status === "BANNED" ? "Restore Pass" : "Revoke & Ban Pass"}
            >
              <RiForbidLine size={14} />
            </button>

            {/* Remove / Cancel Pass */}
            <button
              onClick={() => handleDeletePass(row._id)}
              className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 text-xs cursor-pointer"
              title="Permanently Remove Pass"
            >
              <RiDeleteBinLine size={14} />
            </button>
          </div>
        )}
      />

      {/* Edit Registration Modal */}
      {editingReg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#111114] border border-zinc-800 p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-black text-white uppercase flex items-center gap-2">
                <RiEditLine className="text-[#F5B301]" /> Edit Registration Pass
              </h3>
              <button
                onClick={() => setEditingReg(null)}
                className="p-1 rounded-lg text-zinc-500 hover:text-white cursor-pointer"
              >
                <RiCloseLine size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">Delegate Name</label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F5B301]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Registered Event Title</label>
                <input
                  type="text"
                  required
                  value={editEvent}
                  onChange={(e) => setEditEvent(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F5B301]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Fee Amount Paid (₹)</label>
                <input
                  type="number"
                  value={editAmount}
                  onChange={(e) => setEditAmount(Number(e.target.value))}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F5B301]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setEditingReg(null)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F5B301] hover:bg-amber-300 text-zinc-950 font-black flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <RiSaveLine size={14} /> Save Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
