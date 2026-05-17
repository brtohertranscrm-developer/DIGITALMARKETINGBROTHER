"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { auth } from "@/auth";
import { db } from "@brothers-trans/database";

const campaignSchema = z.object({
  name: z.string().min(3),
  objective: z.string().min(3),
  startDate: z.string().min(1),
  endDate: z.string().optional(),
  budget: z.coerce.number().min(0).optional(),
});

export async function createCampaign(formData: FormData) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = campaignSchema.parse({
    name: formData.get("name"),
    objective: formData.get("objective"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate") || undefined,
    budget: formData.get("budget") || undefined,
  });

  await db.campaign.create({
    data: {
      name: parsed.name,
      objective: parsed.objective,
      startDate: new Date(parsed.startDate),
      endDate: parsed.endDate ? new Date(parsed.endDate) : null,
      budget: parsed.budget ?? null,
    },
  });

  revalidatePath("/campaigns");
  revalidatePath("/content");
}

export async function deleteCampaign(campaignId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  await db.campaign.delete({ where: { id: campaignId } });

  revalidatePath("/campaigns");
  revalidatePath("/content");
  revalidatePath("/dashboard");
}
