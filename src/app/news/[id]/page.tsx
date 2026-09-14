import { mockNews } from "@/lib/data";
import Link from "next/link";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return mockNews.map((n) => ({ id: n.id }));
}

export default function NewsDetails({ params }: { params: { id: string } }) {
  const item = mockNews.find((n) => n.id === params.id);
  if (!item) notFound();

  const related = mockNews.filter((n) => n.category === item.category && n.id !== item.id).slice(0, 3);

  const shareUrl = `https://almanasa.example/news/${item.id}`;
  const shareText = encodeURIComponent(item.title);

  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-navy-800 text-white sticky top-0 z-40">
        <div className="max-w-[900px] mx-auto px-4 h-[56px] flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-black">
            <span className="w-8 h-8 rounded-lg gold-gradient text-navy-900 flex items-center justify-center">ع</span>
            المنصة الإخبارية <span className="text-gold-400">العاجلة</span>
          </Link>
          <Link href="/" className="bg-white text-navy-800 text-sm font-black px-4 py-2 rounded-full hover:bg-gold-400 transition">
            ← العودة
          </Link>
        </div>
      </header>

      <article className="max-w-[900px] mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="relative h-[320px] md:h-[460px] bg-gray-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
            <span className="absolute top-4 right-4 bg-gold-500 text-navy-900 text-xs font-black px-3 py-1.5 rounded-full">
              {item.category}
            </span>
            {item.isBreaking && (
              <span className="absolute top-4 left-4 bg-breaking text-white text-xs font-black px-3 py-1.5 rounded-full pulse-breaking">
                🔴 عاجل
              </span>
            )}
          </div>

          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 text-xs mb-4">
              <span className="bg-navy-800 text-gold-400 font-black px-3 py-1 rounded-full border border-gold-500/30">{item.source}</span>
              <span className="text-gray-400">{new Date(item.publishedAt).toLocaleString("ar-EG", { dateStyle: "full", timeStyle: "short" })}</span>
            </div>

            <h1 className="font-black text-[24px] md:text-[30px] leading-9 text-navy-800">{item.title}</h1>

            <div className="flex flex-wrap gap-2 mt-5">
              <a href={`https://wa.me/?text=${shareText}%20${encodeURIComponent(shareUrl)}`} target="_blank" className="bg-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-full">مشاركة واتساب</a>
              <a href={`https://twitter.com/intent/tweet?text=${shareText}&url=${encodeURIComponent(shareUrl)}`} target="_blank" className="bg-sky-500 text-white text-sm font-bold px-4 py-2 rounded-full">مشاركة X</a>
              <a href={shareUrl} className="bg-gray-100 text-navy-800 text-sm font-bold px-4 py-2 rounded-full border">نسخ الرابط</a>
            </div>

            <div className="prose prose-lg max-w-none mt-8 text-gray-700 leading-8 whitespace-pre-line">
              {item.content}
            </div>

            {item.gallery && (
              <div className="mt-8">
                <h3 className="font-black text-navy-800 mb-3">معرض الصور</h3>
                <div className="grid grid-cols-2 gap-3">
                  {item.gallery.map((g, i) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={i} src={g} alt="" className="rounded-xl h-48 w-full object-cover border" />
                  ))}
                </div>
              </div>
            )}

            {item.video && (
              <div className="mt-8">
                <h3 className="font-black text-navy-800 mb-3">فيديو الخبر</h3>
                <div className="aspect-video rounded-xl overflow-hidden border bg-black">
                  <iframe src={item.video} className="w-full h-full" allowFullScreen title="video" />
                </div>
              </div>
            )}
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-8">
            <h3 className="font-black text-navy-800 text-lg mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-gold-500 rounded-full" />
              أخبار ذات صلة
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              {related.map((r) => (
                <Link key={r.id} href={`/news/${r.id}`} className="bg-white rounded-xl overflow-hidden border shadow-sm hover:shadow-md transition">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={r.image} alt={r.title} className="h-36 w-full object-cover" />
                  <div className="p-3">
                    <p className="font-bold text-sm leading-5 line-clamp-2 text-navy-800">{r.title}</p>
                    <p className="text-xs text-gray-400 mt-2">{r.source} • {new Date(r.publishedAt).toLocaleDateString("ar-EG")}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>

      <footer className="mt-10 bg-navy-900 text-white text-center py-6 text-sm text-white/60">
        © 2026 المنصة الإخبارية العاجلة • كحلي #0A1931 + ذهبي #D4AF37
      </footer>
    </div>
  );
}
