import Link from "next/link";
import { db } from "@brothers-trans/database";
import { SocialAccountForm } from "./social-account-form";
import { AccountActions } from "./account-actions";

export default async function SocialAccountsPage() {
  const accounts = await db.socialAccount.findMany({
    orderBy: [{ platform: "asc" }, { name: "asc" }],
    include: {
      _count: {
        select: {
          contentItems: true,
          metrics: true,
        },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">Channels</p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">Social Accounts</h2>
        <p className="mt-2 text-slate-500">Kelola akun sosial media dan channel marketing Brothers Trans.</p>
      </div>

      <SocialAccountForm />

      <div className="grid gap-4 lg:grid-cols-3">
        {accounts.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm lg:col-span-3">Belum ada social account.</div>
        ) : (
          accounts.map((account) => (
            <div key={account.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand-600">{account.platform}</span>
                  <h3 className="mt-4 font-semibold text-slate-950">{account.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{account.handle}</p>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${account.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {account.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              {account.profileUrl ? (
                <Link href={account.profileUrl} target="_blank" className="mt-4 block truncate text-sm font-medium text-brand-600 hover:underline">
                  {account.profileUrl}
                </Link>
              ) : null}
              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Konten</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{account._count.contentItems}</p>
                </div>
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs text-slate-500">Metrik akun</p>
                  <p className="mt-1 text-2xl font-bold text-slate-950">{account._count.metrics}</p>
                </div>
              </div>
              <div className="mt-5">
                <AccountActions accountId={account.id} isActive={account.isActive} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
