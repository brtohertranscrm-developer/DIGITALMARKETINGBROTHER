export type ReportContentGroup = "ALL" | "SOCIAL" | "ARTICLE";

export function parseReportMonth(value?: string) {
  const now = new Date();
  const match = value?.match(/^(\d{4})-(\d{2})$/);

  if (!match) {
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  }

  const year = Number(match[1]);
  const month = Number(match[2]);

  if (month < 1 || month > 12) {
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
  }

  return { year, month };
}

export function reportDateRange(monthValue?: string) {
  const { year, month } = parseReportMonth(monthValue);
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);
  const value = `${year}-${String(month).padStart(2, "0")}`;

  return { start, end, value };
}

export function normalizeContentGroup(value?: string): ReportContentGroup {
  if (value === "SOCIAL" || value === "ARTICLE") {
    return value;
  }

  return "ALL";
}

export function isArticleContent(contentType: string) {
  const normalized = contentType.toLowerCase();
  return ["article", "artikel", "blog", "seo", "landing page", "website"].some((keyword) => normalized.includes(keyword));
}

export function matchesContentGroup(contentType: string, group: ReportContentGroup) {
  if (group === "ALL") {
    return true;
  }

  const isArticle = isArticleContent(contentType);
  return group === "ARTICLE" ? isArticle : !isArticle;
}

export function formatNumber(value: number) {
  return new Intl.NumberFormat("id-ID").format(value);
}

export function formatCurrency(value: unknown) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

export function engagementRate(metric: { likes: number; comments: number; shares: number; saves: number; reach: number }) {
  if (!metric.reach) {
    return "0%";
  }

  const engagement = metric.likes + metric.comments + metric.shares + metric.saves;
  return `${((engagement / metric.reach) * 100).toFixed(1)}%`;
}
