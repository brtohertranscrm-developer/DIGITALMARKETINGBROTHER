"use server";

import { redirect } from "next/navigation";
import { compare } from "bcryptjs";
import { db } from "@brothers-trans/database";
import { createSession } from "@/lib/session";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "").toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=credentials");
  }

  const user = await db.user.findUnique({ where: { email } });

  if (!user?.passwordHash) {
    redirect("/login?error=credentials");
  }

  const isValidPassword = await compare(password, user.passwordHash);

  if (!isValidPassword) {
    redirect("/login?error=credentials");
  }

  await createSession(user.id);
  redirect("/dashboard");
}
