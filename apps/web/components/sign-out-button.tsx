import { redirect } from "next/navigation";
import { destroySession } from "@/lib/session";

export function SignOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await destroySession();
        redirect("/login");
      }}
    >
      <button type="submit" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950">
        Keluar
      </button>
    </form>
  );
}
