import Link from "next/link";
import { BarChart3, CalendarDays, FileText, Megaphone, MousePointerClick, Share2, Users } from "lucide-react";

const navigation = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/content", label: "Content Calendar", icon: CalendarDays },
  { href: "/social-accounts", label: "Social Accounts", icon: Share2 },
  { href: "/campaigns", label: "Campaign", icon: Megaphone },
  { href: "/leads", label: "Leads", icon: MousePointerClick },
  { href: "/team", label: "Team KPI", icon: Users },
  { href: "/reports", label: "Reports", icon: FileText },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white px-5 py-6 lg:block">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-600">Brothers Trans</p>
        <h1 className="mt-2 text-xl font-bold text-slate-950">Marketing OS</h1>
      </div>
      <nav className="mt-8 space-y-1">
        {navigation.map((item) => (
          <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-950">
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
