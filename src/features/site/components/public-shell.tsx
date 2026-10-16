"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, Menu, X, ArrowRight } from "lucide-react";
import { Logo } from "@/components/ui/logo";

export function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const links = [
    { href: "/", label: "Início" },
    { href: "/sobre-nos", label: "Sobre o BarbApp" },
    { href: "/ajuda", label: "Central de ajuda" },
  ];
  return (
    <header className="public-header">
      <div className="container header-inner">
        <Logo />
        <nav
          className={open ? "public-nav mobile-open" : "public-nav"}
          aria-label="Navegação principal"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={pathname === l.href ? "active" : ""}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <span className="nav-divider" />
          <Link href="/acesso" onClick={() => setOpen(false)}>
            Entrar
          </Link>
          <Link href="/agendar" className="btn btn-primary" onClick={() => setOpen(false)}>
            Agendar horário <ArrowUpRight size={17} />
          </Link>
        </nav>
        <button
          className="icon-btn mobile-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Fechar menu" : "Abrir menu"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="container">
        <div className="footer-main">
          <div>
            <Logo light />
            <p>
              Mais tempo para o que você
              <br />
              faz de melhor.
            </p>
          </div>
          <div>
            <h4>Explore</h4>
            <Link href="/agendar">Agendar um horário</Link>
            <Link href="/registro">Cadastrar minha barbearia</Link>
            <Link href="/acesso">Acessar meu painel</Link>
          </div>
          <div>
            <h4>BarbApp</h4>
            <Link href="/sobre-nos">Sobre nós</Link>
            <Link href="/novidades">Novidades</Link>
            <Link href="/desenvolvedores">O projeto</Link>
          </div>
          <div>
            <h4>Vamos simplificar?</h4>
            <p>Seu próximo horário começa aqui.</p>
            <Link className="footer-cta" href="/agendar">
              Encontre sua barbearia <ArrowRight size={16} />
            </Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} BarbApp. Feito para cuidar do seu tempo.</span>
          <div>
            <Link href="/privacidade">Privacidade</Link>
            <Link href="/termos">Termos de uso</Link>
          </div>
          <span className="footer-country">🇧🇷 Feito no Brasil</span>
        </div>
      </div>
    </footer>
  );
}
