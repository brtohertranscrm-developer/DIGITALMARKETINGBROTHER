"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionUser } from "@/lib/session";
import { db } from "@brothers-trans/database";

const contentItemSchema = z.object({
  title: z.string().min(3),
  caption: z.string().optional(),
  contentType: z.string().min(2),
  status: z.enum(["IDEA", "BRIEF", "DRAFT", "DESIGN", "REVIEW", "APPROVED", "SCHEDULED", "PUBLISHED", "ARCHIVED"]),
  platform: z.enum(["INSTAGRAM", "FACEBOOK", "TIKTOK", "YOUTUBE", "GOOGLE_BUSINESS", "WEBSITE"]).optional(),
  scheduledAt: z.string().optional(),
  campaignId: z.string().optional(),
});

export async function createContentItem(formData: FormData) {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const parsed = contentItemSchema.parse({
    title: formData.get("title"),
    caption: formData.get("caption") || undefined,
    contentType: formData.get("contentType"),
    status: formData.get("status"),
    platform: formData.get("platform") || undefined,
    scheduledAt: formData.get("scheduledAt") || undefined,
    campaignId: formData.get("campaignId") || undefined,
  });

  const socialAccount = parsed.platform
    ? await db.socialAccount.findFirst({ where: { platform: parsed.platform, isActive: true } })
    : null;

  await db.contentItem.create({
    data: {
      title: parsed.title,
      caption: parsed.caption,
      contentType: parsed.contentType,
      status: parsed.status,
      scheduledAt: parsed.scheduledAt ? new Date(parsed.scheduledAt) : null,
      campaignId: parsed.campaignId || null,
      socialAccountId: socialAccount?.id ?? null,
      creatorId: user.id,
      assigneeId: user.id,
    },
  });

  revalidatePath("/content");
  revalidatePath("/dashboard");
}

export async function updateContentStatus(contentItemId: string, status: string) {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const parsedStatus = contentItemSchema.shape.status.parse(status);

  await db.contentItem.update({
    where: { id: contentItemId },
    data: {
      status: parsedStatus,
      publishedAt: parsedStatus === "PUBLISHED" ? new Date() : undefined,
    },
  });

  revalidatePath("/content");
  revalidatePath("/dashboard");
}

export async function deleteContentItem(contentItemId: string) {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.contentItem.delete({ where: { id: contentItemId } });

  revalidatePath("/content");
  revalidatePath("/dashboard");
}
