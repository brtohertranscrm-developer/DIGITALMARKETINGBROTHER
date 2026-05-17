import { createCampaign } from "./actions";

export function CampaignForm() {
  return (
    <form action={createCampaign} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-brand-600">Campaign</p>
        <h3 className="text-xl font-semibold text-slate-950">Tambah Campaign</h3>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-slate-700">Nama campaign</label>
          <input id="name" name="name" required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" placeholder="Promo Liburan Sekolah" />
        </div>
        <div>
          <label htmlFor="objective" className="text-sm font-medium text-slate-700">Objective</label>
          <input id="objective" name="objective" required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" placeholder="Booking rombongan / lead B2B" />
        </div>
        <div>
          <label htmlFor="startDate" className="text-sm font-medium text-slate-700">Tanggal mulai</label>
          <input id="startDate" name="startDate" type="date" required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" />
        </div>
        <div>
          <label htmlFor="endDate" className="text-sm font-medium text-slate-700">Tanggal selesai</label>
          <input id="endDate" name="endDate" type="date" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" />
        </div>
        <div>
          <label htmlFor="budget" className="text-sm font-medium text-slate-700">Budget</label>
          <input id="budget" name="budget" type="number" min="0" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" placeholder="8000000" />
        </div>
      </div>
      <button type="submit" className="mt-6 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-500">Simpan Campaign</button>
    </form>
  );
}
