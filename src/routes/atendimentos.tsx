import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Bot, ArrowRightLeft, ArrowLeft, CheckCheck, CheckCircle2, ChevronDown, Clock, Inbox, MessageSquare, Plus, Search, Send, UserRound, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { canSendHumanMessage, transitionAttendance, type AttendanceStatus, type AttendanceAction } from "@/lib/attendance-flow";

export const Route = createFileRoute("/atendimentos")({
  head: () => ({ meta: [
    { title: "Atendimentos — AtendeHub" },
    { name: "description", content: "Organize a fila de atendimentos e acompanhe suas conversas no AtendeHub." },
    { property: "og:title", content: "Atendimentos — AtendeHub" },
    { property: "og:description", content: "Organize a fila de atendimentos e acompanhe suas conversas no AtendeHub." },
    { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary" },
  ] }),
  component: Atendimentos,
});

type Message = { text: string; sent: boolean; time: string; author?: "ai" | "human" | "system" };
type Conversation = { id: number; name: string; initials: string; phone: string; status: AttendanceStatus; team: string; time: string; unread: number; messages: Message[] };
const initialConversations: Conversation[] = [
  { id: 1, name: "Mariana Costa", initials: "MC", phone: "(11) 99999-0101", status: "Com a IA", team: "Comercial", time: "10:42", unread: 2, messages: [
    { text: "Olá! Bom dia 😊", sent: false, time: "10:35" },
    { text: "Bom dia, Mariana! Sou a assistente virtual do AtendeHub. Como posso te ajudar?", sent: true, author: "ai", time: "10:36" },
    { text: "Fiz um pedido ontem e gostaria de saber o prazo de entrega.", sent: false, time: "10:41" },
    { text: "Meu pedido é o #10248. Consegue verificar pra mim?", sent: false, time: "10:42" },
    { text: "Obrigada, Mariana! Vou encaminhar o número do pedido à equipe para confirmar o prazo de entrega.", sent: true, author: "ai", time: "10:42" },
  ] },
  { id: 2, name: "Ana Ribeiro", initials: "AR", phone: "(11) 99999-0102", status: "Aguardando equipe", team: "Financeiro", time: "10:28", unread: 1, messages: [{ text: "Olá, ainda não recebi o boleto. Podem me ajudar?", sent: false, time: "10:28" }] },
  { id: 3, name: "João Pereira", initials: "JP", phone: "(11) 99999-0103", status: "Com a IA", team: "Comercial", time: "10:15", unread: 1, messages: [{ text: "Vocês atendem aos sábados?", sent: false, time: "10:15" }] },
  { id: 4, name: "Beatriz Santos", initials: "BS", phone: "(11) 99999-0104", status: "Com atendente", team: "Suporte", time: "09:56", unread: 0, messages: [{ text: "Pode me explicar como funciona a troca?", sent: false, time: "09:56" }] },
  { id: 5, name: "Carlos Lima", initials: "CL", phone: "(11) 99999-0105", status: "Resolvido", team: "Suporte", time: "09:40", unread: 0, messages: [{ text: "Obrigado, deu tudo certo!", sent: false, time: "09:40" }] },
  { id: 6, name: "Lucas Oliveira", initials: "LO", phone: "(11) 99999-0106", status: "Com a IA", team: "Comercial", time: "09:22", unread: 0, messages: [{ text: "Gostaria de um orçamento, por favor.", sent: false, time: "09:22" }] },
];

function Atendimentos() {
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedId, setSelectedId] = useState<number | null>(1);
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState("Todos");
  const [team, setTeam] = useState("Todas as equipes");
  const [draft, setDraft] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const selected = conversations.find((item) => item.id === selectedId);
  const filtered = conversations.filter((item) => `${item.name} ${item.phone}`.toLocaleLowerCase("pt-BR").includes(query.toLocaleLowerCase("pt-BR")) && (tab === "Todos" || item.status === tab) && (team === "Todas as equipes" || team === item.team));
  function changeStatus(action: AttendanceAction) {
    if (!selected) return;
    setConversations((items) => items.map((item) => {
      if (item.id !== selected.id) return item;
      const status = transitionAttendance(item.status, action);
      if (status === item.status) return item;
      const text = action === "assume" ? "Pedro Henrique assumiu o atendimento. IA pausada." : action === "transfer" ? "Conversa encaminhada para a equipe. IA pausada." : action === "resolve" ? "Atendimento resolvido por Pedro Henrique." : "Atendimento reaberto por Pedro Henrique.";
      return { ...item, status, unread: 0, messages: [...item.messages, { text, sent: false, author: "system" as const, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }] };
    }));
    setDraft("");
  }
  function sendMessage(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.trim() || !selected || !canSendHumanMessage(selected.status)) return;
    const message = { text: draft.trim(), sent: true, author: "human" as const, time: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) };
    setConversations((items) => items.map((item) => item.id === selected.id ? { ...item, messages: [...item.messages, message], time: message.time } : item));
    setDraft("");
  }
  function createConversation(event: React.FormEvent) {
    event.preventDefault();
    if (!newName.trim() || !newPhone.trim()) return;
    const id = Date.now();
    setConversations((items) => [{ id, name: newName.trim(), initials: newName.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase(), phone: newPhone, status: "Com a IA", team: "Comercial", time: "Agora", unread: 0, messages: [] }, ...items]);
    setSelectedId(id); setShowNew(false); setNewName(""); setNewPhone(""); setTab("Todos"); setTeam("Todas as equipes"); setQuery("");
  }
  return (
    <main className="flex h-dvh min-h-[560px] flex-col">
      <div className="flex min-h-9 flex-wrap items-center justify-center gap-x-3 bg-graphite px-4 py-2 text-xs text-graphite-foreground sm:text-sm"><span className="h-1.5 w-1.5 rounded-full bg-primary" />Você está no teste grátis — restam 9 dias.</div>
      <header className="flex shrink-0 items-center justify-between gap-3 px-5 py-5 lg:px-8">
        <div><Link to="/" className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground md:hidden"><ArrowLeft className="size-3" />Painel</Link><h1 className="text-2xl font-semibold">Atendimentos</h1><p className="mt-1 text-sm text-muted-foreground">Cada conversa, uma nova oportunidade.</p></div>
        <Button onClick={() => setShowNew(true)} className="shrink-0 rounded-full sm:px-5"><Plus /><span className="hidden sm:inline">Novo atendimento</span><span className="sm:hidden">Novo</span></Button>
      </header>
      <div className="flex shrink-0 gap-5 overflow-x-auto border-b border-border px-5 lg:px-8">
        {[{ label: "Todos", icon: Inbox }, { label: "Com a IA", icon: Bot }, { label: "Aguardando equipe", icon: Clock }, { label: "Com atendente", icon: UserRound }, { label: "Resolvido", icon: CheckCircle2 }].map(({ label, icon: Icon }) => (
          <Button key={label} variant="ghost" onClick={() => setTab(label)} aria-pressed={tab === label} className={`h-12 shrink-0 rounded-none border-b-2 px-0 hover:bg-transparent ${tab === label ? "border-primary text-accent-foreground" : "border-transparent text-muted-foreground"}`}><Icon /><span>{label === "Resolvido" ? "Resolvidos" : label}</span><span className={`ml-1 rounded-md px-1.5 py-0.5 text-xs ${tab === label ? "bg-accent" : "bg-secondary"}`}>{conversations.filter((item) => label === "Todos" || item.status === label).length}</span></Button>
        ))}
      </div>
      <div className="flex min-h-0 flex-1">
        <section aria-label="Lista de atendimentos" className={`${selected ? "hidden lg:flex" : "flex"} w-full shrink-0 flex-col border-r border-border bg-card lg:w-80 xl:w-96`}>
          <div className="space-y-3 border-b border-border p-4">
            <div className="relative"><Search className="absolute left-3 top-3 size-4 text-muted-foreground" /><input aria-label="Buscar conversa" placeholder="Buscar nome ou telefone" value={query} onChange={(event) => setQuery(event.target.value)} className="h-10 w-full rounded-xl border border-input bg-secondary pl-10 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring" /></div>
            <div className="flex items-center justify-between gap-2"><div className="relative"><select aria-label="Filtrar equipe" value={team} onChange={(event) => setTeam(event.target.value)} className="max-w-full appearance-none bg-transparent py-1 pl-1 pr-6 text-xs text-muted-foreground outline-none focus:ring-2 focus:ring-ring">{["Todas as equipes", "Comercial", "Financeiro", "Suporte"].map((label) => <option key={label}>{label}</option>)}</select><ChevronDown className="pointer-events-none absolute right-0 top-1.5 size-3 text-muted-foreground" /></div><span className="text-xs text-muted-foreground">{filtered.length} conversas</span></div>
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto">
            {filtered.map((item) => <Button key={item.id} variant="ghost" onClick={() => { setSelectedId(item.id); setDraft(""); setConversations((items) => items.map((c) => c.id === item.id ? { ...c, unread: 0 } : c)); }} className={`h-auto w-full justify-start gap-3 whitespace-normal rounded-none border-b border-border border-l-2 px-4 py-5 text-left ${selectedId === item.id ? "border-l-primary bg-accent/50" : "border-l-transparent"}`}>
              <span className={`flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${selectedId === item.id ? "bg-accent text-accent-foreground" : "bg-secondary text-muted-foreground"}`}>{item.initials}</span>
              <span className="min-w-0 flex-1"><span className="flex items-center justify-between gap-2"><span className="truncate font-semibold">{item.name}</span><span className="shrink-0 text-[11px] font-normal text-muted-foreground">{item.time}</span></span><span className="mt-1 block truncate text-xs font-normal text-muted-foreground">{item.messages.at(-1)?.text ?? "Nova conversa"}</span><span className="mt-2 flex items-center justify-between"><span className="text-[11px] font-normal text-muted-foreground">{item.team} · {item.status}</span>{item.unread > 0 && <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">{item.unread}</span>}</span></span>
            </Button>)}
            {filtered.length === 0 && <div className="px-5 py-12 text-center text-sm text-muted-foreground"><Search className="mx-auto mb-3 size-6" />Nenhuma conversa encontrada.</div>}
          </div>
          <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground"><span className="mr-2 inline-block size-1.5 rounded-full bg-success" />Pedro Henrique · Disponível</div>
        </section>
        <section aria-label="Conversa" className={`${selected ? "flex" : "hidden lg:flex"} min-w-0 flex-1 flex-col`}>
          {selected ? <>
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-border bg-card px-5 py-4">
              <div className="flex min-w-0 items-center gap-3"><Button size="icon" variant="ghost" title="Voltar para conversas" aria-label="Voltar para conversas" onClick={() => setSelectedId(null)} className="lg:hidden"><ArrowLeft /></Button><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-semibold text-accent-foreground">{selected.initials}</span><div className="min-w-0"><h2 className="truncate text-sm font-semibold">{selected.name}</h2><p className="mt-1 text-xs text-muted-foreground">{selected.phone}</p></div></div>
              <div className="flex flex-wrap gap-2">{selected.status === "Com a IA" && <Button variant="outline" size="sm" className="rounded-full" onClick={() => changeStatus("transfer")}><ArrowRightLeft />Encaminhar à equipe</Button>}{selected.status === "Com a IA" || selected.status === "Aguardando equipe" ? <Button size="sm" className="rounded-full" onClick={() => changeStatus("assume")}><UserRound />Assumir atendimento</Button> : <Button variant="outline" size="sm" className="rounded-full" onClick={() => changeStatus(selected.status === "Resolvido" ? "reopen" : "resolve")}><CheckCircle2 />{selected.status === "Resolvido" ? "Reabrir" : "Resolver"}</Button>}</div>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-border px-5 py-2.5 text-xs text-muted-foreground"><span className="flex items-center gap-1.5">{selected.status === "Com a IA" ? <Bot className="size-3.5" /> : <UserRound className="size-3.5" />}{selected.status === "Com a IA" ? "Assistente IA" : selected.status === "Aguardando equipe" ? "Sem atendente" : "Pedro Henrique"}<span className="mx-1 text-border">/</span>{selected.team}</span><span className={`rounded-full px-2.5 py-1 ${selected.status === "Resolvido" ? "bg-success/10 text-success" : "bg-accent text-accent-foreground"}`}>{selected.status}</span></div>
            <div className="flex min-h-0 flex-1 flex-col-reverse overflow-y-auto px-5 py-6 lg:px-7">
              <div className="space-y-4"><div className="mb-6 text-center"><span className="rounded-full bg-secondary px-3 py-1 text-[11px] text-muted-foreground">Hoje</span></div>
                {selected.messages.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">Conversa iniciada com {selected.name}.</p>}
                {selected.messages.map((message, index) => message.author === "system" ? <div key={`${selected.id}-${index}`} className="py-2 text-center text-[11px] text-muted-foreground">{message.text}</div> : <div key={`${selected.id}-${index}`} className={`flex ${message.sent ? "justify-end" : "justify-start"}`}><div className={`max-w-[88%] rounded-2xl px-4 py-3 sm:max-w-[78%] ${message.sent ? "rounded-br-sm bg-accent text-foreground" : "rounded-bl-sm border border-border bg-card"}`}>{message.sent && <span className="mb-1.5 flex items-center gap-1 text-[10px] font-semibold text-accent-foreground">{message.author === "ai" ? <Bot className="size-3" /> : <UserRound className="size-3" />}{message.author === "ai" ? "Assistente IA" : "Pedro Henrique"}</span>}<p className="break-words text-sm leading-relaxed">{message.text}</p><div className="mt-1.5 flex items-center justify-end gap-1 text-[10px] text-muted-foreground">{message.time}{message.sent && <CheckCheck className="size-3 text-accent-foreground" />}</div></div></div>)}
              </div>
            </div>
            {canSendHumanMessage(selected.status) ? <form onSubmit={sendMessage} className="shrink-0 border-t border-border bg-card p-4"><div className="flex items-end gap-3 rounded-2xl border border-input bg-background p-2"><textarea aria-label="Mensagem" placeholder="Digite sua mensagem…" value={draft} onChange={(event) => setDraft(event.target.value)} rows={2} className="min-h-12 min-w-0 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none" /><Button type="submit" disabled={!draft.trim()} size="icon" className="mb-1 shrink-0 rounded-full" title="Enviar mensagem" aria-label="Enviar mensagem"><Send /></Button></div></form> : <div className="flex shrink-0 items-center gap-3 border-t border-border bg-card px-5 py-4"><span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">{selected.status === "Com a IA" ? <Bot className="size-4" /> : selected.status === "Resolvido" ? <CheckCircle2 className="size-4" /> : <Clock className="size-4" />}</span><div><p className="text-sm font-medium">{selected.status === "Com a IA" ? "Atendimento com a IA" : selected.status === "Aguardando equipe" ? "Aguardando um atendente" : "Atendimento encerrado"}</p><p className="mt-1 text-xs text-muted-foreground">{selected.status === "Com a IA" ? "Assuma a conversa para responder como atendente." : selected.status === "Aguardando equipe" ? "IA pausada · Na fila da equipe" : "Reabra a conversa para continuar."}</p></div></div>}
          </> : <div className="flex flex-1 flex-col items-center justify-center gap-3 text-muted-foreground"><MessageSquare className="size-10 text-primary" /><p className="text-sm">Selecione uma conversa</p></div>}
        </section>
      </div>
      {showNew && <div className="fixed inset-0 z-50 flex items-center justify-center bg-graphite/60 p-4" onClick={() => setShowNew(false)}><section role="dialog" aria-modal="true" aria-labelledby="new-title" className="w-full max-w-md rounded-2xl bg-card p-6 shadow-lg" onClick={(event) => event.stopPropagation()}><div className="mb-6 flex items-center justify-between"><h2 id="new-title" className="text-lg font-semibold">Novo atendimento</h2><Button variant="ghost" size="icon" aria-label="Fechar" onClick={() => setShowNew(false)}><X /></Button></div><form onSubmit={createConversation} className="space-y-4"><label className="block text-sm font-medium">Nome do contato<input required autoFocus value={newName} onChange={(event) => setNewName(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-ring" placeholder="Nome completo" /></label><label className="block text-sm font-medium">Telefone<input required type="tel" value={newPhone} onChange={(event) => setNewPhone(event.target.value)} className="mt-2 h-11 w-full rounded-xl border border-input bg-background px-3 outline-none focus:ring-2 focus:ring-ring" placeholder="(11) 99999-9999" /></label><div className="flex justify-end gap-2 pt-3"><Button type="button" variant="ghost" onClick={() => setShowNew(false)}>Cancelar</Button><Button type="submit" className="rounded-full"><Plus />Iniciar atendimento</Button></div></form></section></div>}
    </main>
  );
}