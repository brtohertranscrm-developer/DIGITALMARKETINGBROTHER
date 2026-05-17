import { ArrowUpRight, type LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, change, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-blue-50 p-3 text-brand-600">
          <Icon className="h-5 w-5" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
          <ArrowUpRight className="h-3.5 w-3.5" />
          {change}
        </span>
      </div>
      <p className="mt-5 text-sm text-slate-500">{title}</p>
      <p className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
    </div>
  );
}
