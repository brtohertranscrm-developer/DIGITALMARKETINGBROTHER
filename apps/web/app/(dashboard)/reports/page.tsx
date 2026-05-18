import { format } from "date-fns";
import { id } from "date-fns/locale";
import { db } from "@brothers-trans/database";

function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

function formatCurrency(value: unknown) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function engagementRate(metric: { likes: number; comments: number; shares: number; saves: number; reach: number }) {
  if (!metric.reach) {
    return "0%";
  }

  const engagement = metric.likes + metric.comments + metric.shares + metric.saves;
  return `${((engagement / metric.reach) * 100).toFixed(1)}%`;
}

export default async function ReportsPage() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const [contentCount, publishedCount, leads, metrics, socialAccounts, topContents, campaigns] = await Promise.all([
    db.contentItem.count({ where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }),
    db.contentItem.count({ where: { status: "PUBLISHED", publishedAt: { gte: startOfMonth, lte: endOfMonth } } }),
    db.lead.findMany({
      where: { createdAt: { gte: startOfMonth, lte: endOfMonth } },
      include: { campaign: true },
      orderBy: { createdAt: "desc" },
    }),
    db.contentMetric.aggregate({
      where: { measuredAt: { gte: startOfMonth, lte: endOfMonth } },
      _sum: { reach: true, impressions: true, views: true, likes: true, comments: true, shares: true, saves: true, clicks: true },
    }),
    db.socialAccount.findMany({
      include: {
        contentItems: {
          where: { publishedAt: { gte: startOfMonth, lte: endOfMonth } },
          include: { metrics: { where: { measuredAt: { gte: startOfMonth, lte: endOfMonth } } } },
        },
      },
      orderBy: [{ platform: "asc" }, { name: "asc" }],
    }),
    db.contentItem.findMany({
      where: { publishedAt: { gte: startOfMonth, lte: endOfMonth }, metrics: { some: {} } },
      include: { socialAccount: true, metrics: { orderBy: { measuredAt: "desc" }, take: 1 } },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
    db.campaign.findMany({
      include: { leads: { where: { createdAt: { gte: startOfMonth, lte: endOfMonth } } }, _count: { select: { contentItems: true } } },
      orderBy: { startDate: "desc" },
      take: 5,
    }),
  ]);

  const totalLeadValue = leads.reduce((sum, lead) => sum + Number(lead.value ?? 0), 0);
  const bookedLeads = leads.filter((lead) => lead.status === "BOOKED").length;
  const totalReach = metrics._sum.reach ?? 0;
  const totalEngagement = (metrics._sum.likes ?? 0) + (metrics._sum.comments ?? 0) + (metrics._sum.shares ?? 0) + (metrics._sum.saves ?? 0);
  const overallEngagementRate = totalReach ? `${((totalEngagement / totalReach) * 100).toFixed(1)}%` : "0%";

  const channelSummaries = socialAccounts.map((account) => {
    const accountMetrics = account.contentItems.flatMap((item) => item.metrics);
    const reach = accountMetrics.reduce((sum, metric) => sum + metric.reach, 0);
    const clicks = accountMetrics.reduce((sum, metric) => sum + metric.clicks, 0);
    const engagement = accountMetrics.reduce((sum, metric) => sum + metric.likes + metric.comments + metric.shares + metric.saves, 0);

    return {
      id: account.id,
      label: `${account.platform} · ${account.handle}`,
      published: account.contentItems.length,
      reach,
      clicks,
      engagementRate: reach ? `${((engagement / reach) * 100).toFixed(1)}%` : "0%",
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-brand-600">Reports</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">Monthly Reporting</h2>
          <p className="mt-2 text-slate-500">Ringkasan otomatis periode {format(startOfMonth, "dd MMM", { locale: id })} - {format(endOfMonth, "dd MMM yyyy", { locale: id })}.</p>
        </div>
        <a href="/api/reports/monthly" className="inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-500">Export CSV</a>
      </div>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Konten Dibuat</p><p className="mt-2 text-3xl font-bold text-slate-950">{formatNumber(contentCount)}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Konten Published</p><p className="mt-2 text-3xl font-bold text-slate-950">{formatNumber(publishedCount)}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Engagement Rate</p><p className="mt-2 text-3xl font-bold text-slate-950">{overallEngagementRate}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Lead Value</p><p className="mt-2 text-3xl font-bold text-slate-950">{formatCurrency(totalLeadValue)}</p></div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Channel Summary</h3>
          <div className="mt-5 space-y-3">
            {channelSummaries.length === 0 ? <p className="text-sm text-slate-500">Belum ada channel.</p> : channelSummaries.map((channel) => (
              <div key={channel.id} className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm md:grid-cols-5">
                <p className="font-medium text-slate-950 md:col-span-2">{channel.label}</p>
                <p className="text-slate-600">{channel.published} konten</p>
                <p className="text-slate-600">{formatNumber(channel.reach)} reach</p>
                <p className="text-slate-600">ER {channel.engagementRate}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Lead Summary</h3>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Total Leads</p><p className="mt-1 text-2xl font-bold text-slate-950">{leads.length}</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Booked</p><p className="mt-1 text-2xl font-bold text-slate-950">{bookedLeads}</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Klik</p><p className="mt-1 text-2xl font-bold text-slate-950">{formatNumber(metrics._sum.clicks ?? 0)}</p></div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Top Content</h3>
          <div className="mt-5 space-y-4">
            {topContents.length === 0 ? <p className="text-sm text-slate-500">Belum ada konten published bulan ini.</p> : topContents.map((content) => {
              const latestMetric = content.metrics[0];
              return (
                <div key={content.id} className="rounded-xl border border-slate-100 p-4">
                  <p className="font-medium text-slate-950">{content.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{content.socialAccount?.platform ?? "No platform"} · Reach {formatNumber(latestMetric?.reach ?? 0)} · ER {latestMetric ? engagementRate(latestMetric) : "0%"}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Campaign Snapshot</h3>
          <div className="mt-5 space-y-4">
            {campaigns.length === 0 ? <p className="text-sm text-slate-500">Belum ada campaign.</p> : campaigns.map((campaign) => {
              const value = campaign.leads.reduce((sum, lead) => sum + Number(lead.value ?? 0), 0);
              return (
                <div key={campaign.id} className="rounded-xl border border-slate-100 p-4">
                  <p className="font-medium text-slate-950">{campaign.name}</p>
                  <p className="mt-1 text-sm text-slate-500">{campaign.leads.length} leads · {campaign._count.contentItems} konten · {formatCurrency(value)}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
