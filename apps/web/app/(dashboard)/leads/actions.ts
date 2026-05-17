"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getSessionUser } from "@/lib/session";
import { db } from "@brothers-trans/database";

const leadSchema = z.object({
  name: z.string().optional(),
  phone: z.string().min(5),
  source: z.enum(["INSTAGRAM", "FACEBOOK", "TIKTOK", "YOUTUBE", "GOOGLE_BUSINESS", "WEBSITE"]).optional(),
  status: z.string().min(2),
  campaignId: z.string().optional(),
  value: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

export async function createLead(formData: FormData) {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  const parsed = leadSchema.parse({
    name: formData.get("name") || undefined,
    phone: formData.get("phone"),
    source: formData.get("source") || undefined,
    status: formData.get("status"),
    campaignId: formData.get("campaignId") || undefined,
    value: formData.get("value") || undefined,
    notes: formData.get("notes") || undefined,
  });

  await db.lead.create({
    data: {
      name: parsed.name,
      phone: parsed.phone,
      source: parsed.source,
      status: parsed.status,
      campaignId: parsed.campaignId || null,
      value: parsed.value ?? null,
      notes: parsed.notes,
    },
  });

  revalidatePath("/leads");
  revalidatePath("/campaigns");
  revalidatePath("/dashboard");
}

export async function updateLeadStatus(leadId: string, status: string) {
  const user = await getSessionUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  await db.lead.update({ where: { id: leadId }, data: { status } });

  revalidatePath("/leads");
  revalidatePath("/dashboard");
}
