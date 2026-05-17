import { createContentMetric } from "./actions";

const metricFields = [
  { name: "reach", label: "Reach" },
  { name: "impressions", label: "Impressions" },
  { name: "views", label: "Views" },
  { name: "likes", label: "Likes" },
  { name: "comments", label: "Comments" },
  { name: "shares", label: "Shares" },
  { name: "saves", label: "Saves" },
  { name: "clicks", label: "Clicks" },
];

export function MetricForm({ contentItemId }: { contentItemId: string }) {
  return (
    <details className="rounded-xl border border-slate-100 bg-slate-50 p-4">
      <summary className="cursor-pointer text-sm font-semibold text-slate-700">Input metrik performa</summary>
      <form
        action={async (formData) => {
          "use server";
          await createContentMetric(contentItemId, formData);
        }}
        className="mt-4 grid gap-3 md:grid-cols-4"
      >
        {metricFields.map((field) => (
          <div key={field.name}>
            <label htmlFor={`${contentItemId}-${field.name}`} className="text-xs font-medium text-slate-500">{field.label}</label>
            <input id={`${contentItemId}-${field.name}`} name={field.name} type="number" min="0" defaultValue="0" className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-brand-600 focus:ring-2 focus:ring-blue-100" />
          </div>
        ))}
        <div className="md:col-span-4">
          <button type="submit" className="rounded-xl bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-500">Simpan Metrik</button>
        </div>
      </form>
    </details>
  );
}
