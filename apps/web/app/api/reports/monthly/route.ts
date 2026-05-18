import { NextResponse } from "next/server";
import { db } from "@brothers-trans/database";
import { getSessionUser } from "@/lib/session";

function csvEscape(value: unknown) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replaceAll('"', '""')}"`;
}

export async function GET() {
  const user = await getSessionUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

  const contentItems = await db.contentItem.findMany({
    where: { publishedAt: { gte: startOfMonth, lte: endOfMonth } },
    include: {
      campaign: true,
      socialAccount: true,
      assignee: true,
      metrics: { orderBy: { measuredAt: "desc" }, take: 1 },
    },
    orderBy: { publishedAt: "desc" },
  });

  const rows = [
    ["Title", "Platform", "Campaign", "PIC", "Published At", "Reach", "Views", "Likes", "Comments", "Shares", "Saves", "Clicks"],
    ...contentItems.map((item) => {
      const metric = item.metrics[0];
      return [
        item.title,
        item.socialAccount?.platform ?? "",
        item.campaign?.name ?? "",
        item.assignee?.name ?? "",
        item.publishedAt?.toISOString() ?? "",
        metric?.reach ?? 0,
        metric?.views ?? 0,
        metric?.likes ?? 0,
        metric?.comments ?? 0,
        metric?.shares ?? 0,
        metric?.saves ?? 0,
        metric?.clicks ?? 0,
      ];
    }),
  ];

  const csv = rows.map((row) => row.map(csvEscape).join(",")).join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="brothers-trans-report-${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}.csv"`,
    },
  });
}
