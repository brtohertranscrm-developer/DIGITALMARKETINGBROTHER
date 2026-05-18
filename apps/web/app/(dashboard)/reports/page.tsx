import { format } from "date-fns";
import { id } from "date-fns/locale";
import { db } from "@brothers-trans/database";
import { engagementRate, formatCurrency, formatNumber, isArticleContent, matchesContentGroup, normalizeContentGroup, reportDateRange } from "@/lib/reporting";
import { ReportFilters } from "./report-filters";

interface ReportsPageProps {
  searchParams: Promise<{ month?: string; group?: string }>;
}

function sumMetrics(metrics: Array<{ reach: number; impressions: number; views: number; likes: number; comments: number; shares: number; saves: number; clicks: number }>) {
  return metrics.reduce(
    (total, metric) => ({
      reach: total.reach + metric.reach,
      impressions: total.impressions + metric.impressions,
      views: total.views + metric.views,
      likes: total.likes + metric.likes,
      comments: total.comments + metric.comments,
      shares: total.shares + metric.shares,
      saves: total.saves + metric.saves,
      clicks: total.clicks + metric.clicks,
    }),
    { reach: 0, impressions: 0, views: 0, likes: 0, comments: 0, shares: 0, saves: 0, clicks: 0 },
  );
}

export default async function ReportsPage({ searchParams }: ReportsPageProps) {
  const params = await searchParams;
  const group = normalizeContentGroup(params.group);
  const { start, end, value: monthValue } = reportDateRange(params.month);

  const [contentItems, leads, socialAccounts, campaigns, users] = await Promise.all([
    db.contentItem.findMany({
      where: {
        OR: [{ publishedAt: { gte: start, lte: end } }, { createdAt: { gte: start, lte: end } }],
      },
      include: {
        campaign: true,
        socialAccount: true,
        assignee: true,
        creator: true,
        metrics: { where: { measuredAt: { gte: start, lte: end } }, orderBy: { measuredAt: "desc" } },
      },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    }),
    db.lead.findMany({
      where: { createdAt: { gte: start, lte: end } },
      include: { campaign: true },
      orderBy: { createdAt: "desc" },
    }),
    db.socialAccount.findMany({ orderBy: [{ platform: "asc" }, { name: "asc" }] }),
    db.campaign.findMany({ include: { leads: { where: { createdAt: { gte: start, lte: end } } }, _count: { select: { contentItems: true } } }, orderBy: { startDate: "desc" } }),
    db.user.findMany({ orderBy: [{ role: "asc" }, { name: "asc" }] }),
  ]);

  const filteredContent = contentItems.filter((item) => matchesContentGroup(item.contentType, group));
  const publishedContent = filteredContent.filter((item) => item.status === "PUBLISHED");
  const articleContent = filteredContent.filter((item) => isArticleContent(item.contentType));
  const socialContent = filteredContent.filter((item) => !isArticleContent(item.contentType));
  const allMetrics = filteredContent.flatMap((item) => item.metrics);
  const totals = sumMetrics(allMetrics);
  const totalEngagement = totals.likes + totals.comments + totals.shares + totals.saves;
  const overallEngagementRate = totals.reach ? `${((totalEngagement / totals.reach) * 100).toFixed(1)}%` : "0%";
  const totalLeadValue = leads.reduce((sum, lead) => sum + Number(lead.value ?? 0), 0);
  const bookedLeads = leads.filter((lead) => lead.status === "BOOKED").length;

  const channelSummaries = socialAccounts.map((account) => {
    const accountContent = filteredContent.filter((item) => item.socialAccountId === account.id);
    const accountMetrics = sumMetrics(accountContent.flatMap((item) => item.metrics));
    const accountEngagement = accountMetrics.likes + accountMetrics.comments + accountMetrics.shares + accountMetrics.saves;

    return {
      id: account.id,
      label: `${account.platform} · ${account.handle}`,
      published: accountContent.filter((item) => item.status === "PUBLISHED").length,
      planned: accountContent.length,
      reach: accountMetrics.reach,
      views: accountMetrics.views,
      clicks: accountMetrics.clicks,
      engagementRate: accountMetrics.reach ? `${((accountEngagement / accountMetrics.reach) * 100).toFixed(1)}%` : "0%",
    };
  }).filter((channel) => channel.planned > 0 || channel.reach > 0);

  const writerSummaries = users.map((user) => {
    const assigned = filteredContent.filter((item) => item.assigneeId === user.id || item.creatorId === user.id);
    const articleAssigned = assigned.filter((item) => isArticleContent(item.contentType));
    const metrics = sumMetrics(assigned.flatMap((item) => item.metrics));

    return {
      id: user.id,
      name: user.name ?? user.email,
      role: user.role.replaceAll("_", " "),
      assigned: assigned.length,
      published: assigned.filter((item) => item.status === "PUBLISHED").length,
      articles: articleAssigned.length,
      clicks: metrics.clicks,
      reach: metrics.reach,
    };
  }).filter((writer) => writer.assigned > 0);

  const topContents = [...filteredContent]
    .filter((item) => item.metrics.length > 0)
    .sort((a, b) => (b.metrics[0]?.reach ?? 0) - (a.metrics[0]?.reach ?? 0))
    .slice(0, 8);

  const contentTypeSummaries = Object.entries(filteredContent.reduce<Record<string, { total: number; published: number; metrics: ReturnType<typeof sumMetrics> }>>((summary, item) => {
    const key = item.contentType || "Unknown";
    const current = summary[key] ?? { total: 0, published: 0, metrics: sumMetrics([]) };
    current.total += 1;
    current.published += item.status === "PUBLISHED" ? 1 : 0;
    current.metrics = sumMetrics([current.metrics, ...item.metrics]);
    summary[key] = current;
    return summary;
  }, {}));

  const exportUrl = `/api/reports/monthly?month=${encodeURIComponent(monthValue)}&group=${encodeURIComponent(group)}`;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-brand-600">Reports</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-950">Comprehensive Marketing Report</h2>
          <p className="mt-2 text-slate-500">Laporan social media dan konten artikel periode {format(start, "dd MMM", { locale: id })} - {format(end, "dd MMM yyyy", { locale: id })}.</p>
        </div>
        <a href={exportUrl} className="inline-flex rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-500">Export CSV</a>
      </div>

      <ReportFilters month={monthValue} group={group} />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Total Konten</p><p className="mt-2 text-3xl font-bold text-slate-950">{formatNumber(filteredContent.length)}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Published</p><p className="mt-2 text-3xl font-bold text-slate-950">{formatNumber(publishedContent.length)}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Social / Artikel</p><p className="mt-2 text-3xl font-bold text-slate-950">{socialContent.length}/{articleContent.length}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Reach / Views</p><p className="mt-2 text-3xl font-bold text-slate-950">{formatNumber(totals.reach)}/{formatNumber(totals.views)}</p></div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><p className="text-sm text-slate-500">Engagement Rate</p><p className="mt-2 text-3xl font-bold text-slate-950">{overallEngagementRate}</p></div>
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <h3 className="text-lg font-semibold text-slate-950">Platform Performance</h3>
          <div className="mt-5 space-y-3">
            {channelSummaries.length === 0 ? <p className="text-sm text-slate-500">Belum ada data platform pada periode ini.</p> : channelSummaries.map((channel) => (
              <div key={channel.id} className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm md:grid-cols-6">
                <p className="font-medium text-slate-950 md:col-span-2">{channel.label}</p>
                <p className="text-slate-600">{channel.published}/{channel.planned} published</p>
                <p className="text-slate-600">{formatNumber(channel.reach)} reach</p>
                <p className="text-slate-600">{formatNumber(channel.views)} views</p>
                <p className="text-slate-600">ER {channel.engagementRate}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Lead & Conversion</h3>
          <div className="mt-5 grid gap-3">
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Total Leads</p><p className="mt-1 text-2xl font-bold text-slate-950">{leads.length}</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Booked</p><p className="mt-1 text-2xl font-bold text-slate-950">{bookedLeads}</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Potential Value</p><p className="mt-1 text-2xl font-bold text-slate-950">{formatCurrency(totalLeadValue)}</p></div>
            <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs text-slate-500">Clicks</p><p className="mt-1 text-2xl font-bold text-slate-950">{formatNumber(totals.clicks)}</p></div>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Content Type Breakdown</h3>
          <div className="mt-5 space-y-3">
            {contentTypeSummaries.length === 0 ? <p className="text-sm text-slate-500">Belum ada konten pada periode ini.</p> : contentTypeSummaries.map(([type, summary]) => (
              <div key={type} className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm md:grid-cols-5">
                <p className="font-medium text-slate-950 md:col-span-2">{type}</p>
                <p className="text-slate-600">{summary.published}/{summary.total} published</p>
                <p className="text-slate-600">{formatNumber(summary.metrics.reach)} reach</p>
                <p className="text-slate-600">{formatNumber(summary.metrics.clicks)} clicks</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Team Contribution</h3>
          <div className="mt-5 space-y-3">
            {writerSummaries.length === 0 ? <p className="text-sm text-slate-500">Belum ada kontribusi tim pada periode ini.</p> : writerSummaries.map((writer) => (
              <div key={writer.id} className="grid gap-3 rounded-xl bg-slate-50 p-4 text-sm md:grid-cols-5">
                <div className="md:col-span-2"><p className="font-medium text-slate-950">{writer.name}</p><p className="text-xs text-slate-500">{writer.role}</p></div>
                <p className="text-slate-600">{writer.published}/{writer.assigned} published</p>
                <p className="text-slate-600">{writer.articles} artikel</p>
                <p className="text-slate-600">{formatNumber(writer.reach)} reach</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Top Content</h3>
          <div className="mt-5 space-y-4">
            {topContents.length === 0 ? <p className="text-sm text-slate-500">Belum ada metrik konten pada periode ini.</p> : topContents.map((content) => {
              const latestMetric = content.metrics[0];
              return (
                <div key={content.id} className="rounded-xl border border-slate-100 p-4">
                  <p className="font-medium text-slate-950">{content.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{content.socialAccount?.platform ?? "Artikel/Website"} · {content.contentType} · Reach {formatNumber(latestMetric?.reach ?? 0)} · ER {latestMetric ? engagementRate(latestMetric) : "0%"}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-950">Campaign Snapshot</h3>
          <div className="mt-5 space-y-4">
            {campaigns.length === 0 ? <p className="text-sm text-slate-500">Belum ada campaign.</p> : campaigns.slice(0, 8).map((campaign) => {
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
