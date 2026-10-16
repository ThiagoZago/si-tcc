"use client";
import { useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  Users,
  Scissors,
  UserRound,
  ChartNoAxesCombined,
  Settings2,
  LogOut,
  ArrowUpRight,
  Menu,
  X,
  Clock3,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/ui/logo";
import { useDashboard } from "@/features/dashboard/context";
import { initials, displayDate, localDate } from "@/shared/format";
import { api } from "@/lib/api-client";

const links = [
  { href: "/painel", label: "Visão geral", icon: LayoutDashboard },
  { href: "/painel/agenda", label: "Agenda", icon: CalendarDays },
  { href: "/painel/clientes", label: "Clientes", icon: Users },
  { href: "/painel/servicos", label: "Serviços", icon: Scissors },
  { href: "/painel/profissionais", label: "Profissionais", icon: UserRound },
  { href: "/painel/relatorios", label: "Relatórios", icon: ChartNoAxesCombined },
  { href: "/painel/lista-espera", label: "Lista de espera", icon: Clock3 },
];
export function DashboardShell({ children }: { children: ReactNode }) {
  const { data } = useDashboard();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  async function logout() {
    setLoggingOut(true);
    try {
      await api("auth/logout", { method: "POST" });
      router.push("/acesso");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
      setLoggingOut(false);
    }
  }
  const title =
    [...links, { href: "/painel/configuracoes", label: "Configurações" }].find(
      (l) => l.href === pathname,
    )?.label || "Painel";
  return (
    <div className="dashboard-shell">
      {open && (
        <button
          className="sidebar-backdrop"
          onClick={() => setOpen(false)}
          aria-label="Fechar menu"
        />
      )}
      <aside id="dashboard-navigation" className={`sidebar ${open ? "sidebar-open" : ""}`}>
        <div className="sidebar-brand">
          <Logo light />
          <button
            className="icon-btn mobile-toggle"
            onClick={() => setOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="workspace-switch">
          <span className="workspace-mark">
            <Scissors size={21} />
          </span>
          <div>
            <strong>{data.business.name}</strong>
            <small>Minha barbearia</small>
          </div>
          <ChevronDown size={16} />
        </div>
        <span className="sidebar-label">SEU DIA A DIA</span>
        <nav aria-label="Navegação do painel">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              <l.icon size={19} strokeWidth={1.6} />
              {l.label}
              {l.href.endsWith("lista-espera") &&
                data.waitlist.filter((w) => w.status === "waiting").length > 0 && (
                  <span className="nav-count">
                    {data.waitlist.filter((w) => w.status === "waiting").length}
                  </span>
                )}
            </Link>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <Link
            className={pathname === "/painel/configuracoes" ? "active" : ""}
            href="/painel/configuracoes"
            onClick={() => setOpen(false)}
          >
            <Settings2 size={19} />
            Configurações
          </Link>
          <Link href="/ajuda" target="_blank">
            <span className="help-icon">?</span>Central de ajuda
            <ArrowUpRight size={15} />
          </Link>
          <div className="sidebar-user">
            <span className="avatar">{initials(data.user.name)}</span>
            <div>
              <strong>{data.user.name}</strong>
              <small>Administrador</small>
            </div>
            <button
              className="icon-btn"
              onClick={logout}
              disabled={loggingOut}
              aria-label="Sair da conta"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
      <div className="dashboard-body">
        <header className="dashboard-header">
          <div>
            <button
              className="icon-btn mobile-toggle"
              onClick={() => setOpen(true)}
              aria-label="Abrir menu"
              aria-expanded={open}
              aria-controls="dashboard-navigation"
            >
              <Menu size={22} />
            </button>
            <span className="breadcrumb">
              Meu espaço <span>/</span> <strong>{title}</strong>
            </span>
          </div>
          <div>
            <span className="header-date">
              <CalendarDays size={16} />
              {displayDate(localDate(), { day: "numeric", month: "long" })}
            </span>
            <span className="header-separator" />
            <Link href="/painel/configuracoes" className="avatar" aria-label="Minha conta">
              {initials(data.user.name)}
            </Link>
          </div>
        </header>
        {data.user.email === "demo@barbapp.local" && (
          <div className="demo-banner">
            <span className="live-dot" />
            <span>Você está explorando uma demonstração com dados fictícios.</span>
            <Link
              href="/registro"
              onClick={(e) => {
                e.preventDefault();
                void logout();
              }}
            >
              Sair da demonstração <ArrowUpRight size={14} />
            </Link>
          </div>
        )}
        <main id="main" className="dashboard-main">
          {children}
        </main>
        <footer className="dashboard-footer">
          <span>BarbApp · Um bom dia começa com uma boa agenda.</span>
          <span>Horário de Brasília</span>
        </footer>
      </div>
    </div>
  );
}
