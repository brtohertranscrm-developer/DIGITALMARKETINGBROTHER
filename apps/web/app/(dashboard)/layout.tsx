import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { Sidebar } from "@/components/sidebar";
import { SignOutButton } from "@/components/sign-out-button";

export default async function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-6 lg:p-8">
        <header className="mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div>
            <p className="text-sm font-medium text-slate-950">{session.user.name ?? "Admin Brothers Trans"}</p>
            <p className="text-xs text-slate-500">{session.user.email} · {session.user.role ?? "TEAM"}</p>
          </div>
          <SignOutButton />
        </header>
        {children}
      </main>
    </div>
  );
}
