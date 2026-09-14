"use client";
import Link from "next/link";
import { NewsItem, timeAgo } from "@/lib/data";

export default function NewsCard({ item }: { item: NewsItem }) {
  const categoryColor =
    item.category === "عاجل"
      ? "bg-breaking text-white pulse-breaking"
      : item.category === "حروب"
      ? "bg-navy-800 text-gold-400 border border-gold-500/30"
      : item.category === "سياسة"
      ? "bg-gold-500 text-navy-900"
      : "bg-white text-navy-800 border";

  return (
    <Link
      href={`/news/${item.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col card-hover"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900/70 via-navy-900/10 to-transparent" />
        <span
          className={`absolute top-3 right-3 text-xs font-black px-3 py-1.5 rounded-full ${categoryColor}`}
        >
          {item.category}
        </span>
        {item.isBreaking && item.category !== "عاجل" && (
          <span className="absolute top-3 left-3 bg-breaking text-white text-[10px] font-black px-2 py-1 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            عاجل
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-black text-[17px] leading-6 text-navy-800 line-clamp-2 group-hover:text-navy-600 transition-colors">
          {item.title}
        </h3>
        <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-5">
          {item.summary}
        </p>
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-50">
          <span className="text-xs font-bold text-gold-600 bg-gold-500/10 px-2 py-1 rounded-full">
            {item.source}
          </span>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            {timeAgo(item.publishedAt)}
          </span>
        </div>
      </div>
    </Link>
  );
}
