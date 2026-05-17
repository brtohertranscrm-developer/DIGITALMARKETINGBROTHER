import { updateLeadStatus } from "./actions";

const leadStatuses = ["NEW", "CONTACTED", "QUOTED", "BOOKED", "LOST"];

export function LeadStatusForm({ leadId, currentStatus }: { leadId: string; currentStatus: string }) {
  return (
    <form
      action={async (formData) => {
        "use server";
        await updateLeadStatus(leadId, String(formData.get("status")));
      }}
      className="flex items-center gap-2"
    >
      <select name="status" defaultValue={currentStatus} className="rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-4 focus:ring-blue-100">
        {leadStatuses.map((status) => (
          <option key={status} value={status}>{status}</option>
        ))}
      </select>
      <button type="submit" className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100">Update</button>
    </form>
  );
}
