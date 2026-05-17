import { CalendarCheck, MessageCircle, MousePointerClick, TrendingUp } from "lucide-react";
import { db } from "@brothers-trans/database";
import { StatCard } from "@/components/stat-card";

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID", { notation: value >= 10000 ? "compact" : "standard" }).format(value);
}

export default async function DashboardPage() {
  const [contentCount, leadCount, bookingCount, metrics, topContents] = await Promise.all([
    db.contentItem.count({ where: { status: "PUBLISHED" } }),
    db.lead.count(),
    db.lead.count({ where: { status: "BOOKED" } }),
    db.contentMetric.aggregate({
      _sum: {
        reach: true,
        clicks: true,
        views: true,
      },
    }),
    db.contentItem.findMany({
      where: { metrics: { some: {} } },
      include: { metrics: true, socialAccount: true },
      take: 3,
      orderBy: { updatedAt: "desc" },
    }),
  ]);

  const totalReach = metrics._sum.reach ?? 0;
  const totalClicks = metrics._sum.clicks ?? 0;
  const totalViews = metrics._sum.views ?? 0;

  return (
    <div className="space-y-8">
      <section className="flex flex-col justify-between gap-4 rounded-3xl bg-brand-950 p-8 text-white lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-blue-200">Dashboard Marketing Brothers Trans</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight lg:text-4xl">Pantau performa sosial media, konten, campaign, dan lead dalam satu tempat.</h2>
        </div>
        <div className="rounded-2xl bg-white/10 px-5 py-4">
          <p className="text-sm text-blue-100">Periode</p>
          <p className="text-lg font-semibold">Bulan Ini</p>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Reach" value={formatNumber(totalReach)} change="live" icon={TrendingUp} />
        <StatCard title="Klik WhatsApp" value={formatNumber(totalClicks)} change="tracked" icon={MessageCircle} />
        <StatCard title="Leads Masuk" value={formatNumber(leadCount)} change="CRM" icon={MousePointerClick} />
        <StatCard title="Konten Published" value={formatNumber(contentCount)} change="team" icon={CalendarCheck} />
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Funnel Marketing</h3>
              <p className="text-sm text-slate-500">View → klik WhatsApp → lead → booking</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3 md:grid-cols-4">
            {[`${formatNumber(totalViews)} Views`, `${formatNumber(totalClicks)} Clicks`, `${formatNumber(leadCount)} Leads`, `${formatNumber(bookingCount)} Booking`].map((item) => (
              <div key={item} className="rounded-2xl bg-slate-50 p-5 text-center">
                <p className="font-semibold text-slate-950">{item}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Top Content</h3>
          <div className="mt-5 space-y-4">
            {topContents.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada metrik konten.</p>
            ) : (
              topContents.map((content) => {
                const latestMetric = content.metrics.at(-1);
                return (
                  <div key={content.id} className="rounded-xl border border-slate-100 p-4">
                    <p className="font-medium text-slate-950">{content.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{content.socialAccount?.platform ?? "Platform"} · {formatNumber(latestMetric?.views ?? 0)} views · {formatNumber(latestMetric?.clicks ?? 0)} clicks</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
