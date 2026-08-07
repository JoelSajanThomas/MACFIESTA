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
  RiPaletteLine,
  RiMagicLine,
  RiMegaphoneLine,
  RiFileList3Line,
  RiFolderImageLine,
  RiLayoutGridLine,
  RiNavigationLine,
  RiShieldFlashLine,
  RiSparklingLine,
  RiBuilding2Line,
  RiChat1Line,
} from "react-icons/ri";
import { useFestivalControl } from "@/lib/festivalStore";

export function CMSModule() {
  const [activeTab, setActiveTab] = useState<
    | "hero"
    | "navbar"
    | "about"
    | "departments"
    | "sponsors"
    | "testimonials"
    | "faqs"
    | "contact"
    | "theme"
    | "announcements"
    | "forms"
    | "seo"
  >("hero");

  const {
    settings,
    timeline,
    theme,
    navbar,
    sections,
    departments,
    sponsors,
    testimonials,
    faqs,
    announcements,
    animations,
    seo,
    formFields,
    updateSettings,
    updateTimeline,
    updateTheme,
    updateNavbar,
    updateSections,
    updateDepartments,
    updateSponsors,
    updateTestimonials,
    updateFaqs,
    updateAnnouncements,
    updateAnimations,
    updateSeo,
    updateFormFields,
  } = useFestivalControl();

  const [statusMsg, setStatusMsg] = useState("");

  const triggerSaved = (msg = "✓ Public Website Content Updated & Synchronized Live!") => {
    setStatusMsg(msg);
    setTimeout(() => setStatusMsg(""), 3500);
  };

  // ── 1. Hero Form State ─────────────────────────────────────────────
  const [heroTitle, setHeroTitle] = useState(settings.heroTitle || "WELCOME TO");
  const [heroName, setHeroName] = useState(settings.name || "MACFIESTA");
  const [heroSubtitle, setHeroSubtitle] = useState(settings.heroSubtitle || "MARVELVERSE");
  const [heroDesc, setHeroDesc] = useState(settings.heroDesc || "");
  const [bgType, setBgType] = useState<"video" | "image" | "3d">(settings.bgType || "image");
  const [videoBgUrl, setVideoBgUrl] = useState(settings.videoBgUrl || "/MARVEL/Video Project 4.mp4");
  const [wallpaperUrl, setWallpaperUrl] = useState(settings.wallpaperUrl || "/MARVEL/3025924746959430.jpg");
  const [ctaPrimaryText, setCtaPrimaryText] = useState(settings.ctaPrimaryText || "Join Mission Now");
  const [ctaPrimaryUrl, setCtaPrimaryUrl] = useState(settings.ctaPrimaryUrl || "/events");
  const [ctaSecondaryText, setCtaSecondaryText] = useState(settings.ctaSecondaryText || "Explore Schedule");
  const [ctaSecondaryUrl, setCtaSecondaryUrl] = useState(settings.ctaSecondaryUrl || "/schedule");
  const [floatingIronMan, setFloatingIronMan] = useState(settings.floatingIronManEnabled);

  const saveHero = () => {
    updateSettings({
      heroTitle,
      name: heroName,
      heroSubtitle,
      heroDesc,
      bgType,
      videoBgUrl,
      wallpaperUrl,
      ctaPrimaryText,
      ctaPrimaryUrl,
      ctaSecondaryText,
      ctaSecondaryUrl,
      floatingIronManEnabled: floatingIronMan,
    });
    triggerSaved("✓ Hero Section & Video/Wallpaper Background Live Updated!");
  };

  // ── 2. Navbar State ────────────────────────────────────────────────
  const [logoText, setLogoText] = useState(navbar.logoText);
  const [stickyMode, setStickyMode] = useState(navbar.stickyMode);
  const [glassEffect, setGlassEffect] = useState(navbar.glassEffect);
  const [navItems, setNavItems] = useState(navbar.items);
  const [newNavLabel, setNewNavLabel] = useState("");
  const [newNavHref, setNewNavHref] = useState("");

  const saveNavbar = () => {
    updateNavbar({
      logoText,
      stickyMode,
      glassEffect,
      items: navItems,
    });
    triggerSaved("✓ Navbar Links & Glass Effect Live Updated!");
  };

  const addNavItem = () => {
    if (!newNavLabel || !newNavHref) return;
    const updated = [
      ...navItems,
      {
        id: `nav-${Date.now()}`,
        label: newNavLabel,
        href: newNavHref,
        visible: true,
        order: navItems.length,
      },
    ];
    setNavItems(updated);
    setNewNavLabel("");
    setNewNavHref("");
  };

  const deleteNavItem = (id: string) => {
    setNavItems(navItems.filter((i) => i.id !== id));
  };

  // ── 3. About Section State ─────────────────────────────────────────
  const [aboutText, setAboutText] = useState(settings.aboutText);
  const saveAbout = () => {
    updateSettings({ aboutText });
    triggerSaved("✓ About Festival Description Live Updated!");
  };

  // ── 4. Department State ────────────────────────────────────────────
  const [deptList, setDeptList] = useState(departments);
  const [newDeptName, setNewDeptName] = useState("");
  const [newDeptCode, setNewDeptCode] = useState("");
  const [newDeptCoordinator, setNewDeptCoordinator] = useState("");
  const [newDeptFaculty, setNewDeptFaculty] = useState("");

  const saveDepts = () => {
    updateDepartments(deptList);
    triggerSaved("✓ Department Directory Live Updated!");
  };

  const addDept = () => {
    if (!newDeptName || !newDeptCode) return;
    const item = {
      id: `dept-${Date.now()}`,
      name: newDeptName,
      code: newDeptCode.toUpperCase(),
      logoUrl: "/MARVEL/ironman.png",
      description: "Department events and competitions.",
      coordinatorName: newDeptCoordinator || "Faculty Lead",
      coordinatorPhone: "+91 94470 00000",
      facultyName: newDeptFaculty || "HOD",
      eventCount: 4,
    };
    const updated = [...deptList, item];
    setDeptList(updated);
    setNewDeptName("");
    setNewDeptCode("");
    setNewDeptCoordinator("");
    setNewDeptFaculty("");
  };

  const deleteDept = (id: string) => {
    setDeptList(deptList.filter((d) => d.id !== id));
  };

  // ── 5. Sponsors State ──────────────────────────────────────────────
  const [spList, setSpList] = useState(sponsors);
  const [spName, setSpName] = useState("");
  const [spTier, setSpTier] = useState<"Title" | "Platinum" | "Gold" | "Silver" | "Bronze">("Platinum");
  const [spLogo, setSpLogo] = useState("");
  const [spWeb, setSpWeb] = useState("");

  const saveSponsors = () => {
    updateSponsors(spList);
    triggerSaved("✓ Sponsor Partners Live Updated!");
  };

  const addSponsor = () => {
    if (!spName) return;
    const item = {
      id: `sp-${Date.now()}`,
      name: spName,
      tier: spTier,
      logoUrl: spLogo || "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=200",
      website: spWeb || "https://macfast.org",
      amount: 50000,
      active: true,
      order: spList.length,
    };
    const updated = [...spList, item];
    setSpList(updated);
    setSpName("");
    setSpLogo("");
    setSpWeb("");
  };

  const deleteSponsor = (id: string) => {
    setSpList(spList.filter((s) => s.id !== id));
  };

  // ── 6. Testimonials State ──────────────────────────────────────────
  const [testiList, setTestiList] = useState(testimonials);
  const toggleTestiApproval = (id: string) => {
    const updated = testiList.map((t) => (t.id === id ? { ...t, approved: !t.approved } : t));
    setTestiList(updated);
    updateTestimonials(updated);
    triggerSaved("✓ Testimonial Approval Status Updated!");
  };

  // ── 7. FAQs State ──────────────────────────────────────────────────
  const [faqList, setFaqList] = useState(faqs);
  const [faqCat, setFaqCat] = useState("General");
  const [faqQ, setFaqQ] = useState("");
  const [faqA, setFaqA] = useState("");

  const saveFaqs = () => {
    updateFaqs(faqList);
    triggerSaved("✓ FAQs Directory Live Updated!");
  };

  const addFaq = () => {
    if (!faqQ || !faqA) return;
    const item = {
      id: `faq-${Date.now()}`,
      category: faqCat,
      question: faqQ,
      answer: faqA,
    };
    const updated = [...faqList, item];
    setFaqList(updated);
    setFaqQ("");
    setFaqA("");
  };

  const deleteFaq = (id: string) => {
    setFaqList(faqList.filter((f) => f.id !== id));
  };

  // ── 8. Contact & Footer State ──────────────────────────────────────
  const [contactEmail, setContactEmail] = useState(settings.contactEmail);
  const [contactPhone, setContactPhone] = useState(settings.contactPhone);
  const [venueAddress, setVenueAddress] = useState(settings.venueAddress);
  const [socialInstagram, setSocialInstagram] = useState(settings.socialInstagram);
  const [socialYoutube, setSocialYoutube] = useState(settings.socialYoutube);
  const [socialLinkedin, setSocialLinkedin] = useState(settings.socialLinkedin);

  const saveContact = () => {
    updateSettings({
      contactEmail,
      contactPhone,
      venueAddress,
      socialInstagram,
      socialYoutube,
      socialLinkedin,
    });
    triggerSaved("✓ Contact & Social Media Links Live Updated!");
  };

  // ── 9. Theme State ──────────────────────────────────────────────────
  const [primaryColor, setPrimaryColor] = useState(theme.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(theme.secondaryColor);
  const [bgColor, setBgColor] = useState(theme.backgroundColor);
  const [presetTheme, setPresetTheme] = useState(theme.presetTheme);

  const saveTheme = () => {
    updateTheme({
      primaryColor,
      secondaryColor,
      backgroundColor: bgColor,
      presetTheme,
    });
    triggerSaved("✓ Theme Palette & Glassmorphism Preset Live Updated!");
  };

  // ── 10. Announcements State ────────────────────────────────────────
  const [annList, setAnnList] = useState(announcements);
  const [annTitle, setAnnTitle] = useState("");
  const [annMessage, setAnnMessage] = useState("");
  const [annType, setAnnType] = useState<"popup" | "banner" | "toast" | "alert">("banner");

  const addAnnouncement = () => {
    if (!annTitle || !annMessage) return;
    const item = {
      id: `ann-${Date.now()}`,
      title: annTitle,
      message: annMessage,
      type: annType,
      active: true,
      scheduledTime: new Date().toLocaleString(),
    };
    const updated = [...annList, item];
    setAnnList(updated);
    updateAnnouncements(updated);
    setAnnTitle("");
    setAnnMessage("");
    triggerSaved("✓ Broadcast Announcement Activated & Pushed Live!");
  };

  // ── 11. Custom Form Builder State ──────────────────────────────────
  const [fields, setFields] = useState(formFields);
  const [fieldLabel, setFieldLabel] = useState("");
  const [fieldType, setFieldType] = useState<"text" | "number" | "dropdown" | "checkbox" | "file" | "date">("text");

  const addFormField = () => {
    if (!fieldLabel) return;
    const item = {
      id: `field-${Date.now()}`,
      label: fieldLabel,
      type: fieldType,
      required: true,
    };
    const updated = [...fields, item];
    setFields(updated);
    updateFormFields(updated);
    setFieldLabel("");
    triggerSaved("✓ Registration Form Builder Field Saved!");
  };

  // ── 12. SEO State ──────────────────────────────────────────────────
  const [metaTitle, setMetaTitle] = useState(seo.metaTitle);
  const [metaDesc, setMetaDesc] = useState(seo.metaDescription);
  const [keywords, setKeywords] = useState(seo.keywords);

  const saveSeo = () => {
    updateSeo({ metaTitle, metaDescription: metaDesc, keywords });
    triggerSaved("✓ SEO Meta Tags & Open Graph Saved!");
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Module Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl bg-gradient-to-r from-black/90 via-[#0A0D1A] to-[#05050A] border-2 border-arc-cyan/30 shadow-[0_0_40px_rgba(0,212,255,0.15)]">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-arc-cyan/10 border border-arc-cyan/30 text-arc-cyan text-[10px] font-bold uppercase tracking-widest">
            <RiGlobalLine />
            <span>FULL WEBSITE CONTENT MANAGEMENT SYSTEM</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight" style={{ fontFamily: "var(--font-heading)" }}>
            Visual Content <span className="marvel-bang-comic-gradient font-black">Control Studio</span>
          </h2>
          <p className="text-xs text-white/60">
            Edit text, video backgrounds, navigation links, departments, sponsors, FAQs, themes & announcements with real-time browser sync.
          </p>
        </div>

        {statusMsg && (
          <div className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 text-xs font-bold rounded-xl animate-pulse flex items-center gap-2">
            <RiCheckDoubleLine className="text-base" />
            <span>{statusMsg}</span>
          </div>
        )}
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none gap-1">
        {[
          { id: "hero", label: "Hero & Video", icon: RiLayoutGridLine },
          { id: "navbar", label: "Navbar & Links", icon: RiNavigationLine },
          { id: "about", label: "About Page", icon: RiFileTextLine },
          { id: "departments", label: "Departments", icon: RiBuilding2Line },
          { id: "sponsors", label: "Sponsors", icon: RiMoneyDollarCircleLine },
          { id: "testimonials", label: "Testimonials", icon: RiChat1Line },
          { id: "faqs", label: "FAQs", icon: RiQuestionAnswerLine },
          { id: "contact", label: "Contact & Footer", icon: RiContactsBookLine },
          { id: "theme", label: "Theme & Palette", icon: RiPaletteLine },
          { id: "announcements", label: "Broadcast Alerts", icon: RiMegaphoneLine },
          { id: "forms", label: "Form Builder", icon: RiFileList3Line },
          { id: "seo", label: "SEO & Meta", icon: RiGlobalLine },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
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

      {/* TAB CONTENT AREAS */}
      {/* 1. HERO CMS */}
      {activeTab === "hero" && (
        <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Hero Section & Background Media Studio
            </h3>
            <button onClick={saveHero} className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_#ED1D24]">
              <RiSaveLine />
              <span>Save & Publish Hero</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <label className="block text-white/70 font-bold mb-2">Hero Line 1 (Badge Title)</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white/70 font-bold mb-2">Hero Line 2 (Festival Name)</label>
              <input
                type="text"
                value={heroName}
                onChange={(e) => setHeroName(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white/70 font-bold mb-2">Hero Line 3 (Subtitle Tag)</label>
              <input
                type="text"
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-white/70 font-bold mb-2">Hero Paragraph Description</label>
            <textarea
              rows={3}
              value={heroDesc}
              onChange={(e) => setHeroDesc(e.target.value)}
              className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none text-xs"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block text-white/70 font-bold mb-2">Background Media Type</label>
              <select
                value={bgType}
                onChange={(e) => setBgType(e.target.value as any)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              >
                <option value="image">Marvel Wallpaper Image (.jpg/.png)</option>
                <option value="video">Marvel Video Loop (.mp4)</option>
              </select>
            </div>

            <div>
              <label className="block text-white/70 font-bold mb-2">Floating Graphic Overlay</label>
              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-white">
                  <input
                    type="checkbox"
                    checked={floatingIronMan}
                    onChange={(e) => setFloatingIronMan(e.target.checked)}
                    className="accent-marvel-red w-4 h-4"
                  />
                  <span>Show Floating Iron Man HUD Graphic</span>
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div>
              <label className="block text-white/70 font-bold mb-2">Video Background URL (.mp4)</label>
              <input
                type="text"
                value={videoBgUrl}
                onChange={(e) => setVideoBgUrl(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white/70 font-bold mb-2">Wallpaper Background Image URL</label>
              <input
                type="text"
                value={wallpaperUrl}
                onChange={(e) => setWallpaperUrl(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs pt-4 border-t border-white/10">
            <div>
              <label className="block text-white/70 font-bold mb-2">Primary CTA Button Text</label>
              <input
                type="text"
                value={ctaPrimaryText}
                onChange={(e) => setCtaPrimaryText(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-white/70 font-bold mb-2">Secondary CTA Button Text</label>
              <input
                type="text"
                value={ctaSecondaryText}
                onChange={(e) => setCtaSecondaryText(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. NAVBAR CMS */}
      {activeTab === "navbar" && (
        <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Navbar Links & Glassmorphism Configuration
            </h3>
            <button onClick={saveNavbar} className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_#ED1D24]">
              <RiSaveLine />
              <span>Save Navbar</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <label className="block text-white/70 font-bold mb-2">Logo Text</label>
              <input
                type="text"
                value={logoText}
                onChange={(e) => setLogoText(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-white font-bold">
                <input
                  type="checkbox"
                  checked={stickyMode}
                  onChange={(e) => setStickyMode(e.target.checked)}
                  className="accent-marvel-red w-4 h-4"
                />
                <span>Sticky Top Navigation</span>
              </label>
            </div>

            <div className="flex items-center gap-4 pt-6">
              <label className="flex items-center gap-2 cursor-pointer text-white font-bold">
                <input
                  type="checkbox"
                  checked={glassEffect}
                  onChange={(e) => setGlassEffect(e.target.checked)}
                  className="accent-marvel-red w-4 h-4"
                />
                <span>Backdrop Glass Effect</span>
              </label>
            </div>
          </div>

          {/* Add Nav Item Form */}
          <div className="p-4 bg-black/60 border border-white/10 rounded-2xl space-y-4">
            <h4 className="text-xs font-bold text-metallic-gold uppercase tracking-wider">Add New Navigation Link</h4>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Link Label (e.g. Workshop)"
                value={newNavLabel}
                onChange={(e) => setNewNavLabel(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs flex-1"
              />
              <input
                type="text"
                placeholder="URL Path (e.g. /events)"
                value={newNavHref}
                onChange={(e) => setNewNavHref(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-xs flex-1"
              />
              <button onClick={addNavItem} className="px-5 py-2.5 bg-arc-cyan text-black font-bold text-xs rounded-xl hover:bg-white transition-colors cursor-pointer shrink-0">
                + Add Link
              </button>
            </div>
          </div>

          {/* Existing Items Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Current Active Navigation Items</h4>
            <div className="divide-y divide-white/10 border border-white/10 rounded-2xl overflow-hidden">
              {navItems.map((item) => (
                <div key={item.id} className="p-4 bg-black/40 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{item.label}</span>
                    <span className="text-white/40 ml-3 font-mono">{item.href}</span>
                  </div>
                  <button onClick={() => deleteNavItem(item.id)} className="text-marvel-red hover:text-white p-2 cursor-pointer">
                    <RiDeleteBinLine className="text-base" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. ABOUT CMS */}
      {activeTab === "about" && (
        <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              About Festival Page CMS
            </h3>
            <button onClick={saveAbout} className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_#ED1D24]">
              <RiSaveLine />
              <span>Save About Content</span>
            </button>
          </div>

          <div>
            <label className="block text-white/70 font-bold mb-2 text-xs">About Festival Narrative Text</label>
            <textarea
              rows={5}
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white text-xs focus:border-arc-cyan focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* 4. DEPARTMENTS CMS */}
      {activeTab === "departments" && (
        <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Departments & Faculty Directory
            </h3>
            <button onClick={saveDepts} className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_#ED1D24]">
              <RiSaveLine />
              <span>Save Departments</span>
            </button>
          </div>

          <div className="p-4 bg-black/60 border border-white/10 rounded-2xl space-y-4 text-xs">
            <h4 className="font-bold text-metallic-gold uppercase tracking-wider">Add Department</h4>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <input
                type="text"
                placeholder="Dept Name (e.g. Computer Applications)"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
              />
              <input
                type="text"
                placeholder="Code (e.g. MCA)"
                value={newDeptCode}
                onChange={(e) => setNewDeptCode(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
              />
              <input
                type="text"
                placeholder="Coordinator Name"
                value={newDeptCoordinator}
                onChange={(e) => setNewDeptCoordinator(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
              />
              <button onClick={addDept} className="px-5 py-2.5 bg-arc-cyan text-black font-bold rounded-xl hover:bg-white transition-colors cursor-pointer">
                + Add Dept
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {deptList.map((d) => (
              <div key={d.id} className="p-5 bg-black/40 border border-white/10 rounded-2xl space-y-2 text-xs relative">
                <button onClick={() => deleteDept(d.id)} className="absolute top-4 right-4 text-marvel-red hover:text-white cursor-pointer">
                  <RiDeleteBinLine className="text-base" />
                </button>
                <div className="font-bold text-white text-sm">{d.name} ({d.code})</div>
                <div className="text-white/60">{d.description}</div>
                <div className="text-metallic-gold font-bold">Coordinator: {d.coordinatorName} ({d.coordinatorPhone})</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SPONSORS CMS */}
      {activeTab === "sponsors" && (
        <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Sponsor Partners & Tiers
            </h3>
            <button onClick={saveSponsors} className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_#ED1D24]">
              <RiSaveLine />
              <span>Save Sponsors</span>
            </button>
          </div>

          <div className="p-4 bg-black/60 border border-white/10 rounded-2xl space-y-4 text-xs">
            <h4 className="font-bold text-metallic-gold uppercase tracking-wider">Add Sponsor</h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <input
                type="text"
                placeholder="Sponsor Name"
                value={spName}
                onChange={(e) => setSpName(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
              />
              <select
                value={spTier}
                onChange={(e) => setSpTier(e.target.value as any)}
                className="px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white"
              >
                <option value="Title">Title Partner</option>
                <option value="Platinum">Platinum Partner</option>
                <option value="Gold">Gold Partner</option>
                <option value="Silver">Silver Partner</option>
              </select>
              <input
                type="text"
                placeholder="Logo URL"
                value={spLogo}
                onChange={(e) => setSpLogo(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
              />
              <input
                type="text"
                placeholder="Website URL"
                value={spWeb}
                onChange={(e) => setSpWeb(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
              />
              <button onClick={addSponsor} className="px-5 py-2.5 bg-arc-cyan text-black font-bold rounded-xl hover:bg-white transition-colors cursor-pointer">
                + Add Partner
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {spList.map((s) => (
              <div key={s.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-2 text-xs relative">
                <button onClick={() => deleteSponsor(s.id)} className="absolute top-3 right-3 text-marvel-red hover:text-white cursor-pointer">
                  <RiDeleteBinLine className="text-base" />
                </button>
                <div className="font-bold text-white">{s.name}</div>
                <div className="px-2.5 py-0.5 rounded bg-metallic-gold/15 text-metallic-gold font-bold inline-block text-[10px] uppercase">
                  {s.tier}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. FAQS CMS */}
      {activeTab === "faqs" && (
        <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              FAQ Manager
            </h3>
            <button onClick={saveFaqs} className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_#ED1D24]">
              <RiSaveLine />
              <span>Save FAQs</span>
            </button>
          </div>

          <div className="p-4 bg-black/60 border border-white/10 rounded-2xl space-y-3 text-xs">
            <h4 className="font-bold text-metallic-gold uppercase tracking-wider">Add FAQ</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Category (e.g. Hospitality)"
                value={faqCat}
                onChange={(e) => setFaqCat(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
              />
              <input
                type="text"
                placeholder="Question"
                value={faqQ}
                onChange={(e) => setFaqQ(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white md:col-span-2"
              />
            </div>
            <textarea
              rows={2}
              placeholder="Answer detail..."
              value={faqA}
              onChange={(e) => setFaqA(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
            />
            <button onClick={addFaq} className="px-5 py-2.5 bg-arc-cyan text-black font-bold rounded-xl hover:bg-white transition-colors cursor-pointer">
              + Add FAQ Question
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {faqList.map((f) => (
              <div key={f.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-1 relative">
                <button onClick={() => deleteFaq(f.id)} className="absolute top-4 right-4 text-marvel-red hover:text-white cursor-pointer">
                  <RiDeleteBinLine className="text-base" />
                </button>
                <span className="text-[10px] font-bold text-arc-cyan uppercase tracking-widest">{f.category}</span>
                <div className="font-bold text-white text-sm">{f.question}</div>
                <div className="text-white/60 leading-relaxed">{f.answer}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. CONTACT & FOOTER CMS */}
      {activeTab === "contact" && (
        <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Contact Details & Social Media Links
            </h3>
            <button onClick={saveContact} className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_#ED1D24]">
              <RiSaveLine />
              <span>Save Contact Details</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <label className="block text-white/70 font-bold mb-2">Helpdesk Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/70 font-bold mb-2">Helpdesk Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/70 font-bold mb-2">Venue Address</label>
              <input
                type="text"
                value={venueAddress}
                onChange={(e) => setVenueAddress(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs pt-4 border-t border-white/10">
            <div>
              <label className="block text-white/70 font-bold mb-2">Instagram URL</label>
              <input
                type="text"
                value={socialInstagram}
                onChange={(e) => setSocialInstagram(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/70 font-bold mb-2">YouTube Channel URL</label>
              <input
                type="text"
                value={socialYoutube}
                onChange={(e) => setSocialYoutube(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/70 font-bold mb-2">LinkedIn Page URL</label>
              <input
                type="text"
                value={socialLinkedin}
                onChange={(e) => setSocialLinkedin(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* 8. THEME & PALETTE CMS */}
      {activeTab === "theme" && (
        <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Theme Studio & Preset Palettes
            </h3>
            <button onClick={saveTheme} className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_#ED1D24]">
              <RiSaveLine />
              <span>Save Theme</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div>
              <label className="block text-white/70 font-bold mb-2">Primary Accent Color</label>
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-full h-12 bg-black border border-white/10 rounded-xl cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-white/70 font-bold mb-2">Secondary Neon Color</label>
              <input
                type="color"
                value={secondaryColor}
                onChange={(e) => setSecondaryColor(e.target.value)}
                className="w-full h-12 bg-black border border-white/10 rounded-xl cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-white/70 font-bold mb-2">Base Canvas Background</label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-full h-12 bg-black border border-white/10 rounded-xl cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 9. ANNOUNCEMENTS CMS */}
      {activeTab === "announcements" && (
        <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Emergency Broadcasts & Popups
            </h3>
          </div>

          <div className="p-4 bg-black/60 border border-white/10 rounded-2xl space-y-3 text-xs">
            <h4 className="font-bold text-metallic-gold uppercase tracking-wider">Broadcast New Alert</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Alert Headline"
                value={annTitle}
                onChange={(e) => setAnnTitle(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
              />
              <select
                value={annType}
                onChange={(e) => setAnnType(e.target.value as any)}
                className="px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white"
              >
                <option value="banner">Header Banner</option>
                <option value="popup">Modal Popup</option>
                <option value="toast">Toast Alert</option>
                <option value="alert">Emergency High-Priority</option>
              </select>
            </div>
            <textarea
              rows={2}
              placeholder="Broadcast message text..."
              value={annMessage}
              onChange={(e) => setAnnMessage(e.target.value)}
              className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
            />
            <button onClick={addAnnouncement} className="px-5 py-2.5 bg-marvel-red text-white font-bold rounded-xl hover:bg-white hover:text-black transition-colors cursor-pointer shadow-[0_0_15px_#ED1D24]">
              Broadcast Emergency Alert
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {annList.map((a) => (
              <div key={a.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl space-y-1">
                <span className="px-2.5 py-0.5 rounded bg-marvel-red/20 text-marvel-red text-[9px] font-bold uppercase tracking-widest">
                  {a.type}
                </span>
                <div className="font-bold text-white text-sm">{a.title}</div>
                <div className="text-white/70">{a.message}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. FORMS BUILDER CMS */}
      {activeTab === "forms" && (
        <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              Registration Form Field Builder
            </h3>
          </div>

          <div className="p-4 bg-black/60 border border-white/10 rounded-2xl space-y-3 text-xs">
            <h4 className="font-bold text-metallic-gold uppercase tracking-wider">Add Custom Field to Registration</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Field Label (e.g. T-Shirt Size)"
                value={fieldLabel}
                onChange={(e) => setFieldLabel(e.target.value)}
                className="px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white"
              />
              <select
                value={fieldType}
                onChange={(e) => setFieldType(e.target.value as any)}
                className="px-4 py-2.5 bg-black border border-white/10 rounded-xl text-white"
              >
                <option value="text">Text Input</option>
                <option value="number">Number Input</option>
                <option value="dropdown">Dropdown Select</option>
                <option value="file">File Upload</option>
                <option value="date">Date Picker</option>
              </select>
              <button onClick={addFormField} className="px-5 py-2.5 bg-arc-cyan text-black font-bold rounded-xl hover:bg-white transition-colors cursor-pointer">
                + Add Form Field
              </button>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            {fields.map((f) => (
              <div key={f.id} className="p-4 bg-black/40 border border-white/10 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="font-bold text-white">{f.label}</span>
                  <span className="text-arc-cyan ml-3 text-[10px] uppercase font-bold">({f.type})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 11. SEO & META CMS */}
      {activeTab === "seo" && (
        <div className="marvel-card p-6 md:p-8 rounded-3xl border border-arc-cyan/30 bg-[#0A0D1A] space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-lg font-bold text-white uppercase tracking-wider" style={{ fontFamily: "var(--font-heading)" }}>
              SEO & Social Open Graph Tags
            </h3>
            <button onClick={saveSeo} className="btn-primary py-2.5 px-6 text-xs flex items-center gap-2 cursor-pointer shadow-[0_0_15px_#ED1D24]">
              <RiSaveLine />
              <span>Save Meta Tags</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-white/70 font-bold mb-2">Meta Title</label>
              <input
                type="text"
                value={metaTitle}
                onChange={(e) => setMetaTitle(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/70 font-bold mb-2">Meta Description</label>
              <textarea
                rows={3}
                value={metaDesc}
                onChange={(e) => setMetaDesc(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-white/70 font-bold mb-2">SEO Keywords (Comma Separated)</label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white focus:border-arc-cyan focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
