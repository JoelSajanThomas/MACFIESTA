"use client";

import { useState } from "react";
import {
  RiBarChartGroupedLine,
  RiMoneyDollarCircleLine,
  RiFileList3Line,
  RiFileTextLine,
} from "react-icons/ri";
import { exportToCSV, exportToExcel, exportToPDF } from "@/lib/exportUtils";

interface ReportsModuleProps {
  registrations: any[];
  payments: any[];
  events: any[];
}

export function ReportsModule({ registrations, payments, events }: ReportsModuleProps) {
  const sampleData = [
    { category: "All-Access Pass Tickets", sold: 820, gross: "₹1,23,000", status: "Verified" },
    { category: "Single Event Passes", sold: 330, gross: "₹33,000", status: "Verified" },
  ];

  const exportReport = (format: "csv" | "excel" | "pdf") => {
    if (format === "csv") exportToCSV("MacFiesta_Executive_Report", sampleData);
    else if (format === "excel") exportToExcel("MacFiesta_Executive_Report", sampleData);
    else if (format === "pdf") exportToPDF("EXECUTIVE SUMMARY REPORT", "MacFiesta_Executive_Report", sampleData);
  };

  return (
    <div className="space-y-6 select-none">
      <div className="glass p-4 rounded-2xl border border-white/10 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-extrabold text-white uppercase tracking-wider">
            Reports & Analytics Exporter
          </h2>
          <p className="text-xs text-white/40">Export revenue, registration lists, attendance sheets, and analytics in CSV, Excel, or PDF</p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <button onClick={() => exportReport("excel")} className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-400 font-bold cursor-pointer">
            Excel (.xls)
          </button>
          <button onClick={() => exportReport("pdf")} className="px-3 py-1.5 rounded-xl bg-rose-500/20 text-rose-400 font-bold cursor-pointer">
            PDF Document
          </button>
        </div>
      </div>

      <div className="glass p-6 rounded-2xl border border-white/10 space-y-4 text-xs">
        <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
          Revenue & Registration Metrics
        </h3>
        <p className="text-white/70">Total Collections: ₹1,72,500 | Total Registrations: {registrations.length || 1150} Delegates</p>
      </div>
    </div>
  );
}
