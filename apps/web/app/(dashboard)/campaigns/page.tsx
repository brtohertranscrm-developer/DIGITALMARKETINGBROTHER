import { format } from "date-fns";
import { id } from "date-fns/locale";
import { db } from "@brothers-trans/database";
import { CampaignForm } from "./campaign-form";
import { DeleteCampaignForm } from "./delete-campaign-form";

function formatCurrency(value: unknown) {
  const amount = Number(value ?? 0);

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDate(date: Date | null) {
  if (!date) {
    return "Berjalan";
  }

  return format(date, "dd MMM yyyy", { locale: id });
}

export default async function CampaignsPage() {
  const campaigns = await db.campaign.findMany({
    orderBy: { startDate: "desc" },
    include: {
      _count: {
        select: {
          contentItems: true,
          leads: true,
        },
      },
      leads: {
        select: { value: true },
      },
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">Campaign</p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">Campaign Performance</h2>
        <p className="mt-2 text-slate-500">Kelola campaign marketing, budget, konten terkait, dan lead masuk.</p>
      </div>

      <CampaignForm />

      <div className="grid gap-4 lg:grid-cols-3">
        {campaigns.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm lg:col-span-3">Belum ada campaign. Tambahkan campaign pertama.</div>
        ) : (
          campaigns.map((campaign) => {
            const totalValue = campaign.leads.reduce((sum, lead) => sum + Number(lead.value ?? 0), 0);

            return (
              <div key={campaign.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-slate-950">{campaign.name}</h3>
                    <p className="mt-2 text-sm text-slate-500">{campaign.objective}</p>
                  </div>
                  <DeleteCampaignForm campaignId={campaign.id} />
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Periode</p>
                    <p className="mt-1 font-semibold text-slate-950">{formatDate(campaign.startDate)} - {formatDate(campaign.endDate)}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3">
                    <p className="text-xs text-slate-500">Budget</p>
                    <p className="mt-1 font-semibold text-slate-950">{formatCurrency(campaign.budget)}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 p-3">
                    <p className="text-xs text-brand-600">Konten</p>
                    <p className="mt-1 text-2xl font-bold text-brand-600">{campaign._count.contentItems}</p>
                  </div>
                  <div className="rounded-xl bg-emerald-50 p-3">
                    <p className="text-xs text-emerald-700">Leads</p>
                    <p className="mt-1 text-2xl font-bold text-emerald-700">{campaign._count.leads}</p>
                  </div>
                </div>
                <div className="mt-4 rounded-xl border border-slate-100 p-3">
                  <p className="text-xs text-slate-500">Potential value</p>
                  <p className="mt-1 font-semibold text-slate-950">{formatCurrency(totalValue)}</p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
