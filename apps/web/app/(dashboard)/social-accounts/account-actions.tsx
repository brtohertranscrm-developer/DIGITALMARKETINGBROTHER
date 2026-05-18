import { deleteSocialAccount, toggleSocialAccount } from "./actions";

export function AccountActions({ accountId, isActive }: { accountId: string; isActive: boolean }) {
  return (
    <div className="flex flex-wrap gap-2">
      <form
        action={async () => {
          "use server";
          await toggleSocialAccount(accountId, !isActive);
        }}
      >
        <button type="submit" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">
          {isActive ? "Nonaktifkan" : "Aktifkan"}
        </button>
      </form>
      <form
        action={async () => {
          "use server";
          await deleteSocialAccount(accountId);
        }}
      >
        <button type="submit" className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Hapus</button>
      </form>
    </div>
  );
}
