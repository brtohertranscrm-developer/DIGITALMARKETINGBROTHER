import { platforms } from "@brothers-trans/shared";
import { createLead } from "./actions";

const leadStatuses = ["NEW", "CONTACTED", "QUOTED", "BOOKED", "LOST"];

export function LeadForm({ campaigns }: { campaigns: Array<{ id: string; name: string }> }) {
  return (
    <form action={createLead} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-brand-600">Leads</p>
        <h3 className="text-xl font-semibold text-slate-950">Input Lead Baru</h3>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-slate-700">Nama</label>
          <input id="name" name="name" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" placeholder="Nama calon pelanggan" />
        </div>
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-slate-700">No. WhatsApp</label>
          <input id="phone" name="phone" required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" placeholder="08xxxxxxxxxx" />
        </div>
        <div>
          <label htmlFor="source" className="text-sm font-medium text-slate-700">Source</label>
          <select id="source" name="source" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100">
            <option value="">Belum diketahui</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="status" className="text-sm font-medium text-slate-700">Status</label>
          <select id="status" name="status" defaultValue="NEW" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100">
            {leadStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="campaignId" className="text-sm font-medium text-slate-700">Campaign</label>
          <select id="campaignId" name="campaignId" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100">
            <option value="">Tanpa campaign</option>
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="value" className="text-sm font-medium text-slate-700">Estimasi nilai</label>
          <input id="value" name="value" type="number" min="0" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" placeholder="2500000" />
        </div>
        <div className="lg:col-span-2">
          <label htmlFor="notes" className="text-sm font-medium text-slate-700">Catatan kebutuhan</label>
          <textarea id="notes" name="notes" rows={3} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" placeholder="Contoh: Butuh Hiace Jakarta-Bandung untuk 14 orang." />
        </div>
      </div>
      <button type="submit" className="mt-6 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-500">Simpan Lead</button>
    </form>
  );
}
