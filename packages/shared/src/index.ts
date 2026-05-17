export const platforms = [
  "INSTAGRAM",
  "FACEBOOK",
  "TIKTOK",
  "YOUTUBE",
  "GOOGLE_BUSINESS",
  "WEBSITE",
] as const;

export const contentStatuses = [
  "IDEA",
  "BRIEF",
  "DRAFT",
  "DESIGN",
  "REVIEW",
  "APPROVED",
  "SCHEDULED",
  "PUBLISHED",
  "ARCHIVED",
] as const;

export type Platform = (typeof platforms)[number];
export type ContentStatus = (typeof contentStatuses)[number];
