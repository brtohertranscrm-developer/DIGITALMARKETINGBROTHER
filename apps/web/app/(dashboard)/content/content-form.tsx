import { contentStatuses, platforms } from "@brothers-trans/shared";
import { createContentItem } from "./actions";

interface ContentFormProps {
  campaigns: Array<{ id: string; name: string }>;
}

export function ContentForm({ campaigns }: ContentFormProps) {
  return (
    <form action={createContentItem} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-brand-600">Input Konten</p>
        <h3 className="text-xl font-semibold text-slate-950">Tambah Planning Konten</h3>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="lg:col-span-2">
          <label htmlFor="title" className="text-sm font-medium text-slate-700">Judul konten</label>
          <input id="title" name="title" required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" placeholder="Contoh: Reels promo sewa Hiace" />
        </div>
        <div>
          <label htmlFor="contentType" className="text-sm font-medium text-slate-700">Tipe konten</label>
          <input id="contentType" name="contentType" required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" placeholder="Reels, Carousel, Story, Artikel" />
        </div>
        <div>
          <label htmlFor="scheduledAt" className="text-sm font-medium text-slate-700">Jadwal publish</label>
          <input id="scheduledAt" name="scheduledAt" type="datetime-local" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" />
        </div>
        <div>
          <label htmlFor="status" className="text-sm font-medium text-slate-700">Status</label>
          <select id="status" name="status" defaultValue="IDEA" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100">
            {contentStatuses.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="platform" className="text-sm font-medium text-slate-700">Platform</label>
          <select id="platform" name="platform" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100">
            <option value="">Belum ditentukan</option>
            {platforms.map((platform) => (
              <option key={platform} value={platform}>{platform}</option>
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
        <div className="lg:col-span-2">
          <label htmlFor="caption" className="text-sm font-medium text-slate-700">Caption / brief</label>
          <textarea id="caption" name="caption" rows={4} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" placeholder="Masukkan draft caption, brief visual, atau catatan konten." />
        </div>
      </div>
      <button type="submit" className="mt-6 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-500">Simpan Konten</button>
    </form>
  );
}
