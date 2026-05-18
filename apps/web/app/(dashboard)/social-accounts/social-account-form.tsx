import { platforms } from "@brothers-trans/shared";
import { createSocialAccount } from "./actions";

export function SocialAccountForm() {
  return (
    <form action={createSocialAccount} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <p className="text-sm font-medium text-brand-600">Channel</p>
        <h3 className="text-xl font-semibold text-slate-950">Tambah Social Account</h3>
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-slate-700">Nama akun</label>
          <input id="name" name="name" required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" placeholder="Brothers Trans Instagram" />
        </div>
        <div>
          <label htmlFor="platform" className="text-sm font-medium text-slate-700">Platform</label>
          <select id="platform" name="platform" required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100">
            {platforms.map((platform) => (
              <option key={platform} value={platform}>{platform}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="handle" className="text-sm font-medium text-slate-700">Handle</label>
          <input id="handle" name="handle" required className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" placeholder="@brotherstrans" />
        </div>
        <div>
          <label htmlFor="profileUrl" className="text-sm font-medium text-slate-700">Profile URL</label>
          <input id="profileUrl" name="profileUrl" type="url" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100" placeholder="https://instagram.com/brotherstrans" />
        </div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input name="isActive" type="checkbox" defaultChecked className="h-4 w-4 rounded border-slate-300" />
          Aktif
        </label>
      </div>
      <button type="submit" className="mt-6 rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-500">Simpan Akun</button>
    </form>
  );
}
