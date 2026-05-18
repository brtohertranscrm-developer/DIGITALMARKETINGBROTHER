import { Search } from "lucide-react";

export function ReportFilters({ month, group }: { month: string; group: string }) {
  return (
    <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_auto]">
      <div>
        <label htmlFor="month" className="text-xs font-medium uppercase tracking-wide text-slate-500">Periode</label>
        <input id="month" name="month" type="month" defaultValue={month} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" />
      </div>
      <div>
        <label htmlFor="group" className="text-xs font-medium uppercase tracking-wide text-slate-500">Tipe laporan</label>
        <select id="group" name="group" defaultValue={group} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100">
          <option value="ALL">Semua konten</option>
          <option value="SOCIAL">Social media</option>
          <option value="ARTICLE">Artikel / SEO</option>
        </select>
      </div>
      <button type="submit" className="inline-flex items-center justify-center gap-2 self-end rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-500">
        <Search className="h-4 w-4" />
        Terapkan
      </button>
    </form>
  );
}
