"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { platforms } from "@brothers-trans/shared";
import { db } from "@brothers-trans/database";
import { getSessionUser } from "@/lib/session";

const socialAccountSchema = z.object({
  name: z.string().min(3),
  platform: z.enum(platforms),
  handle: z.string().min(2),
  profileUrl: z.string().url().optional().or(z.literal("")),
  isActive: z.coerce.boolean().default(true),
});

export async function createSocialAccount(formData: FormData) {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const parsed = socialAccountSchema.parse({
    name: formData.get("name"),
    platform: formData.get("platform"),
    handle: formData.get("handle"),
    profileUrl: formData.get("profileUrl") || "",
    isActive: formData.get("isActive") === "on",
  });

  await db.socialAccount.create({
    data: {
      name: parsed.name,
      platform: parsed.platform,
      handle: parsed.handle,
      profileUrl: parsed.profileUrl || null,
      isActive: parsed.isActive,
    },
  });

  revalidatePath("/social-accounts");
  revalidatePath("/content");
}

export async function toggleSocialAccount(accountId: string, isActive: boolean) {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.socialAccount.update({ where: { id: accountId }, data: { isActive } });

  revalidatePath("/social-accounts");
  revalidatePath("/content");
}

export async function deleteSocialAccount(accountId: string) {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.socialAccount.delete({ where: { id: accountId } });

  revalidatePath("/social-accounts");
  revalidatePath("/content");
}
