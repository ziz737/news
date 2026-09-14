"use client";
import { useEffect, useState, useMemo } from "react";
import { mockNews, NewsItem, timeAgo } from "@/lib/data";
import BreakingTicker from "@/components/BreakingTicker";
import NewsCard from "@/components/NewsCard";
import Link from "next/link";

const TABS = ["الكل", "عاجل", "حروب", "سياسة", "تحليلات"] as const;

export default function Home() {
  const [news, setNews] = useState<NewsItem[]>(mockNews);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("الكل");
  const [search, setSearch] = useState("");
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toISOString());
  const [autoUpdating, setAutoUpdating] = useState(true);
  const [secondsAgo, setSecondsAgo] = useState(0);

  // جلب تلقائي من API كل 60 ثانية (أفضل طريقة للتحديث التلقائي)
  const fetchNews = async () => {
    try {
      const res = await fetch("/api/news", { cache: "no-store" });
      const data = await res.json();
      if (data.news && data.news.length) {
        setNews(data.news);
        setLastUpdate(data.updatedAt);
        setSecondsAgo(0);
      }
    } catch {}
  };

  useEffect(() => {
    fetchNews();
    if (!autoUpdating) return;
    const interval = setInterval(fetchNews, 60 * 1000); // كل دقيقة
    const secInterval = setInterval(() => setSecondsAgo((s) => s + 1), 1000);
    return () => {
      clearInterval(interval);
      clearInterval(secInterval);
    };
  }, [autoUpdating]);

  const filtered = useMemo(() => {
    let r = news;
    if (activeTab !== "الكل") r = r.filter((n) => n.category === activeTab || (activeTab === "عاجل" && n.isBreaking));
    if (search.trim()) {
      const q = search.toLowerCase();
      r = r.filter((n) => n.title.toLowerCase().includes(q) || n.summary.toLowerCase().includes(q));
    }
    return r;
  }, [news, activeTab, search]);

  const featured = filtered[0];

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      {/* Header */}
      <header className="bg-navy-800 text-white sticky top-0 z-40 shadow-xl">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="flex items-center justify-between h-[64px] gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center font-black text-navy-900 text-lg shadow-lg">
                ع
              </div>
              <div>
                <h1 className="font-black text-[18px] leading-none tracking-tight">
                  المنصة الإخبارية <span className="text-gold-400">العاجلة</span>
                </h1>
                <p className="text-[11px] text-white/60 font-medium tracking-widest">BREAKING NEWS PLATFORM • تحديث لحظي</p>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 text-xs bg-white/10 rounded-full px-3 py-1.5 border border-white/10">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                مباشر
                <span className="opacity-60">•</span>
                آخر تحديث منذ {secondsAgo < 60 ? `${secondsAgo} ث` : `${Math.floor(secondsAgo / 60)} د`}
              </div>
              <div className="relative">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="ابحث في الأخبار..."
                  className="bg-white/10 border border-white/15 rounded-full pr-9 pl-4 py-2 text-sm placeholder:text-white/50 focus:outline-none focus:bg-white focus:text-navy-800 focus:placeholder:text-gray-400 w-[220px] transition-all"
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <button
                onClick={() => {
                  fetchNews();
                  setSecondsAgo(0);
                }}
                className="gold-gradient text-navy-900 font-black text-sm px-4 py-2 rounded-full hover:brightness-110 transition flex items-center gap-1.5 shadow-md"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.7 1 6.3 2.7L21 8V3h-5l2.7 2.7A7 7 0 1 0 21 12z"/></svg>
                تحديث الآن
              </button>
            </div>

            {/* موبايل */}
            <div className="flex md:hidden items-center gap-2">
              <button onClick={() => { fetchNews(); setSecondsAgo(0); }} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center border border-white/10">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9c2.5 0 4.7 1 6.3 2.7L21 8V3h-5l2.7 2.7A7 7 0 1 0 21 12z"/></svg>
              </button>
            </div>
          </div>
        </div>

        <BreakingTicker news={news} />

        {/* Tabs */}
        <div className="bg-navy-700 border-t border-white/10">
          <div className="max-w-[1280px] mx-auto px-4">
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-2.5">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-black transition-all border ${
                    activeTab === tab
                      ? "bg-gold-500 text-navy-900 border-gold-400 shadow-lg shadow-gold-500/20"
                      : "bg-white/10 text-white/80 border-white/10 hover:bg-white hover:text-navy-800"
                  }`}
                >
                  {tab === "عاجل" ? "🔴 عاجل" : tab}
                </button>
              ))}
              <div className="mr-auto hidden sm:flex items-center gap-2 text-xs text-white/50">
                <span>{filtered.length} خبر</span>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input type="checkbox" checked={autoUpdating} onChange={(e) => setAutoUpdating(e.target.checked)} className="accent-gold-500" />
                  تحديث تلقائي
                </label>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* موبايل: بحث */}
      <div className="md:hidden bg-white border-b px-4 py-3 flex gap-2 sticky top-[64px] z-30">
        <div className="flex-1 relative">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث: غزة، أوكرانيا، سياسة..."
            className="w-full bg-gray-50 border border-gray-200 rounded-full pr-9 pl-4 py-2.5 text-sm focus:outline-none focus:border-gold-500 focus:bg-white"
          />
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        </div>
        <div className="text-[11px] bg-navy-800 text-white rounded-full px-3 py-2 font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          {secondsAgo}ث
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-4 py-6">
        {/* Featured Hero */}
        {featured && activeTab === "الكل" && !search && (
          <Link href={`/news/${featured.id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100 mb-8">
            <div className="grid md:grid-cols-[1.4fr_1fr] gap-0">
              <div className="relative h-[300px] md:h-[380px] overflow-hidden bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={featured.image} alt={featured.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 to-transparent md:hidden" />
                <span className="absolute top-4 right-4 bg-breaking text-white text-xs font-black px-3 py-1.5 rounded-full pulse-breaking flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                  خبر رئيسي • {featured.category}
                </span>
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-xs mb-3">
                  <span className="bg-gold-500 text-navy-900 font-black px-3 py-1 rounded-full">{featured.source}</span>
                  <span className="text-gray-400">{timeAgo(featured.publishedAt)}</span>
                </div>
                <h2 className="font-black text-[22px] md:text-[26px] leading-8 text-navy-800 group-hover:text-navy-600 transition-colors">
                  {featured.title}
                </h2>
                <p className="text-gray-500 mt-3 leading-6 line-clamp-3">{featured.content.slice(0, 220)}...</p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm font-black text-gold-600">
                  اقرأ التفاصيل كاملة
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </span>
              </div>
            </div>
          </Link>
        )}

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <p className="font-black text-navy-800">لا توجد أخبار مطابقة للبحث</p>
            <p className="text-sm text-gray-400 mt-1">جرب كلمة أخرى أو اختر تبويباً آخر</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(activeTab === "الكل" && !search ? filtered.slice(1) : filtered).map((item) => (
              <NewsCard key={item.id} item={item} />
            ))}
          </div>
        )}

        {/* Info bar */}
        <div className="mt-8 bg-navy-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white overflow-hidden relative">
          <div className="absolute inset-0 opacity-10" style={{background: "radial-gradient(600px at 0% 0%, #D4AF37, transparent)"}} />
          <div className="relative">
            <p className="font-black">نظام التحديث التلقائي يعمل الآن ⚡</p>
            <p className="text-sm text-white/60 mt-1">يتم جلب الأخبار كل 60 ثانية تلقائياً من NewsAPI + GNews + RSS • بدون تدخل منك • {new Date(lastUpdate).toLocaleTimeString("ar-EG")}</p>
          </div>
          <div className="relative flex gap-2 shrink-0">
            <span className="bg-white/10 border border-white/10 rounded-full px-3 py-1.5 text-xs font-bold">ISR + Cron</span>
            <span className="gold-gradient text-navy-900 rounded-full px-3 py-1.5 text-xs font-black">Live</span>
          </div>
        </div>
      </main>

      <footer className="mt-10 bg-navy-900 text-white border-t border-gold-500/20">
        <div className="max-w-[1280px] mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <h3 className="font-black text-lg">المنصة الإخبارية <span className="text-gold-400">العاجلة</span></h3>
              <p className="text-sm text-white/50 mt-2 max-w-[420px] leading-6">منصة متخصصة في رصد الأخبار السياسية والحروب لحظة بلحظة. نعتمد على الجلب التلقائي من وكالات موثوقة مع تحديث لحظي دون تدخل بشري. الدقة والمصداقية أولاً.</p>
            </div>
            <div className="text-sm text-white/60 space-y-1">
              <p>© 2026 المنصة الإخبارية العاجلة - جميع الحقوق محفوظة</p>
              <p>الثيم: كحلي ملكي #0A1931 + ذهبي #D4AF37 • مصمم للجوال أولاً</p>
              <p className="text-gold-400 font-bold">تحديث تلقائي كل 60 ثانية • PWA جاهز</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
