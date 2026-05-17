import { contentStatuses } from "@brothers-trans/shared";
import { deleteContentItem, updateContentStatus } from "./actions";

interface StatusFormProps {
  contentItemId: string;
  currentStatus: string;
}

export function StatusForm({ contentItemId, currentStatus }: StatusFormProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <form
        action={async (formData) => {
          "use server";
          await updateContentStatus(contentItemId, String(formData.get("status")));
        }}
      >
        <select name="status" defaultValue={currentStatus} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100">
          {contentStatuses.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <button type="submit" className="ml-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Update</button>
      </form>
      <form
        action={async () => {
          "use server";
          await deleteContentItem(contentItemId);
        }}
      >
        <button type="submit" className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Hapus</button>
      </form>
    </div>
  );
}
