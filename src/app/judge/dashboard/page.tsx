"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  RiScales3Line,
  RiCheckDoubleLine,
  RiTimeLine,
  RiLogoutBoxRLine,
  RiAwardLine,
  RiStarLine,
  RiSaveLine,
  RiSendPlaneLine,
  RiFileTextLine,
  RiTrophyLine,
  RiInformationLine,
  RiSparklingLine,
  RiShieldUserLine,
  RiBuilding2Line,
} from "react-icons/ri";
import {
  useJudgeControl,
  TeamParticipant,
  RubricCriterion,
  TeamScoreEntry,
} from "@/lib/judgeStore";

export default function JudgeDashboardPage() {
  const router = useRouter();

  const {
    currentJudge,
    assignedTeams,
    myScores,
    rubric,
    saveScoreEntry,
    submitScoreEntry,
  } = useJudgeControl();


  const [activeTab, setActiveTab] = useState<"evaluate" | "leaderboard" | "rubric" | "bulletins">("evaluate");
  const [selectedTeamId, setSelectedTeamId] = useState<string>(assignedTeams[0]?.id || "tm-101");
  const [statusMsg, setStatusMsg] = useState("");

  // Scoring Form State per selected team
  const [criteriaScores, setCriteriaScores] = useState<Record<string, number>>({});
  const [comments, setComments] = useState("");

  const selectedTeam = assignedTeams.find((t: TeamParticipant) => t.id === selectedTeamId) || assignedTeams[0];

  const existingScore = myScores.find((s) => s.teamId === selectedTeamId);

  useEffect(() => {
    if (existingScore) {
      setCriteriaScores(existingScore.criteriaScores || {});
      setComments(existingScore.comments || "");
    } else {
      // Default default scores (e.g. half of maxPoints)
      const init: Record<string, number> = {};
      rubric.forEach((c) => {
        init[c.id] = Math.round(c.maxPoints * 0.8);
      });
      setCriteriaScores(init);
      setComments("");
    }
  }, [selectedTeamId, existingScore, rubric]);

  const triggerToast = (msg: string) => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3500);
  };

  const handleScoreChange = (criterionId: string, val: number) => {
    setCriteriaScores((prev) => ({
      ...prev,
      [criterionId]: val,
    }));
  };

  const handleSaveScore = (status: "DRAFT" | "SUBMITTED") => {
    if (!selectedTeam) return;
    saveScoreEntry(selectedTeam.id, criteriaScores, comments, status);

    if (status === "SUBMITTED") {
      triggerToast(`✓ Scorecard for ${selectedTeam.teamName} Officially Submitted!`);
    } else {
      triggerToast(`✓ Score Draft for ${selectedTeam.teamName} Saved!`);
    }
  };

  if (!currentJudge) {
    return (
      <div className="bg-[#05050A] min-h-screen flex items-center justify-center font-mono">
        <div className="text-white/40 text-xs font-bold uppercase tracking-widest animate-pulse">
          Loading Executive Jury Portal...
        </div>
      </div>
    );
  }

  const currentTotalScore = Object.values(criteriaScores).reduce((acc, curr) => acc + (curr || 0), 0);
  const maxPossibleTotal = rubric.reduce((acc, curr) => acc + curr.maxPoints, 0);

  return (
    <div className="bg-[#05050A] min-h-screen text-white font-mono flex flex-col justify-between relative overflow-hidden select-none">
      {/* Background Marvel Glows */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
        <Image
          src="/MARVEL/3025924746959430.jpg"
          alt="Marvel Background"
          fill
          priority
          className="object-cover object-center filter brightness-110 contrast-125 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#05050A]/90 via-[#05050A]/95 to-[#05050A] z-10" />
      </div>

      {/* TOP HEADER NAV */}
      <header className="relative z-20 px-6 lg:px-12 py-5 border-b border-white/10 bg-black/60 backdrop-blur-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-metallic-gold to-amber-600 flex items-center justify-center font-black text-black text-lg shadow-[0_0_20px_rgba(212,175,55,0.4)]">
            ⚖️
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
                {currentJudge.name}
              </span>
              <span className="px-2 py-0.5 rounded bg-metallic-gold/20 border border-metallic-gold/40 text-metallic-gold text-[10px] font-bold">
                {currentJudge.judgeCode}
              </span>
            </div>
            <span className="text-[10px] text-white/50 block font-mono">
              {currentJudge.designation} • {currentJudge.organization}
            </span>
          </div>
        </div>

        {/* Action Controls & Assigned Event Badge */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-metallic-gold/10 border border-metallic-gold/30 text-metallic-gold text-xs font-bold uppercase flex items-center gap-2">
            <RiAwardLine />
            <span>Event: {currentJudge.assignedEventName}</span>
          </div>

          <Link
            href="/judge/login"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-marvel-red/20 border border-white/10 hover:border-marvel-red text-white/70 hover:text-marvel-red transition-colors cursor-pointer"
            title="Log Out Jury Session"
          >
            <RiLogoutBoxRLine className="text-base" />
          </Link>
        </div>
      </header>

      {/* TOAST FEEDBACK ALERT */}
      {statusMsg && (
        <div className="fixed top-20 right-6 z-50 px-5 py-3 bg-metallic-gold/90 border border-amber-300 text-black text-xs font-bold rounded-2xl shadow-[0_0_25px_rgba(212,175,55,0.6)] animate-bounce flex items-center gap-2">
          <RiCheckDoubleLine className="text-lg" />
          <span>{statusMsg}</span>
        </div>
      )}

      {/* MAIN JURY DASHBOARD CONTAINER */}
      <main className="relative z-20 flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        {/* HERO STATUS BANNER */}
        <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-r from-black/90 via-[#0A0D1A] to-[#05050A] border-2 border-metallic-gold/30 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-[0_0_40px_rgba(212,175,55,0.15)]">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-metallic-gold/10 border border-metallic-gold/30 text-metallic-gold text-[10px] font-bold uppercase tracking-widest">
              <RiScales3Line />
              <span>EXECUTIVE JURY EVALUATION CONTROL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
              Official Evaluation <span className="marvel-bang-comic-gradient font-black">Portal</span>
            </h1>
            <p className="text-xs text-white/60">
              Evaluating: {currentJudge.assignedEventName} | Category: {currentJudge.category}
            </p>
          </div>

          {/* Evaluation Counter Gauge */}
          <div className="w-full md:w-64 p-4 bg-black/60 border border-white/10 rounded-2xl space-y-1 text-xs">
            <div className="flex justify-between items-center font-bold">
              <span className="text-white/60 uppercase">Scorecards Filed</span>
              <span className="text-metallic-gold font-mono">{myScores.length} / {assignedTeams.length}</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-metallic-gold to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${assignedTeams.length > 0 ? (myScores.length / assignedTeams.length) * 100 : 100}%` }}
              />
            </div>
            <div className="text-[10px] text-white/40 text-right">
              {assignedTeams.length - myScores.length} team evaluations remaining
            </div>
          </div>
        </div>

        {/* NAVIGATION SUB-TAB RAIL */}
        <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none gap-1">
          {[
            { id: "evaluate", label: `Team Evaluation Sheet (${assignedTeams.length})`, icon: RiStarLine },
            { id: "leaderboard", label: "Live Scoreboard Matrix", icon: RiTrophyLine },
            { id: "rubric", label: "Rubric Criteria & Weights", icon: RiFileTextLine },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300 flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-metallic-gold text-black shadow-[0_0_15px_rgba(212,175,55,0.4)]"
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

        {/* 1. TEAM EVALUATION SHEET TAB */}
        {activeTab === "evaluate" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Team Roster Selector */}
            <div className="lg:col-span-4 marvel-card p-6 rounded-3xl border border-metallic-gold/30 bg-[#0A0D1A] space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2" style={{ fontFamily: "var(--font-heading)" }}>
                <RiAwardLine className="text-metallic-gold" />
                <span>Participating Teams</span>
              </h3>

              <div className="space-y-2 text-xs">
                {assignedTeams.map((team: TeamParticipant) => {

                  const isSelected = selectedTeamId === team.id;
                  const score = myScores.find((s) => s.teamId === team.id);
                  return (
                    <div
                      key={team.id}
                      onClick={() => setSelectedTeamId(team.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer space-y-1 ${
                        isSelected
                          ? "bg-metallic-gold/15 border-metallic-gold text-white shadow-[0_0_15px_rgba(212,175,55,0.3)]"
                          : "bg-black/40 border-white/10 text-white/70 hover:border-white/30"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-white text-sm">{team.teamName}</span>
                        <span className="px-2 py-0.5 rounded bg-metallic-gold/20 text-metallic-gold text-[9px] font-bold">
                          {team.teamCode}
                        </span>
                      </div>
                      <div className="text-[11px] text-white/50">{team.collegeName}</div>
                      <div className="flex justify-between items-center text-[10px] pt-1 border-t border-white/10">
                        <span className="text-arc-cyan font-bold">{team.presentationSlot}</span>
                        {score ? (
                          <span className={score.status === "SUBMITTED" ? "text-emerald-400 font-bold" : "text-amber-400 font-bold"}>
                            ● {score.status} ({score.totalScore} pts)
                          </span>
                        ) : (
                          <span className="text-white/30">Not Evaluated</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Evaluation Sheet */}
            {selectedTeam && (
              <div className="lg:col-span-8 space-y-6">
                <div className="marvel-card p-6 md:p-8 rounded-3xl border border-metallic-gold/30 bg-[#0A0D1A] space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-2">
                    <div>
                      <span className="text-[10px] text-metallic-gold font-bold uppercase">{selectedTeam.teamCode} • {selectedTeam.collegeName}</span>
                      <h3 className="text-xl font-black text-white uppercase" style={{ fontFamily: "var(--font-heading)" }}>
                        {selectedTeam.teamName}
                      </h3>
                      <p className="text-xs text-white/60">Project Title: {selectedTeam.projectTitle}</p>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-black text-metallic-gold font-mono">
                        {currentTotalScore} <span className="text-xs text-white/40 font-normal">/ {maxPossibleTotal} pts</span>
                      </div>
                      {existingScore && (
                        <span className={`px-2.5 py-0.5 rounded text-[9px] font-bold uppercase ${existingScore.status === "SUBMITTED" ? "bg-emerald-500 text-black" : "bg-amber-500 text-black"}`}>
                          {existingScore.status}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Rubric Input Sliders Grid */}
                  <div className="space-y-5 text-xs">
                    <h4 className="font-bold text-metallic-gold uppercase tracking-wider">Evaluation Rubric Scores</h4>

                    {rubric.map((c) => {
                      const currentVal = criteriaScores[c.id] || 0;
                      return (
                        <div key={c.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white text-sm">{c.name}</span>
                            <span className="px-3 py-1 bg-metallic-gold/20 text-metallic-gold font-bold rounded-lg text-xs font-mono">
                              {currentVal} / {c.maxPoints} pts
                            </span>
                          </div>

                          <div className="flex items-center gap-4">
                            <input
                              type="range"
                              min={0}
                              max={c.maxPoints}
                              value={currentVal}
                              onChange={(e) => handleScoreChange(c.id, Number(e.target.value))}
                              className="w-full accent-metallic-gold cursor-pointer"
                            />
                            <input
                              type="number"
                              min={0}
                              max={c.maxPoints}
                              value={currentVal}
                              onChange={(e) => handleScoreChange(c.id, Number(e.target.value))}
                              className="w-16 px-2 py-1 bg-white/5 border border-white/10 rounded-lg text-center font-bold text-white font-mono"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mandatory Feedback & Comments */}
                  <div className="space-y-2 text-xs">
                    <label className="block font-bold text-white uppercase tracking-wider">Jury Feedback & Critique Notes</label>
                    <textarea
                      rows={3}
                      placeholder="Add official critique notes for the team..."
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-metallic-gold focus:outline-none"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => handleSaveScore("DRAFT")}
                      className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase flex items-center gap-2 cursor-pointer transition-colors"
                    >
                      <RiSaveLine />
                      <span>Save Draft</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSaveScore("SUBMITTED")}
                      className="btn-primary py-3 px-6 text-xs uppercase font-bold flex items-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(212,175,55,0.5)]"
                    >
                      <RiSendPlaneLine />
                      <span>Submit Final Scorecard</span>
                    </button>
                  </div>

                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. LEADERBOARD MATRIX TAB */}
        {activeTab === "leaderboard" && (
          <div className="marvel-card p-6 md:p-8 rounded-3xl border border-metallic-gold/30 bg-[#0A0D1A] space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Live Scorecard Summary Matrix
            </h3>

            <div className="space-y-3 text-xs">
              {assignedTeams.map((t: TeamParticipant) => {

                const score = myScores.find((s) => s.teamId === t.id);
                return (
                  <div key={t.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{t.teamName}</span>
                        <span className="text-white/40 text-[10px]">({t.collegeName})</span>
                      </div>
                      <p className="text-white/60 mt-1">{t.projectTitle}</p>
                    </div>

                    <div className="text-right">
                      {score ? (
                        <div>
                          <div className="text-lg font-black text-metallic-gold font-mono">{score.totalScore} pts</div>
                          <span className="text-[10px] text-emerald-400 font-bold uppercase">{score.status}</span>
                        </div>
                      ) : (
                        <span className="text-white/30 italic">Not Evaluated</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 3. RUBRIC CRITERIA TAB */}
        {activeTab === "rubric" && (
          <div className="marvel-card p-6 md:p-8 rounded-3xl border border-metallic-gold/30 bg-[#0A0D1A] space-y-6">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Official Evaluation Criteria Rubric
            </h3>

            <div className="space-y-4 text-xs">
              {rubric.map((c) => (
                <div key={c.id} className="p-5 bg-black/40 border border-white/10 rounded-2xl flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-white text-base">{c.name}</h4>
                    <span className="text-white/50 text-[11px]">Weightage Percentage: {c.weightPercent}%</span>
                  </div>
                  <span className="px-4 py-2 bg-metallic-gold/20 text-metallic-gold font-bold text-sm rounded-xl font-mono">
                    Max: {c.maxPoints} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="relative z-20 border-t border-white/10 px-6 py-4 text-[11px] text-white/50 flex flex-col sm:flex-row items-center justify-between gap-2 bg-black/80">
        <div>
          © 2026 <span className="text-white font-bold">MacFiesta Pro</span> Executive Jury Portal.
        </div>
        <div className="text-metallic-gold font-bold">v4.8.2-JURY</div>
      </footer>
    </div>
  );
}
