import { format } from "date-fns";
import { id } from "date-fns/locale";
import { db } from "@brothers-trans/database";
import { LeadForm } from "./lead-form";
import { LeadStatusForm } from "./status-form";

function formatCurrency(value: unknown) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

export default async function LeadsPage() {
  const [leads, campaigns] = await Promise.all([
    db.lead.findMany({
      orderBy: { createdAt: "desc" },
      include: { campaign: true },
      take: 100,
    }),
    db.campaign.findMany({ orderBy: { startDate: "desc" }, select: { id: true, name: true } }),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">CRM Ringan</p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">Lead Tracking</h2>
        <p className="mt-2 text-slate-500">Catat leads dari WhatsApp, sosial media, website, dan follow-up sales.</p>
      </div>

      <LeadForm campaigns={campaigns} />

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Lead</th>
              <th className="px-5 py-3 font-medium">Source</th>
              <th className="px-5 py-3 font-medium">Campaign</th>
              <th className="px-5 py-3 font-medium">Value</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-slate-500">Belum ada lead.</td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead.id} className="border-t border-slate-100 align-top">
                  <td className="px-5 py-4">
                    <p className="font-medium text-slate-950">{lead.name ?? "Tanpa nama"}</p>
                    <p className="mt-1 text-slate-500">{lead.phone}</p>
                    <p className="mt-1 text-xs text-slate-400">{format(lead.createdAt, "dd MMM yyyy HH:mm", { locale: id })}</p>
                    {lead.notes ? <p className="mt-2 max-w-xs text-xs text-slate-500">{lead.notes}</p> : null}
                  </td>
                  <td className="px-5 py-4 text-slate-600">{lead.source ?? "-"}</td>
                  <td className="px-5 py-4 text-slate-600">{lead.campaign?.name ?? "-"}</td>
                  <td className="px-5 py-4 font-medium text-slate-950">{formatCurrency(lead.value)}</td>
                  <td className="px-5 py-4">
                    <LeadStatusForm leadId={lead.id} currentStatus={lead.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
