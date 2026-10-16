"use client";
import { useState, useEffect, useRef, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Clock3,
  MapPin,
  Scissors,
  Search,
  ShieldCheck,
  CalendarDays,
  Users,
  LoaderCircle,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api-client";
import { money, displayDate, addDays, localDate, initials } from "@/shared/format";
import type { Business, Catalog } from "@/shared/types";
import { Button } from "@/components/ui/button";
import { ErrorMessage } from "@/components/ui/error-message";
import { EmptyState } from "@/components/ui/empty-state";

export function BookingFlow({
  businesses,
  initialBusiness,
}: {
  businesses: Business[];
  initialBusiness?: string;
}) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [search, setSearch] = useState("");
  const [businessId, setBusiness] = useState(
    initialBusiness && businesses.some((b) => b.id === initialBusiness) ? initialBusiness : "",
  );
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [catalogError, setCatalogError] = useState("");
  const [serviceId, setService] = useState("");
  const [professionalId, setProfessional] = useState("");
  const [date, setDate] = useState(addDays(localDate(), 1));
  const [time, setTime] = useState("");
  const [wait, setWait] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const panelRef = useRef<HTMLDivElement>(null);
  const previousStep = useRef(0);
  const [contact, setContact] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
    consent: false,
  });
  useEffect(() => {
    if (previousStep.current !== step) {
      panelRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
      previousStep.current = step;
    }
  }, [step]);
  const [slotResult, setSlotResult] = useState<{ key: string; slots: string[]; error: string }>({
    key: "",
    slots: [],
    error: "",
  });
  const key = `${businessId}/${professionalId}/${serviceId}/${date}`;
  useEffect(() => {
    if (!businessId) return;
    const controller = new AbortController();
    api<Catalog>(`catalog/${businessId}`, { signal: controller.signal })
      .then((data) => {
        setCatalog(data);
        setCatalogError("");
      })
      .catch((err) => {
        if (err.name !== "AbortError") setCatalogError(err.message);
      });
    return () => controller.abort();
  }, [businessId]);
  useEffect(() => {
    if (!businessId || !professionalId || !serviceId || !date) return;
    const controller = new AbortController();
    api<{ slots: string[] }>(
      `slots?${new URLSearchParams({ businessId, professionalId, serviceId, date })}`,
      { signal: controller.signal },
    )
      .then((data) => setSlotResult({ key, slots: data.slots, error: "" }))
      .catch((err) => {
        if (err.name !== "AbortError") setSlotResult({ key, slots: [], error: err.message });
      });
    return () => controller.abort();
  }, [businessId, professionalId, serviceId, date, key, step]);
  const readyCatalog = catalog?.business.id === businessId ? catalog : null;
  const business = businesses.find((b) => b.id === businessId);
  const service = readyCatalog?.services.find((s) => s.id === serviceId);
  const professional = readyCatalog?.professionals.find((p) => p.id === professionalId);
  const slotsLoading = slotResult.key !== key;
  const slots = slotsLoading ? [] : slotResult.slots;
  function selectBusiness(id: string) {
    setBusiness(id);
    setService("");
    setProfessional("");
    setTime("");
    setWait(false);
    setCatalogError("");
  }
  function selectService(id: string) {
    setService(id);
    setProfessional("");
    setTime("");
    setWait(false);
  }
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    setContact({
      name: String(form.get("name") || ""),
      phone: String(form.get("phone") || ""),
      email: String(form.get("email") || ""),
      notes: String(form.get("notes") || ""),
      consent: form.get("consent") === "on",
    });
    setBusy(true);
    setError("");
    try {
      const result = await api<{ manageToken: string; message: string }>(
        wait ? "waitlist" : "bookings",
        {
          method: "POST",
          body: JSON.stringify({
            businessId,
            serviceId,
            professionalId,
            date,
            time,
            customerName: form.get("name"),
            customerPhone: form.get("phone"),
            customerEmail: form.get("email") || "",
            notes: form.get("notes") || "",
            consent: form.get("consent") === "on",
          }),
        },
      );
      if (wait) {
        toast.success(result.message, { duration: 8000 });
        setStep(2);
        setWait(false);
      } else {
        router.push(`/agendamento/${result.manageToken}`);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }
  const canNext =
    step === 0
      ? !!serviceId
      : step === 1
        ? !!professionalId
        : !!time && slots.includes(time) && !slotsLoading;
  return (
    <section className="booking-section">
      <div className="container">
        <div className="booking-heading">
          <div className="eyebrow">TEM UM MOMENTO SEU AQUI</div>
          <h1>
            Seu próximo horário.
            <br />
            <em>Do seu jeito.</em>
          </h1>
          <p>Escolha seu lugar, seu profissional e o melhor momento.</p>
        </div>
        <div className="booking-layout">
          <div className="booking-main" ref={panelRef}>
            <ol className="booking-progress">
              {["Local e serviço", "Profissional", "Data e horário", "Seus dados"].map((s, i) => (
                <li
                  aria-current={i === step ? "step" : undefined}
                  className={i === step ? "current" : i < step ? "done" : ""}
                  key={s}
                >
                  <span>{i < step ? <Check size={15} /> : i + 1}</span>
                  <small>{s}</small>
                </li>
              ))}
            </ol>
            <div className="booking-panel" key={step}>
              {step === 0 && (
                <>
                  <h2>Onde vamos cuidar do seu estilo?</h2>
                  <p>Encontre uma barbearia e escolha seu serviço.</p>
                  <div className="search-input">
                    <Search size={18} />
                    <input
                      aria-label="Buscar barbearia"
                      placeholder="Busque por nome ou cidade…"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                  </div>
                  <div className="business-options">
                    {businesses
                      .filter((b) =>
                        `${b.name} ${b.city}`.toLowerCase().includes(search.toLowerCase()),
                      )
                      .map((b) => (
                        <button
                          className={`business-option ${b.id === businessId ? "selected" : ""}`}
                          onClick={() => selectBusiness(b.id)}
                          key={b.id}
                        >
                          <span className="business-avatar">
                            <Scissors size={24} />
                          </span>
                          <span>
                            <strong>{b.name}</strong>
                            <small>
                              <MapPin size={13} />
                              {b.city || "Endereço em atualização"}
                            </small>
                          </span>
                          <span className="option-radio">
                            {b.id === businessId && <Check size={13} />}
                          </span>
                        </button>
                      ))}
                  </div>
                  {businesses.length === 0 && (
                    <EmptyState
                      title="As primeiras barbearias estão chegando"
                      description="Tem uma barbearia? Cadastre seu negócio para receber agendamentos."
                      action={
                        <Link href="/registro" className="btn btn-primary">
                          Cadastrar minha barbearia
                        </Link>
                      }
                    />
                  )}
                  {businesses.length > 0 &&
                    !businesses.some((b) =>
                      `${b.name} ${b.city}`.toLowerCase().includes(search.toLowerCase()),
                    ) && (
                      <EmptyState
                        title="Nenhuma barbearia encontrada"
                        description="Tente outro nome ou cidade."
                      />
                    )}
                  <ErrorMessage message={catalogError} />
                  {businessId && !readyCatalog && !catalogError && (
                    <p className="inline-loading">
                      <LoaderCircle className="spin" size={18} />
                      Carregando serviços…
                    </p>
                  )}
                  {readyCatalog && (
                    <>
                      <h3 className="field-section-title">Qual serviço você procura?</h3>
                      <div className="service-options">
                        {readyCatalog.services.map((s) => (
                          <button
                            className={`service-option ${s.id === serviceId ? "selected" : ""}`}
                            key={s.id}
                            onClick={() => selectService(s.id)}
                          >
                            <div>
                              <strong>{s.name}</strong>
                              <span>{s.description}</span>
                              <small>
                                <Clock3 size={13} />
                                {s.duration} min
                              </small>
                            </div>
                            <div>
                              <b>{money(s.price)}</b>
                              <span className="option-radio">
                                {s.id === serviceId && <Check size={13} />}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                      {!readyCatalog.services.length && (
                        <EmptyState
                          title="Serviços ainda não disponíveis"
                          description="Essa barbearia está configurando sua agenda. Escolha outro estabelecimento."
                        />
                      )}
                    </>
                  )}
                </>
              )}
              {step === 1 && (
                <>
                  <h2>Nas mãos de quem?</h2>
                  <p>Escolha o profissional para o seu atendimento.</p>
                  <div className="professional-options">
                    {readyCatalog?.professionals
                      .filter((p) => service?.professionalIds.includes(p.id))
                      .map((p) => (
                        <button
                          className={`professional-option ${p.id === professionalId ? "selected" : ""}`}
                          key={p.id}
                          onClick={() => {
                            setProfessional(p.id);
                            setTime("");
                          }}
                        >
                          <span
                            className="avatar avatar-lg"
                            style={{ background: `${p.color}16`, color: p.color }}
                          >
                            {initials(p.name)}
                          </span>
                          <strong>{p.name}</strong>
                          <small>{p.role}</small>
                          <p>{p.bio}</p>
                          <span className="option-radio">
                            {p.id === professionalId && <Check size={13} />}
                          </span>
                        </button>
                      ))}
                  </div>
                  {readyCatalog &&
                    !readyCatalog.professionals.some((p) =>
                      service?.professionalIds.includes(p.id),
                    ) && (
                      <EmptyState
                        title="Sem profissionais disponíveis"
                        description="Escolha outro serviço ou entre em contato com a barbearia."
                      />
                    )}
                </>
              )}
              {step === 2 && (
                <>
                  <h2>Quando fica melhor para você?</h2>
                  <p>Os horários consideram o expediente e a agenda do profissional.</p>
                  <div className="date-options">
                    {Array.from({ length: 7 }, (_, i) => addDays(localDate(), i)).map((d) => {
                      const weekday = new Date(`${d}T12:00:00Z`).getUTCDay();
                      const disabled =
                        !professional?.availability[weekday]?.active ||
                        !business?.hours[weekday]?.active ||
                        professional.exceptions.includes(d);
                      return (
                        <button
                          key={d}
                          disabled={disabled}
                          className={date === d ? "selected" : ""}
                          onClick={() => {
                            setDate(d);
                            setTime("");
                          }}
                        >
                          <small>{displayDate(d, { weekday: "short" }).replace(".", "")}</small>
                          <strong>{d.slice(8)}</strong>
                          <small>{displayDate(d, { month: "short" }).replace(".", "")}</small>
                        </button>
                      );
                    })}
                  </div>
                  <label className="alternate-date">
                    Outra data
                    <input
                      type="date"
                      value={date}
                      min={localDate()}
                      max={addDays(localDate(), 90)}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setTime("");
                      }}
                    />
                  </label>
                  <h3 className="field-section-title">
                    Horários disponíveis <span>· {displayDate(date)}</span>
                  </h3>
                  {!date ? (
                    <p>Escolha uma data para consultar os horários.</p>
                  ) : slotsLoading ? (
                    <p className="inline-loading">
                      <LoaderCircle className="spin" size={18} />
                      Consultando a agenda…
                    </p>
                  ) : slotResult.error ? (
                    <ErrorMessage message={slotResult.error} />
                  ) : slots.length > 0 ? (
                    <div className="time-options">
                      {slots.map((s) => (
                        <button
                          className={time === s ? "selected" : ""}
                          key={s}
                          onClick={() => {
                            setTime(s);
                            setWait(false);
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <EmptyState
                      title="A agenda está cheia por aqui"
                      description="Escolha outra data ou entre na lista de espera. A barbearia poderá avisar se surgir uma vaga."
                      action={
                        <Button
                          variant="secondary"
                          onClick={() => {
                            setWait(true);
                            setStep(3);
                          }}
                        >
                          Entrar na lista de espera
                        </Button>
                      }
                    />
                  )}
                  <div className="notice">
                    <Clock3 size={16} /> Todos os horários seguem o fuso de Brasília.
                  </div>
                </>
              )}
              {step === 3 && (
                <>
                  <div className="booking-inline-summary">
                    <strong>{business?.name}</strong>
                    <span>
                      {service?.name} · {professional?.name}
                    </span>
                    <span>
                      {displayDate(date)}
                      {!wait && `, às ${time}`} · {service ? money(service.price) : ""}
                    </span>
                  </div>
                  <h2>{wait ? "Vamos guardar seu interesse." : "Só falta conhecer você."}</h2>
                  <p>
                    {wait
                      ? "A barbearia poderá entrar em contato se surgir uma vaga."
                      : "Seus dados serão usados para organizar o atendimento."}
                  </p>
                  <form onSubmit={submit} className="form-stack">
                    <ErrorMessage message={error} />
                    <div className="form-grid">
                      <label>
                        Seu nome
                        <input
                          name="name"
                          defaultValue={contact.name}
                          autoComplete="name"
                          placeholder="Nome e sobrenome"
                          minLength={2}
                          maxLength={100}
                          required
                        />
                      </label>
                      <label>
                        Telefone com DDD
                        <input
                          name="phone"
                          defaultValue={contact.phone}
                          autoComplete="tel-national"
                          inputMode="tel"
                          type="tel"
                          placeholder="(11) 99999-9999"
                          maxLength={20}
                          required
                        />
                      </label>
                    </div>
                    {!wait && (
                      <>
                        <label>
                          E-mail <small>(opcional)</small>
                          <input
                            name="email"
                            defaultValue={contact.email}
                            autoComplete="email"
                            type="email"
                            placeholder="voce@exemplo.com"
                            maxLength={254}
                          />
                        </label>
                        <label>
                          Quer deixar uma observação? <small>(opcional)</small>
                          <textarea
                            name="notes"
                            defaultValue={contact.notes}
                            placeholder="Algo que seu profissional deveria saber…"
                            rows={3}
                            maxLength={500}
                          />
                        </label>
                      </>
                    )}
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="consent"
                        defaultChecked={contact.consent}
                        required
                      />
                      <span>
                        Concordo com o uso dos meus dados para o atendimento, conforme a{" "}
                        <Link href="/privacidade" target="_blank">
                          política de privacidade
                        </Link>
                        .
                      </span>
                    </label>
                    <div className="booking-buttons">
                      <Button type="button" variant="ghost" onClick={() => setStep(2)}>
                        <ArrowLeft size={16} /> Voltar
                      </Button>
                      <Button type="submit" loading={busy}>
                        {wait ? "Entrar na lista de espera" : "Confirmar agendamento"}
                        <Check size={17} />
                      </Button>
                    </div>
                  </form>
                </>
              )}
              {step < 3 && (
                <div className="booking-buttons">
                  <Button
                    variant="ghost"
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={step === 0}
                  >
                    <ArrowLeft size={16} /> Voltar
                  </Button>
                  <Button
                    onClick={() => {
                      setError("");
                      setStep(step + 1);
                    }}
                    disabled={!canNext}
                  >
                    Continuar <ArrowRight size={17} />
                  </Button>
                </div>
              )}
            </div>
          </div>
          <aside className="booking-summary">
            <div className="eyebrow">SEU MOMENTO</div>
            <h3>Resumo da reserva</h3>
            <div className="summary-business">
              <span className="business-avatar">
                <Scissors size={23} />
              </span>
              <div>
                <strong>{business?.name || "Sua barbearia"}</strong>
                <small>{business?.city || "Escolha onde quer ser atendido"}</small>
              </div>
            </div>
            <ul>
              <li>
                <Scissors size={17} />
                <span>
                  Serviço<strong>{service?.name || "Ainda não selecionado"}</strong>
                </span>
              </li>
              <li>
                <Users size={17} />
                <span>
                  Profissional<strong>{professional?.name || "Ainda não selecionado"}</strong>
                </span>
              </li>
              <li>
                <CalendarDays size={17} />
                <span>
                  Data e horário
                  <strong>
                    {step >= 2
                      ? `${displayDate(date)}${time ? `, às ${time}` : ""}`
                      : "Ainda não selecionado"}
                  </strong>
                </span>
              </li>
              <li>
                <Clock3 size={17} />
                <span>
                  Duração<strong>{service ? `${service.duration} minutos` : "—"}</strong>
                </span>
              </li>
            </ul>
            <div className="summary-total">
              <span>{wait ? "Valor do serviço" : "Total do serviço"}</span>
              <strong>{service ? money(service.price) : "—"}</strong>
            </div>
            <small className="summary-payment">O pagamento é combinado com a barbearia.</small>
            <div className="summary-safe">
              <ShieldCheck size={19} />
              <span>
                Seus dados são usados apenas
                <br />
                para cuidar do seu atendimento.
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
