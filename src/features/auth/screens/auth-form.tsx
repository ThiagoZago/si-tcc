"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, Eye, EyeOff, Scissors, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";

export function AuthForm({
  register = false,
  demo = false,
}: {
  register?: boolean;
  demo?: boolean;
}) {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const form = new FormData(e.currentTarget);
    try {
      await api(`auth/${register ? "register" : "login"}`, {
        method: "POST",
        body: JSON.stringify({
          name: form.get("name"),
          businessName: form.get("businessName"),
          email: form.get("email"),
          password: form.get("password"),
          consent: form.get("consent") === "on",
        }),
      });
      toast.success(
        register
          ? "Bem-vindo ao BarbApp! Vamos configurar sua barbearia."
          : "Bom ter você de volta!",
      );
      router.push(register ? "/painel/configuracoes" : "/painel");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function openDemo() {
    setBusy(true);
    setError("");
    try {
      await api("auth/demo", { method: "POST" });
      router.push("/painel");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="auth-section">
      <div className="container auth-grid">
        <aside className="auth-brand">
          <span className="eyebrow">
            <span className="eyebrow-line" /> SUA BARBEARIA, EM BOAS MÃOS
          </span>
          <h1>
            {register ? (
              <>
                Um novo capítulo
                <br />
                para o seu
                <br />
                <em>negócio.</em>
              </>
            ) : (
              <>
                Mais controle.
                <br />
                Mais tranquilidade.
                <br />
                <em>Mais você.</em>
              </>
            )}
          </h1>
          <p>
            Da primeira reserva ao último atendimento.
            <br />O BarbApp acompanha seu dia inteiro.
          </p>
          <ul>
            <li>
              <Check size={17} /> Agenda organizada, sem sobreposição
            </li>
            <li>
              <Check size={17} /> Profissionais e serviços conectados
            </li>
            <li>
              <Check size={17} /> Clientes e resultados em um só lugar
            </li>
          </ul>
          <Scissors className="auth-decoration" size={150} strokeWidth={0.6} />
        </aside>
        <div className="auth-form-panel">
          <div className="eyebrow">{register ? "VAMOS COMEÇAR" : "BEM-VINDO DE VOLTA"}</div>
          <h2>{register ? "Crie sua conta" : "Acesse sua barbearia"}</h2>
          <p>
            {register
              ? "Dê o primeiro passo para uma rotina mais simples."
              : "Entre para cuidar da sua agenda e do seu negócio."}
          </p>
          <form onSubmit={submit} className="form-stack">
            <ErrorMessage message={error} />
            {register && (
              <>
                <label>
                  Seu nome
                  <input
                    name="name"
                    placeholder="Como podemos chamar você?"
                    autoComplete="name"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </label>
                <label>
                  Nome da barbearia
                  <input
                    name="businessName"
                    placeholder="O nome do seu negócio"
                    minLength={2}
                    maxLength={100}
                    required
                  />
                </label>
              </>
            )}
            <label>
              E-mail
              <input
                name="email"
                type="email"
                placeholder="voce@exemplo.com"
                autoComplete="email"
                maxLength={254}
                required
              />
            </label>
            <label>
              Senha
              <div className="password-input">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={register ? "Pelo menos 10 caracteres" : "Sua senha"}
                  autoComplete={register ? "new-password" : "current-password"}
                  minLength={register ? 10 : 1}
                  maxLength={128}
                  required
                />
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {register && <small>Use pelo menos uma letra e um número.</small>}
            </label>
            {register && (
              <label className="checkbox-label">
                <input type="checkbox" name="consent" required />
                <span>
                  Li os{" "}
                  <Link href="/termos" target="_blank">
                    termos de uso
                  </Link>{" "}
                  e a{" "}
                  <Link href="/privacidade" target="_blank">
                    política de privacidade
                  </Link>
                  .
                </span>
              </label>
            )}
            <Button type="submit" loading={busy} className="full-width">
              {register ? "Criar minha conta" : "Entrar na minha conta"}
              <ArrowRight size={18} />
            </Button>
          </form>
          {demo && !register && (
            <>
              <div className="or-divider">
                <span>ou explore antes de começar</span>
              </div>
              <Button variant="secondary" className="full-width" onClick={openDemo} loading={busy}>
                <Sparkles size={17} /> Conhecer o painel de demonstração
              </Button>
              <p className="demo-note">
                Dados fictícios para você experimentar as funcionalidades.
              </p>
            </>
          )}
          <p className="auth-bottom">
            {register ? "Já tem uma conta?" : "Ainda não usa o BarbApp?"}{" "}
            <Link href={register ? "/acesso" : "/registro"}>
              {register ? "Entrar" : "Criar conta"} <ArrowUpRightSmall />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
function ArrowUpRightSmall() {
  return <ArrowRight size={14} />;
}
