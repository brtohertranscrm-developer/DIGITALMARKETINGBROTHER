import { db } from "@brothers-trans/database";

function engagementRate(metrics: Array<{ likes: number; comments: number; shares: number; saves: number; reach: number }>) {
  const reach = metrics.reduce((sum, metric) => sum + metric.reach, 0);
  const engagement = metrics.reduce((sum, metric) => sum + metric.likes + metric.comments + metric.shares + metric.saves, 0);

  if (!reach) {
    return "0%";
  }

  return `${((engagement / reach) * 100).toFixed(1)}%`;
}

function roleLabel(role: string) {
  return role.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default async function TeamPage() {
  const users = await db.user.findMany({
    orderBy: [{ role: "asc" }, { name: "asc" }],
    include: {
      assignedItems: {
        include: { metrics: true },
      },
      createdItems: true,
    },
  });

  const roleSummaries = users.reduce<Record<string, { users: number; planned: number; published: number; metrics: Array<{ likes: number; comments: number; shares: number; saves: number; reach: number }> }>>((summary, user) => {
    const current = summary[user.role] ?? { users: 0, planned: 0, published: 0, metrics: [] };
    current.users += 1;
    current.planned += user.assignedItems.length;
    current.published += user.assignedItems.filter((item) => item.status === "PUBLISHED").length;
    current.metrics.push(...user.assignedItems.flatMap((item) => item.metrics));
    summary[user.role] = current;
    return summary;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">Team</p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">Team KPI</h2>
        <p className="mt-2 text-slate-500">Pantau produktivitas tim berdasarkan konten yang dibuat, ditugaskan, dan dipublish.</p>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        {Object.entries(roleSummaries).map(([role, summary]) => (
          <div key={role} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-brand-600">{roleLabel(role)}</p>
            <p className="mt-3 text-3xl font-bold text-slate-950">{summary.published}/{summary.planned}</p>
            <p className="mt-1 text-sm text-slate-500">Published dari total assignment</p>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">User</p><p className="mt-1 font-semibold text-slate-950">{summary.users}</p></div>
              <div className="rounded-xl bg-slate-50 p-3"><p className="text-xs text-slate-500">Avg ER</p><p className="mt-1 font-semibold text-slate-950">{engagementRate(summary.metrics)}</p></div>
            </div>
          </div>
        ))}
      </section>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Nama</th>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Created</th>
              <th className="px-5 py-3 font-medium">Assigned</th>
              <th className="px-5 py-3 font-medium">Published</th>
              <th className="px-5 py-3 font-medium">Avg Engagement</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-8 text-center text-slate-500">Belum ada user.</td></tr>
            ) : users.map((user) => {
              const published = user.assignedItems.filter((item) => item.status === "PUBLISHED").length;
              const metrics = user.assignedItems.flatMap((item) => item.metrics);

              return (
                <tr key={user.id} className="border-t border-slate-100">
                  <td className="px-5 py-4 font-medium text-slate-950">{user.name ?? user.email}</td>
                  <td className="px-5 py-4 text-slate-600">{roleLabel(user.role)}</td>
                  <td className="px-5 py-4 text-slate-600">{user.createdItems.length}</td>
                  <td className="px-5 py-4 text-slate-600">{user.assignedItems.length}</td>
                  <td className="px-5 py-4 text-slate-600">{published}</td>
                  <td className="px-5 py-4 text-slate-600">{engagementRate(metrics)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
