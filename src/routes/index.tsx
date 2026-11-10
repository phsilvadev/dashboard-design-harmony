import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, MessageSquare, Users, BarChart3, Settings, LifeBuoy, Plus, Bell, Search,
  ArrowUpRight, ArrowDownRight, Clock, CheckCircle2, Inbox, Sparkles,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Painel — AtendeHub" },
      { name: "description", content: "Acompanhe seus atendimentos, equipe e resultados no AtendeHub." },
      { property: "og:title", content: "Painel — AtendeHub" },
      { property: "og:description", content: "Acompanhe seus atendimentos, equipe e resultados no AtendeHub." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { icon: Inbox, label: "Atendimentos hoje", value: "128", delta: "+12%", up: true },
  { icon: Clock, label: "Tempo médio de resposta", value: "3m 42s", delta: "-8%", up: true },
  { icon: CheckCircle2, label: "Resolvidos", value: "96", delta: "+5%", up: true },
  { icon: Users, label: "Novos contatos", value: "34", delta: "-3%", up: false },
];

const status = [
  { label: "Em andamento", value: 42, color: "var(--chart-1)" },
  { label: "Aguardando", value: 26, color: "var(--chart-4)" },
  { label: "Resolvidos", value: 96, color: "var(--chart-3)" },
  { label: "Pendentes", value: 14, color: "var(--chart-2)" },
];

const recent = [
  { name: "Mariana Costa", msg: "Gostaria de saber o prazo de entrega…", time: "2 min", tag: "Novo" },
  { name: "Carlos Lima", msg: "Obrigado, deu tudo certo!", time: "8 min", tag: "Resolvido" },
  { name: "Ana Ribeiro", msg: "Ainda não recebi o boleto.", time: "15 min", tag: "Aguardando" },
  { name: "João Pereira", msg: "Vocês atendem aos sábados?", time: "22 min", tag: "Novo" },
];

function Donut() {
  const total = status.reduce((s, x) => s + x.value, 0);
  const r = 52, c = 2 * Math.PI * r;
  let off = 0;
  return (
    <svg viewBox="0 0 140 140" className="h-40 w-40 -rotate-90">
      <circle cx="70" cy="70" r={r} fill="none" stroke="var(--muted)" strokeWidth="16" />
      {status.map((s) => {
        const len = (s.value / total) * c;
        const el = (
          <circle key={s.label} cx="70" cy="70" r={r} fill="none" stroke={s.color} strokeWidth="16"
            strokeDasharray={`${len - 3} ${c - len + 3}`} strokeDashoffset={-off} strokeLinecap="round" />
        );
        off += len;
        return el;
      })}
    </svg>
  );
}

function Dashboard() {
  return (
    <div>
      <main className="flex-1 overflow-x-hidden">
        <div className="flex items-center justify-center gap-3 bg-graphite px-4 py-2 text-sm text-graphite-foreground">
          <span className="h-2 w-2 rounded-full bg-primary" />
          Você está no teste grátis — restam 9 dias.
          <a href="#" className="font-semibold text-primary hover:underline">Escolher plano →</a>
        </div>

        <header className="flex items-center gap-4 px-6 py-5 lg:px-10">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Buscar atendimentos, contatos…"
              className="w-full rounded-xl border border-input bg-secondary py-2.5 pl-11 pr-4 text-sm outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <button className="ml-auto flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card hover:bg-secondary">
            <Bell className="h-4 w-4" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-graphite text-sm font-semibold text-primary ring-2 ring-accent">PH</div>
        </header>

        <div className="space-y-6 px-6 pb-10 lg:px-10">
          <section className="relative overflow-hidden rounded-3xl bg-graphite p-8 text-graphite-foreground">
            <span className="inline-flex items-center gap-2 rounded-full border border-graphite-foreground/15 bg-graphite-foreground/5 px-3 py-1 text-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" /> Boas conversas. Novos negócios.
            </span>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight">Olá, Pedro Henrique</h1>
            <p className="mt-2 max-w-lg text-sm text-graphite-foreground/70">
              Você tem 12 conversas aguardando resposta. Vamos começar?
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="rounded-full px-5"><Link to="/atendimentos"><Plus /> Novo atendimento</Link></Button>
              <Button asChild variant="ghost" className="rounded-full border border-graphite-foreground/20 px-5 hover:bg-graphite-foreground/10 hover:text-graphite-foreground"><Link to="/atendimentos">Ver fila →</Link></Button>
            </div>
            <Sparkles className="absolute -right-4 -top-4 h-40 w-40 text-primary/10" />
          </section>

          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map(({ icon: Icon, label, value, delta, up }) => (
              <div key={label} className="rounded-2xl border border-border bg-card p-5" style={{ boxShadow: "var(--shadow-soft)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary">
                    <Icon className="h-4 w-4 text-accent-foreground" />
                  </div>
                  <span className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium ${up ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}`}>
                    {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}{delta}
                  </span>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{label}</p>
                <p className="mt-1 text-2xl font-semibold tracking-tight">{value}</p>
              </div>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-5">
            <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-2" style={{ boxShadow: "var(--shadow-soft)" }}>
              <h2 className="text-base font-semibold">Atendimentos por status</h2>
              <p className="text-sm text-muted-foreground">Últimos 7 dias</p>
              <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row">
                <Donut />
                <ul className="w-full space-y-3">
                  {status.map((s) => (
                    <li key={s.label} className="flex items-center justify-between text-sm">
                      <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />{s.label}</span>
                      <span className="font-semibold">{s.value}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 lg:col-span-3" style={{ boxShadow: "var(--shadow-soft)" }}>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-semibold">Conversas recentes</h2>
                  <p className="text-sm text-muted-foreground">Responda sem sair do painel</p>
                </div>
                <Link to="/atendimentos" className="text-sm font-medium text-accent-foreground hover:underline">Ver todas</Link>
              </div>
              <ul className="mt-4 divide-y divide-border">
                {recent.map((r) => (
                  <li key={r.name} className="flex items-center gap-3 py-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">
                      {r.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium">{r.name}</p>
                      <p className="truncate text-sm text-muted-foreground">{r.msg}</p>
                    </div>
                    <div className="text-right">
                      <span className="rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium">{r.tag}</span>
                      <p className="mt-1 text-xs text-muted-foreground">{r.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
