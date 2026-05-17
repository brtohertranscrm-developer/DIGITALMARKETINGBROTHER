import { loginAction } from "./actions";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 py-12">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Brothers Trans</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Masuk ke Marketing OS</h1>
          <p className="mt-2 text-sm text-slate-500">Gunakan akun admin untuk mengelola dashboard reporting.</p>
        </div>

        {params.error ? (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
            Email atau password tidak sesuai.
          </div>
        ) : null}

        <form action={loginAction} className="mt-8 space-y-5">
          <div>
            <label htmlFor="email" className="text-sm font-medium text-slate-700">Email</label>
            <input id="email" name="email" type="email" required autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-blue-100" placeholder="admin@brotherstrans.id" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm font-medium text-slate-700">Password</label>
            <input id="password" name="password" type="password" required autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-950 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-blue-100" placeholder="Minimal 8 karakter" />
          </div>
          <button type="submit" className="w-full rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-500">Masuk</button>
        </form>

        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
          <p className="font-medium text-slate-950">Akun awal setelah seed</p>
          <p className="mt-1">Email: admin@brotherstrans.id</p>
          <p>Password: BrotherTrans123!</p>
        </div>
      </div>
    </main>
  );
}
