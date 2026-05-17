const team = [
  { name: "Content Writer", planned: 34, published: 29, avgEngagement: "6.2%" },
  { name: "Designer", planned: 31, published: 27, avgEngagement: "5.7%" },
  { name: "Social Media Admin", planned: 42, published: 40, avgEngagement: "6.8%" },
];

export default function TeamPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-brand-600">Team</p>
        <h2 className="text-3xl font-bold tracking-tight text-slate-950">Team KPI</h2>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-5 py-3 font-medium">Role</th>
              <th className="px-5 py-3 font-medium">Planned</th>
              <th className="px-5 py-3 font-medium">Published</th>
              <th className="px-5 py-3 font-medium">Avg Engagement</th>
            </tr>
          </thead>
          <tbody>
            {team.map((member) => (
              <tr key={member.name} className="border-t border-slate-100">
                <td className="px-5 py-4 font-medium text-slate-950">{member.name}</td>
                <td className="px-5 py-4 text-slate-600">{member.planned}</td>
                <td className="px-5 py-4 text-slate-600">{member.published}</td>
                <td className="px-5 py-4 text-slate-600">{member.avgEngagement}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
