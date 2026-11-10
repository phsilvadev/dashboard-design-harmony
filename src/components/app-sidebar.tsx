import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, LayoutDashboard, LifeBuoy, MessageSquare, Settings, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return (
    <aside className="hidden w-64 shrink-0 flex-col bg-sidebar p-5 text-sidebar-foreground md:flex">
      <Link to="/" className="mb-10 flex items-center gap-2 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground"><MessageSquare className="h-4 w-4" /></div>
        <span className="text-lg font-semibold text-sidebar-accent-foreground">AtendeHub</span>
      </Link>
      <nav className="flex flex-col gap-1" aria-label="Menu principal">
        {[{ to: "/" as const, icon: LayoutDashboard, label: "Painel" }, { to: "/atendimentos" as const, icon: MessageSquare, label: "Atendimentos" }].map(({ to, icon: Icon, label }) => (
          <Button key={to} asChild variant="ghost" className={`h-11 justify-start rounded-xl px-3 ${pathname === to ? "bg-sidebar-accent text-sidebar-accent-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"}`}>
            <Link to={to}><Icon className={pathname === to ? "text-primary" : ""} />{label}</Link>
          </Button>
        ))}
        {[{ icon: Users, label: "Contatos" }, { icon: BarChart3, label: "Relatórios" }, { icon: Settings, label: "Configurações" }].map(({ icon: Icon, label }) => (
          <Button key={label} disabled variant="ghost" className="h-11 justify-start rounded-xl px-3"><Icon />{label}</Button>
        ))}
      </nav>
      <div className="mt-auto rounded-2xl border border-sidebar-border bg-sidebar-accent/50 p-4">
        <p className="text-sm font-semibold text-sidebar-accent-foreground">Precisa de ajuda?</p>
        <p className="mt-1 text-xs">Nossa equipe responde rapidinho.</p>
        <Button disabled className="mt-3 w-full rounded-full"><LifeBuoy />Suporte</Button>
      </div>
    </aside>
  );
}