import { deleteCampaign } from "./actions";

export function DeleteCampaignForm({ campaignId }: { campaignId: string }) {
  return (
    <form
      action={async () => {
        "use server";
        await deleteCampaign(campaignId);
      }}
    >
      <button type="submit" className="rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50">Hapus</button>
    </form>
  );
}
