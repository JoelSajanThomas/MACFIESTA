"use client";

import { useState, useEffect } from "react";

// ── 1. Judge Account Interface ─────────────────────────────────────────
export interface JudgePermission {
  canEditSubmittedScores: boolean;
  canSaveDrafts: boolean;
  canUploadComments: boolean;
  canViewOtherJudgesScores: boolean;
  canPublishResults: boolean;
}

export interface JudgeUser {
  id: string;
  judgeCode: string; // e.g. JDG-201
  name: string;
  photoUrl: string;
  designation: string;
  organization: string;
  email: string;
  phone: string;
  assignedEventId: string;
  assignedEventName: string;
  category: string;
  permissions: JudgePermission;
  status: "ACTIVE" | "PENDING_REVIEW" | "SUSPENDED";
}

// ── 2. Evaluation Criteria & Scoring ─────────────────────────────────
export interface RubricCriterion {
  id: string;
  name: string;
  maxPoints: number;
  weightPercent: number;
}

export interface TeamParticipant {
  id: string;
  teamCode: string; // e.g. TM-101
  teamName: string;
  collegeName: string;
  leadName: string;
  eventId: string;
  presentationSlot: string;
  projectTitle: string;
}

export interface TeamScoreEntry {
  id: string;
  judgeId: string;
  teamId: string;
  criteriaScores: Record<string, number>; // criterionId -> score
  totalScore: number;
  comments: string;
  status: "DRAFT" | "SUBMITTED";
  submittedAt: string;
}

// ── DEFAULT INITIAL SEED DATA ─────────────────────────────────────────
const DEFAULT_JUDGES: JudgeUser[] = [
  {
    id: "jdg-1",
    judgeCode: "JDG-201",
    name: "Dr. Vikram Sethi",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    designation: "Principal AI Research Scientist",
    organization: "TCS Innovation Labs",
    email: "vikram.sethi@tcs.com",
    phone: "+91 98470 33001",
    assignedEventId: "ev-1",
    assignedEventName: "Byte & Code Hackathon",
    category: "Coding & AI",
    status: "ACTIVE",
    permissions: {
      canEditSubmittedScores: false,
      canSaveDrafts: true,
      canUploadComments: true,
      canViewOtherJudgesScores: false,
      canPublishResults: false,
    },
  },
  {
    id: "jdg-2",
    judgeCode: "JDG-202",
    name: "Meera Nair",
    photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150",
    designation: "Choreographer & Film Director",
    organization: "Kerala Film Academy",
    email: "meera.nair@keralafilm.org",
    phone: "+91 98470 33002",
    assignedEventId: "ev-4",
    assignedEventName: "Choreo Dance & Pro Show",
    category: "Cultural & Arts",
    status: "ACTIVE",
    permissions: {
      canEditSubmittedScores: true,
      canSaveDrafts: true,
      canUploadComments: true,
      canViewOtherJudgesScores: true,
      canPublishResults: true,
    },
  },
];

const DEFAULT_RUBRIC: RubricCriterion[] = [
  { id: "cr-1", name: "Technical Complexity & Architecture", maxPoints: 30, weightPercent: 30 },
  { id: "cr-2", name: "Innovation & Problem Solving", maxPoints: 30, weightPercent: 30 },
  { id: "cr-3", name: "UI/UX & Interactive Design", maxPoints: 20, weightPercent: 20 },
  { id: "cr-4", name: "Q&A Defense & Presentation", maxPoints: 20, weightPercent: 20 },
];

const DEFAULT_TEAMS: TeamParticipant[] = [
  {
    id: "tm-101",
    teamCode: "TM-101",
    teamName: "Neural Ninjas",
    collegeName: "CET Trivandrum",
    leadName: "Rohan Varghese",
    eventId: "ev-1",
    presentationSlot: "10:00 AM (Slot 1)",
    projectTitle: "Jarvis AI Autonomous Defense System",
  },
  {
    id: "tm-102",
    teamCode: "TM-102",
    teamName: "Code Warriors",
    collegeName: "St. Joseph's Pala",
    leadName: "Ananya Nair",
    eventId: "ev-1",
    presentationSlot: "10:30 AM (Slot 2)",
    projectTitle: "Quantum Encryption Mesh Network",
  },
  {
    id: "tm-103",
    teamCode: "TM-103",
    teamName: "Cyber Knights",
    collegeName: "MACFAST Tiruvalla",
    leadName: "Kiran Kumar",
    eventId: "ev-1",
    presentationSlot: "11:00 AM (Slot 3)",
    projectTitle: "Arc Reactor Power Grid Monitor",
  },
  {
    id: "tm-104",
    teamCode: "TM-104",
    teamName: "Vanguard Techs",
    collegeName: "GEC Barton Hill",
    leadName: "Siddharth Menon",
    eventId: "ev-1",
    presentationSlot: "11:30 AM (Slot 4)",
    projectTitle: "Biometric Drone Fleet Controller",
  },
];

const DEFAULT_SCORES: TeamScoreEntry[] = [
  {
    id: "sc-1",
    judgeId: "jdg-1",
    teamId: "tm-101",
    criteriaScores: { "cr-1": 28, "cr-2": 29, "cr-3": 18, "cr-4": 19 },
    totalScore: 94,
    comments: "Exceptional system architecture and defense during Q&A.",
    status: "SUBMITTED",
    submittedAt: "2026-08-07 10:45",
  },
];

// ── BROADCAST CHANNEL SYNC ──────────────────────────────────────────
let listeners: Array<() => void> = [];
let syncChannel: BroadcastChannel | null = null;

if (typeof window !== "undefined" && "BroadcastChannel" in window) {
  try {
    syncChannel = new BroadcastChannel("macfiesta_judge_sync");
    syncChannel.onmessage = () => notifyListeners();
  } catch {}
}

function notifyListeners() {
  listeners.forEach((l) => l());
  if (syncChannel) {
    try {
      syncChannel.postMessage("updated");
    } catch {}
  }
}

// ── GETTERS AND SETTERS ──────────────────────────────────────────────
export function getJudgesList(): JudgeUser[] {
  if (typeof window === "undefined") return DEFAULT_JUDGES;
  try {
    const saved = localStorage.getItem("macfiesta_judges_list");
    return saved ? JSON.parse(saved) : DEFAULT_JUDGES;
  } catch {
    return DEFAULT_JUDGES;
  }
}

export function saveJudgesList(list: JudgeUser[]) {
  try {
    localStorage.setItem("macfiesta_judges_list", JSON.stringify(list));
  } catch {}
  notifyListeners();
  return list;
}

export function getJudgeScores(): TeamScoreEntry[] {
  if (typeof window === "undefined") return DEFAULT_SCORES;
  try {
    const saved = localStorage.getItem("macfiesta_judge_scores");
    return saved ? JSON.parse(saved) : DEFAULT_SCORES;
  } catch {
    return DEFAULT_SCORES;
  }
}

export function saveJudgeScores(scores: TeamScoreEntry[]) {
  try {
    localStorage.setItem("macfiesta_judge_scores", JSON.stringify(scores));
  } catch {}
  notifyListeners();
  return scores;
}

// ── REACT HOOK FOR DEDICATED JUDGE PORTAL ────────────────────────────
export function useJudgeControl(judgeId = "jdg-1") {
  const [judges, setJudges] = useState<JudgeUser[]>(DEFAULT_JUDGES);
  const [scores, setScores] = useState<TeamScoreEntry[]>(DEFAULT_SCORES);
  const [teams] = useState<TeamParticipant[]>(DEFAULT_TEAMS);
  const [rubric] = useState<RubricCriterion[]>(DEFAULT_RUBRIC);

  const refreshAll = () => {
    setJudges(getJudgesList());
    setScores(getJudgeScores());
  };

  useEffect(() => {
    refreshAll();
    const handleChange = () => refreshAll();
    listeners.push(handleChange);

    const handleStorage = (e: StorageEvent) => {
      if (e.key && e.key.startsWith("macfiesta_judge_")) refreshAll();
    };
    if (typeof window !== "undefined") window.addEventListener("storage", handleStorage);

    return () => {
      listeners = listeners.filter((l) => l !== handleChange);
      if (typeof window !== "undefined") window.removeEventListener("storage", handleStorage);
    };
  }, []);

  const currentJudge = judges.find((j) => j.id === judgeId) || judges[0];
  const assignedTeams = teams.filter((t) => t.eventId === currentJudge?.assignedEventId);
  const myScores = scores.filter((s) => s.judgeId === currentJudge?.id);

  const submitScoreEntry = (teamId: string, criteriaScores: Record<string, number>, comments: string, status: "DRAFT" | "SUBMITTED") => {
    const totalScore = Object.values(criteriaScores).reduce((acc, curr) => acc + curr, 0);

    const existingIndex = scores.findIndex((s) => s.judgeId === currentJudge.id && s.teamId === teamId);
    let updated: TeamScoreEntry[];

    if (existingIndex >= 0) {
      updated = scores.map((s, idx) => {
        if (idx === existingIndex) {
          return {
            ...s,
            criteriaScores,
            totalScore,
            comments,
            status,
            submittedAt: new Date().toLocaleString(),
          };
        }
        return s;
      });
    } else {
      const newEntry: TeamScoreEntry = {
        id: `sc-${Date.now()}`,
        judgeId: currentJudge.id,
        teamId,
        criteriaScores,
        totalScore,
        comments,
        status,
        submittedAt: new Date().toLocaleString(),
      };
      updated = [newEntry, ...scores];
    }

    saveJudgeScores(updated);
  };

  return {
    judges,
    currentJudge,
    assignedTeams,
    myScores,
    rubric,
    submitScoreEntry,
  };
}
