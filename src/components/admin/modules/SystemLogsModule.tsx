"use client";

import { DataTable, Column } from "../shared/DataTable";
import {
  RiFileTextLine,
  RiShieldFlashLine,
  RiServerLine,
  RiDatabase2Line,
} from "react-icons/ri";

interface LogRecord {
  _id?: string;
  action: string;
  user?: string;
  details?: string;
  timestamp?: string;
  ip?: string;
}

interface SystemLogsModuleProps {
  auditLogs: LogRecord[];
  onRefresh?: () => void;
}

export function SystemLogsModule({ auditLogs, onRefresh }: SystemLogsModuleProps) {
  const columns: Column<LogRecord>[] = [
    {
      key: "timestamp",
      header: "Timestamp",
      render: (row) => (
        <span className="font-mono text-xs text-white/50">
          {row.timestamp ? new Date(row.timestamp).toLocaleString() : "Just now"}
        </span>
      ),
    },
    {
      key: "action",
      header: "Executed Action",
      render: (row) => (
        <span className="font-bold text-festival-gold text-xs">{row.action || "System Task"}</span>
      ),
    },
    {
      key: "details",
      header: "Audit Description",
      render: (row) => (
        <span className="text-xs text-white/80">{row.details || "Admin console event logged."}</span>
      ),
    },
    {
      key: "user",
      header: "Operator",
      render: (row) => (
        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-white/5 text-white/70 border border-white/10">
          {row.user || "System Admin"}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-extrabold text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
            <RiFileTextLine className="text-festival-gold" />
            <span>Audit Trail & Security Telemetry Logs</span>
          </h3>
          <p className="text-xs text-white/40">Immutable admin activity logs, authentication history, and API security events</p>
        </div>
      </div>

      {/* Audit Log Table */}
      <DataTable
        title="Administrative Operations Audit Trail"
        columns={columns}
        data={auditLogs}
        searchKey="action"
        searchPlaceholder="Search action, description, or operator..."
        onRefresh={onRefresh}
        exportFileName="macfiesta_audit_logs"
      />
    </div>
  );
}
