export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">Reports</p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">Monthly Reporting</h2>
      </div>
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <h3 className="text-xl font-semibold text-slate-950">Laporan Mei 2026</h3>
        <p className="mt-2 max-w-2xl text-slate-600">Ringkasan otomatis untuk performa channel, produktivitas tim, campaign terbaik, konten terbaik, dan rekomendasi konten berikutnya.</p>
        <button className="mt-6 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-500">Export PDF</button>
      </div>
    </div>
  );
}
