import { NextRequest, NextResponse } from "next/server";
import { db } from "@brothers-trans/database";
import { getSessionUser } from "@/lib/session";
import { matchesContentGroup, normalizeContentGroup, reportDateRange } from "@/lib/reporting";

function csvEscape(value: unknown) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function engagementRate(metric?: { likes: number; comments: number; shares: number; saves: number; reach: number }) {
  if (!metric?.reach) {
    return "0%";
  }

  const engagement = metric.likes + metric.comments + metric.shares + metric.saves;
  return `${((engagement / metric.reach) * 100).toFixed(1)}%`;
}

export async function GET(request: NextRequest) {
  const user = await getSessionUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const month = request.nextUrl.searchParams.get("month") ?? undefined;
  const group = normalizeContentGroup(request.nextUrl.searchParams.get("group") ?? undefined);
  const { start, end, value } = reportDateRange(month);

  const contentItems = await db.contentItem.findMany({
    where: {
      OR: [{ publishedAt: { gte: start, lte: end } }, { createdAt: { gte: start, lte: end } }],
    },
    include: {
      campaign: true,
      socialAccount: true,
      assignee: true,
      creator: true,
      metrics: { where: { measuredAt: { gte: start, lte: end } }, orderBy: { measuredAt: "desc" }, take: 1 },
    },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });

  const filteredContent = contentItems.filter((item) => matchesContentGroup(item.contentType, group));
  const rows = [
    [
      "Title",
      "Content Type",
      "Platform",
      "Social Handle",
      "Campaign",
      "Assignee",
      "Creator",
      "Status",
      "Published At",
      "Reach",
      "Impressions",
      "Views",
      "Likes",
      "Comments",
      "Shares",
      "Saves",
      "Clicks",
      "Engagement Rate",
    ],
    ...filteredContent.map((item) => {
      const metric = item.metrics[0];
      return [
        item.title,
        item.contentType,
        item.socialAccount?.platform ?? "",
        item.socialAccount?.handle ?? "",
        item.campaign?.name ?? "",
        item.assignee?.name ?? item.assignee?.email ?? "",
        item.creator?.name ?? item.creator?.email ?? "",
        item.status,
        item.publishedAt?.toISOString() ?? "",
        metric?.reach ?? 0,
        metric?.impressions ?? 0,
        metric?.views ?? 0,
        metric?.likes ?? 0,
        metric?.comments ?? 0,
        metric?.shares ?? 0,
        metric?.saves ?? 0,
        metric?.clicks ?? 0,
        engagementRate(metric),
      ];
    }),
  ];

  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="brothers-trans-report-${value}-${group.toLowerCase()}.csv"`,
    },
  });
}
