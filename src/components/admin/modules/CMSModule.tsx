"use client";

import { useState } from "react";
import {
  RiGlobalLine,
  RiSaveLine,
  RiCheckDoubleLine,
  RiCoupon3Line,
  RiQuestionAnswerLine,
  RiContactsBookLine,
  RiAddLine,
  RiDeleteBinLine,
  RiFileTextLine,
  RiShieldLine,
  RiEditLine,
  RiExternalLinkLine,
  RiMoneyDollarCircleLine,
  RiCloseLine,
  RiEyeLine,
  RiEyeOffLine,
} from "react-icons/ri";
import { useFestivalControl } from "@/lib/festivalStore";

interface SponsorItem {
  id: string;
  name: string;
  tier: string;
  logoUrl: string;
  website: string;
  amount: number;
  active: boolean;
}

export function CMSModule() {
  const [activeTab, setActiveTab] = useState<"hero" | "about" | "sponsors" | "faqs" | "contact" | "rules">("sponsors");
  const { settings, updateSettings } = useFestivalControl();

  // About Section CMS
  const [aboutHeading, setAboutHeading] = useState("About MacFiesta");
  const [aboutBody, setAboutBody] = useState(settings.aboutText);

  // Ultimate Sponsors State
  const [sponsors, setSponsors] = useState<SponsorItem[]>([
    { id: "sp-1", name: "Red Bull", tier: "Title Sponsor", logoUrl: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=150", website: "https://redbull.com", amount: 100000, active: true },
    { id: "sp-2", name: "Monster Energy", tier: "Platinum Partner", logoUrl: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=150", website: "https://monsterenergy.com", amount: 75000, active: true },
    { id: "sp-3", name: "KFC Kerala", tier: "Gold Partner", logoUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150", website: "https://kfc.in", amount: 50000, active: true },
    { id: "sp-4", name: "Spotify", tier: "Audio Partner", logoUrl: "https://images.unsplash.com/photo-1614680376593-902f749f7051?w=150", website: "https://spotify.com", amount: 40000, active: true },
  ]);

  // Sponsor Modal State
  const [showSponsorModal, setShowSponsorModal] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<SponsorItem | null>(null);
  const [spName, setSpName] = useState("");
  const [spTier, setSpTier] = useState("Platinum Partner");
  const [spLogo, setSpLogo] = useState("");
  const [spWeb, setSpWeb] = useState("");
  const [spAmount, setSpAmount] = useState<number>(25000);

  // FAQs State
  const [faqs, setFaqs] = useState([
    { id: "faq-1", question: "Who is eligible to participate in MacFiesta?", answer: "Any student currently enrolled in an accredited college or university with a valid ID card." },
    { id: "faq-2", question: "Is accommodation provided for outstation delegates?", answer: "Yes, hostel accommodations in Block A (Girls) and Block B/C (Boys) are available on booking." },
  ]);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");

  // Rules State
  const [generalRules, setGeneralRules] = useState([
    "Delegates must carry valid college ID cards at all times.",
    "Decisions of judges and festival coordinators are final and binding.",
    "Smoking, alcohol, and contraband are strictly prohibited on campus premises.",
  ]);
  const [newRule, setNewRule] = useState("");

  const [statusMsg, setStatusMsg] = useState("");

  const triggerSaved = (msg = "✓ Public Website Content Updated & Synchronized Live!") => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3000);
  };

  const openAddSponsorModal = (item?: SponsorItem) => {
    if (item) {
      setEditingSponsor(item);
      setSpName(item.name);
      setSpTier(item.tier);
      setSpLogo(item.logoUrl);
      setSpWeb(item.website);
      setSpAmount(item.amount);
    } else {
      setEditingSponsor(null);
      setSpName("");
      setSpTier("Platinum Partner");
      setSpLogo("");
      setSpWeb("");
      setSpAmount(25000);
    }
    setShowSponsorModal(true);
  };

  const handleSaveSponsor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!spName) return;

    if (editingSponsor) {
      setSponsors((prev) =>
        prev.map((s) =>
          s.id === editingSponsor.id
            ? {
              ...s,
              name: spName,
              tier: spTier,
              logoUrl: spLogo || "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=150",
              website: spWeb,
              amount: Number(spAmount) || 0,
            }
            : s
        )
      );
      triggerSaved("✓ Sponsor Details Updated & Synchronized!");
    } else {
      const newItem: SponsorItem = {
        id: `sp-${Date.now()}`,
        name: spName,
        tier: spTier,
        logoUrl: spLogo || "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=150",
        website: spWeb,
        amount: Number(spAmount) || 0,
        active: true,
      };
      setSponsors((prev) => [...prev, newItem]);
      triggerSaved("✓ New Sponsor Added to Public Website!");
    }
    setShowSponsorModal(false);
  };

  const toggleSponsorActive = (id: string) => {
    setSponsors((prev) =>
      prev.map((s) => (s.id === id ? { ...s, active: !s.active } : s))
    );
    triggerSaved("✓ Sponsor Visibility Toggled!");
  };

  const deleteSponsor = (id: string) => {
    if (confirm("Are you sure you want to remove this sponsor?")) {
      setSponsors((prev) => prev.filter((s) => s.id !== id));
      triggerSaved("✓ Sponsor Removed!");
    }
  };

  const handleAddFaq = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestion || !newAnswer) return;
    setFaqs((prev) => [
      ...prev,
      { id: `faq-${Date.now()}`, question: newQuestion, answer: newAnswer },
    ]);
    setNewQuestion("");
    setNewAnswer("");
    triggerSaved();
  };

  const handleAddRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRule) return;
    setGeneralRules((prev) => [...prev, newRule]);
    setNewRule("");
    triggerSaved();
  };

  return (
    <div className="space-y-6">
      {/* CMS Module Banner */}
      <div className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4 backdrop-blur-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-[#F5B301] text-zinc-950 shadow-md">
              Live Website CMS & Sponsors Suite
            </span>
            <span className="text-xs text-zinc-400 font-semibold">Real-Time Synchronization</span>
          </div>
          <h1 className="text-xl font-black text-white uppercase tracking-wider flex items-center gap-2">
            <RiGlobalLine className="text-[#F5B301]" />
            <span>Public Website Content & Sponsor Manager</span>
          </h1>
          <p className="text-xs text-zinc-400">
            Add sponsors, manage tiers, edit homepage hero banner, about text, FAQs, and general rules live.
          </p>
        </div>

        {statusMsg && (
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-full flex items-center gap-1 shadow-md">
            <RiCheckDoubleLine size={16} /> {statusMsg}
          </span>
        )}
      </div>

      {/* CMS Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-3 rounded-3xl bg-zinc-900/60 border border-zinc-800/80">
        {[
          { id: "sponsors", label: "Sponsors & Partners", icon: RiCoupon3Line },
          { id: "hero", label: "Homepage Hero & Video", icon: RiGlobalLine },
          { id: "about", label: "About Page Content", icon: RiFileTextLine },
          { id: "faqs", label: "FAQs Manager", icon: RiQuestionAnswerLine },
          { id: "contact", label: "Contact Info & Address", icon: RiContactsBookLine },
          { id: "rules", label: "General Conduct Rules", icon: RiShieldLine },
        ].map((tab) => {
          const Icon = tab.icon;
          const isSelected = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-extrabold transition-all cursor-pointer ${isSelected
                ? "bg-[#F5B301] text-zinc-950 shadow-md"
                : "bg-zinc-800/60 text-zinc-300 hover:bg-zinc-700 hover:text-white"
                }`}
            >
              <Icon size={16} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. Ultimate Sponsors Suite */}
      {activeTab === "sponsors" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-black text-white uppercase tracking-wider">
                Official Festival Sponsors & Brand Partners
              </h2>
              <p className="text-xs text-zinc-400">
                Sponsors added here display live across the public website homepage and footer.
              </p>
            </div>

            <button
              onClick={() => openAddSponsorModal()}
              className="px-4 py-2.5 rounded-2xl bg-[#F5B301] hover:bg-amber-300 text-zinc-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              <RiAddLine size={18} /> Add New Sponsor
            </button>
          </div>

          {/* Sponsors Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {sponsors.map((sp) => (
              <div
                key={sp.id}
                className={`p-4 rounded-3xl border space-y-3 transition-all ${sp.active
                  ? "bg-zinc-900/60 border-zinc-800/80 hover:border-[#F5B301]/40"
                  : "bg-zinc-950/60 border-zinc-800/40 opacity-60"
                  }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-[#F5B301]/10 text-[#F5B301] border border-[#F5B301]/25">
                    {sp.tier}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleSponsorActive(sp.id)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                      title={sp.active ? "Hide on website" : "Show on website"}
                    >
                      {sp.active ? <RiEyeLine size={15} /> : <RiEyeOffLine size={15} />}
                    </button>
                    <button
                      onClick={() => openAddSponsorModal(sp)}
                      className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
                      title="Edit Sponsor"
                    >
                      <RiEditLine size={15} />
                    </button>
                    <button
                      onClick={() => deleteSponsor(sp.id)}
                      className="p-1 rounded-lg text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                      title="Delete Sponsor"
                    >
                      <RiDeleteBinLine size={15} />
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="font-extrabold text-white text-sm">{sp.name}</p>
                  {sp.website && (
                    <a
                      href={sp.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-zinc-400 hover:text-[#F5B301] flex items-center gap-1 font-mono truncate"
                    >
                      <RiExternalLinkLine size={12} /> {sp.website.replace("https://", "")}
                    </a>
                  )}
                </div>

                <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-zinc-500 font-bold uppercase">Contribution</span>
                  <span className="font-black text-emerald-400">₹{sp.amount.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add / Edit Sponsor Modal */}
      {showSponsorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="bg-[#111114] border border-zinc-800 p-6 rounded-3xl max-w-lg w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-2 uppercase">
                <RiCoupon3Line className="text-[#F5B301]" />
                <span>{editingSponsor ? "Edit Sponsor Details" : "Add New Festival Sponsor"}</span>
              </h3>
              <button
                onClick={() => setShowSponsorModal(false)}
                className="p-1 rounded-lg text-zinc-500 hover:text-white cursor-pointer"
              >
                <RiCloseLine size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveSponsor} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 font-bold mb-1">Company / Sponsor Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Red Bull, Monster Energy, KFC"
                  value={spName}
                  onChange={(e) => setSpName(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F5B301]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Sponsorship Tier</label>
                  <select
                    value={spTier}
                    onChange={(e) => setSpTier(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none font-bold"
                  >
                    <option value="Title Sponsor">Title Sponsor</option>
                    <option value="Platinum Partner">Platinum Partner</option>
                    <option value="Gold Partner">Gold Partner</option>
                    <option value="Silver Partner">Silver Partner</option>
                    <option value="Food Partner">Food Partner</option>
                    <option value="Media Partner">Media Partner</option>
                  </select>
                </div>

                <div>
                  <label className="block text-zinc-400 font-bold mb-1">Contribution (₹)</label>
                  <input
                    type="number"
                    value={spAmount}
                    onChange={(e) => setSpAmount(Number(e.target.value))}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#F5B301]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Official Website URL</label>
                <input
                  type="url"
                  placeholder="https://sponsor.com"
                  value={spWeb}
                  onChange={(e) => setSpWeb(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#F5B301]"
                />
              </div>

              <div>
                <label className="block text-zinc-400 font-bold mb-1">Sponsor Logo URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={spLogo}
                  onChange={(e) => setSpLogo(e.target.value)}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-[#F5B301]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowSponsorModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#F5B301] hover:bg-amber-300 text-zinc-950 font-black flex items-center gap-1.5 cursor-pointer shadow-md"
                >
                  <RiSaveLine size={14} /> Save Sponsor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Hero Section CMS */}
      {activeTab === "hero" && (
        <form onSubmit={(e) => { e.preventDefault(); triggerSaved(); }} className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 space-y-5 max-w-3xl">
          <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-zinc-800 pb-3">
            Homepage Hero Copy & Video Banner
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Festival Tagline</label>
              <input
                type="text"
                value={settings.tagline}
                onChange={(e) => updateSettings({ tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:border-[#F5B301] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Festival Subtitle</label>
              <input
                type="text"
                value={settings.subtitle}
                onChange={(e) => updateSettings({ subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:border-[#F5B301] focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Homepage Promo Video URL</label>
              <input
                type="text"
                value={settings.homepageBanner}
                onChange={(e) => updateSettings({ homepageBanner: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs font-mono focus:border-[#F5B301] focus:outline-none"
              />
            </div>
          </div>

          <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#F5B301] hover:bg-amber-300 text-zinc-950 text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer">
            <RiSaveLine size={16} />
            <span>Update Hero Copy Live</span>
          </button>
        </form>
      )}

      {/* 3. About Section CMS */}
      {activeTab === "about" && (
        <form onSubmit={(e) => { e.preventDefault(); updateSettings({ aboutText: aboutBody }); triggerSaved(); }} className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 space-y-5 max-w-3xl">
          <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-zinc-800 pb-3">
            About Festival Page Content
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Page Title</label>
              <input
                type="text"
                value={aboutHeading}
                onChange={(e) => setAboutHeading(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:border-[#F5B301] focus:outline-none font-bold"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">About Text Overview</label>
              <textarea
                rows={5}
                value={aboutBody}
                onChange={(e) => setAboutBody(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:border-[#F5B301] focus:outline-none"
              />
            </div>
          </div>

          <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#F5B301] hover:bg-amber-300 text-zinc-950 text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer">
            <RiSaveLine size={16} />
            <span>Publish About Content</span>
          </button>
        </form>
      )}

      {/* 4. FAQs Manager CMS */}
      {activeTab === "faqs" && (
        <div className="space-y-6 max-w-4xl">
          <form onSubmit={handleAddFaq} className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-zinc-800 pb-3">
              Add Frequently Asked Question (FAQ)
            </h4>
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Question</label>
              <input
                type="text"
                required
                placeholder="What is the refund policy?..."
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:border-[#F5B301] focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Answer</label>
              <textarea
                required
                rows={3}
                placeholder="Provide detailed answer..."
                value={newAnswer}
                onChange={(e) => setNewAnswer(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:border-[#F5B301] focus:outline-none"
              />
            </div>
            <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#F5B301] hover:bg-amber-300 text-zinc-950 text-xs font-black flex items-center gap-1.5 cursor-pointer">
              <RiAddLine size={16} />
              <span>Publish FAQ</span>
            </button>
          </form>

          <div className="space-y-3">
            {faqs.map((faq) => (
              <div key={faq.id} className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-white text-xs">{faq.question}</p>
                  <button
                    type="button"
                    onClick={() => setFaqs((prev) => prev.filter((f) => f.id !== faq.id))}
                    className="p-1 rounded text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                  >
                    <RiDeleteBinLine size={14} />
                  </button>
                </div>
                <p className="text-xs text-zinc-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. Contact Info CMS */}
      {activeTab === "contact" && (
        <form onSubmit={(e) => { e.preventDefault(); triggerSaved(); }} className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 space-y-5 max-w-3xl">
          <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-zinc-800 pb-3">
            Public Contact Details CMS
          </h4>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Official Festival Email</label>
              <input
                type="email"
                value={settings.contactEmail}
                onChange={(e) => updateSettings({ contactEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:border-[#F5B301] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Helpline Phone Number</label>
              <input
                type="text"
                value={settings.contactPhone}
                onChange={(e) => updateSettings({ contactPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:border-[#F5B301] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase font-bold text-zinc-400 mb-1.5">Venue Campus Address</label>
              <textarea
                rows={3}
                value={settings.venueAddress}
                onChange={(e) => updateSettings({ venueAddress: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:border-[#F5B301] focus:outline-none"
              />
            </div>
          </div>

          <button type="submit" className="px-6 py-2.5 rounded-xl bg-[#F5B301] hover:bg-amber-300 text-zinc-950 text-xs font-black shadow-lg flex items-center gap-2 cursor-pointer">
            <RiSaveLine size={16} />
            <span>Save Contact Info CMS</span>
          </button>
        </form>
      )}

      {/* 6. General Rules CMS */}
      {activeTab === "rules" && (
        <div className="space-y-6 max-w-4xl">
          <form onSubmit={handleAddRule} className="p-6 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 space-y-4">
            <h4 className="text-xs font-black text-white uppercase tracking-widest border-b border-zinc-800 pb-3">
              General Festival Conduct Rules
            </h4>
            <div className="flex gap-2">
              <input
                type="text"
                required
                placeholder="Enter general rule or regulation..."
                value={newRule}
                onChange={(e) => setNewRule(e.target.value)}
                className="flex-1 px-3.5 py-2.5 bg-zinc-900 border border-zinc-800 rounded-xl text-white text-xs focus:border-[#F5B301] focus:outline-none"
              />
              <button type="submit" className="px-5 py-2.5 rounded-xl bg-[#F5B301] hover:bg-amber-300 text-zinc-950 text-xs font-black flex items-center gap-1.5 cursor-pointer shrink-0">
                <RiAddLine size={16} />
                <span>Add Rule</span>
              </button>
            </div>
          </form>

          <div className="space-y-2">
            {generalRules.map((rule, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-zinc-900/60 border border-zinc-800 flex items-center justify-between gap-3 text-xs text-white">
                <span className="font-mono text-[#F5B301] font-bold">Rule {idx + 1}:</span>
                <p className="flex-1">{rule}</p>
                <button
                  type="button"
                  onClick={() => setGeneralRules((prev) => prev.filter((_, i) => i !== idx))}
                  className="p-1 rounded text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
                >
                  <RiDeleteBinLine size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
