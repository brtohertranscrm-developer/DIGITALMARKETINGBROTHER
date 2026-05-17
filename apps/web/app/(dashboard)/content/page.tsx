import { format } from "date-fns";
import { id } from "date-fns/locale";
import { db } from "@brothers-trans/database";
import { ContentForm } from "./content-form";
import { StatusForm } from "./status-form";

function formatDate(date: Date | null) {
  if (!date) {
    return "Belum dijadwalkan";
  }

  return format(date, "dd MMM yyyy HH:mm", { locale: id });
}

export default async function ContentPage() {
  const [contentItems, campaigns] = await Promise.all([
    db.contentItem.findMany({
      orderBy: [{ scheduledAt: "asc" }, { createdAt: "desc" }],
      include: {
        campaign: true,
        socialAccount: true,
        assignee: true,
      },
      take: 50,
    }),
    db.campaign.findMany({ orderBy: { startDate: "desc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">Planning</p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">Content Calendar</h2>
        <p className="mt-2 text-slate-500">Input planning, brief, jadwal publish, dan status produksi konten tim.</p>
      </div>

      <ContentForm campaigns={campaigns} />

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h3 className="text-lg font-semibold text-slate-950">Daftar Konten</h3>
        </div>
        {contentItems.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500">Belum ada konten. Tambahkan planning konten pertama.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {contentItems.map((item) => (
              <div key={item.id} className="grid gap-4 p-5 xl:grid-cols-[1.4fr_0.9fr_1fr] xl:items-center">
                <div>
                  <p className="font-medium text-slate-950">{item.title}</p>
                  <p className="mt-1 text-sm text-slate-500">{item.contentType} · {item.socialAccount?.platform ?? "No platform"} · {item.campaign?.name ?? "No campaign"}</p>
                  {item.caption ? <p className="mt-2 line-clamp-2 text-sm text-slate-600">{item.caption}</p> : null}
                </div>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Jadwal</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">{formatDate(item.scheduledAt)}</p>
                  <p className="mt-1 text-xs text-slate-500">PIC: {item.assignee?.name ?? "Belum ada"}</p>
                </div>
                <StatusForm contentItemId={item.id} currentStatus={item.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
