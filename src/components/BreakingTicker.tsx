"use client";
import { NewsItem } from "@/lib/data";

export default function BreakingTicker({ news }: { news: NewsItem[] }) {
  const breaking = news.filter((n) => n.isBreaking).slice(0, 5);
  if (breaking.length === 0) return null;
  return (
    <div className="bg-breaking text-white overflow-hidden relative h-10 flex items-center">
      <div className="bg-white text-breaking font-black px-4 h-full flex items-center gap-2 shrink-0 z-10 shadow-lg">
        <span className="w-2 h-2 bg-breaking rounded-full pulse-breaking inline-block" />
        عاجل
      </div>
      <div className="flex-1 overflow-hidden relative">
        <div className="animate-marquee whitespace-nowrap flex gap-12 py-2 absolute inset-0 items-center">
          {[...breaking, ...breaking].map((n, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-bold">
              <span className="w-1.5 h-1.5 bg-white rounded-full opacity-70" />
              {n.title}
              <span className="opacity-60 text-xs">— {n.source}</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
