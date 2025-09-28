import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function UserHistory() {
  const [filtro, setFiltro] = useState("todos");
  const [ordenar, setOrdenar] = useState("desc");
  const [data, setData] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  const [cliente, setCliente] = useState("");
  const [telefone, setTelefone] = useState("");
  const [profissional, setProfissional] = useState("");
  const [servico, setServico] = useState("");

  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(false);


  // Paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const agendamentosPorPagina = 7;
  const isFirstRender = useRef(true);

  const fetchAgendamentos = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const params = {
        tipo: filtro,
        ordenar,
      };

      if (data) params.data = data;
      if (dataInicio) params.data_inicio = dataInicio;
      if (dataFim) params.data_fim = dataFim;
      if (cliente) params.cliente = cliente;
      if (telefone) params.telefone = telefone;
      if (profissional) params.profissional = profissional;
      if (servico) params.servico = servico;

      const response = await axios.get("http://127.0.0.1:5000/agendamentos", {
        headers: { Authorization: `Bearer ${token}` },
        params,
      });

      setAgendamentos(response.data.agendamentos || []);
       if (!isFirstRender.current && response.data.msg) {
            if (response.data.msg && response.data.agendamentos.length > 0) {
                toast.info(response.data.msg, { position: "top-right" });
            }
            if (response.data.msg && response.data.agendamentos.length === 0) {
                toast.warning(response.data.msg, { position: "top-right" });
            }
        }
      isFirstRender.current = false;
      setPaginaAtual(1);
    } catch (error) {
      toast.error(error.response?.data?.msg || "Erro ao carregar agendamentos.", {
        position: "top-right",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgendamentos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtro, ordenar]);

  // Calcular agendamentos da página atual
  const indiceUltimo = paginaAtual * agendamentosPorPagina;
  const indicePrimeiro = indiceUltimo - agendamentosPorPagina;
  const agendamentosPagina = agendamentos.slice(indicePrimeiro, indiceUltimo);

  const totalPaginas = Math.ceil(agendamentos.length / agendamentosPorPagina);

  const formatarData = (dataStr) => {
  if (!dataStr) return "";
  const [ano, mes, dia] = dataStr.split("-");
  return `${dia}/${mes}/${ano}`;
  };

  const getCardClass = (agendamentos) => {
    const hoje = new Date();
    const dataAgendamento = new Date(agendamentos.data);

    if (dataAgendamento < hoje) {
        return "border-secondary bg-light"; // passado
    }

    if (agendamentos.confirmado) {
        return "border-success bg-success bg-opacity-10"; // futuro confirmado
    }

    return "border-warning bg-warning bg-opacity-10"; // futuro não confirmado
  };


  return (
    <div className="tab-pane fade show active">
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="mb-0">
                Meus Agendamentos
                <span className="badge bg-light text-dark border ms-3 fs-6">Passados</span>
                <span className="badge bg-warning border ms-2 fs-6">Futuro não confirmado</span>
                <span className="badge bg-success border ms-2 fs-6">Futuro confirmado</span>
            </h4>
            <button
                className="btn btn-outline-secondary"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#filtrosCollapse"
                aria-expanded="false"
                aria-controls="filtrosCollapse"
            >
                Filtros
            </button>
        </div>


        {/* Collapse dos Filtros */}
        <div className="collapse mb-4" id="filtrosCollapse">
          <div className="card p-3 shadow-sm">
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Tipo</label>
                <select
                  className="form-select"
                  value={filtro}
                  onChange={(e) => setFiltro(e.target.value)}
                >
                  <option value="futuros">Futuros</option>
                  <option value="passados">Passados</option>
                  <option value="todos">Todos</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Ordenar</label>
                <select
                  className="form-select"
                  value={ordenar}
                  onChange={(e) => setOrdenar(e.target.value)}
                >
                  <option value="asc">Mais antigos acima</option>
                  <option value="desc">Mais recentes acima</option>
                </select>
              </div>

              <div className="col-md-3">
                <label className="form-label">Data Exata</label>
                <input
                  type="date"
                  className="form-control"
                  value={data}
                  onChange={(e) => setData(e.target.value)}
                />
              </div>

              {/* Intervalo de datas */}
              <div className="col-md-6">
                <div className="row g-2">
                  <div className="col-md-6">
                    <label className="form-label">Data Início</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dataInicio}
                      onChange={(e) => setDataInicio(e.target.value)}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Data Fim</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dataFim}
                      onChange={(e) => setDataFim(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <label className="form-label">Cliente</label>
                <input
                  type="text"
                  className="form-control"
                  value={cliente}
                  onChange={(e) => setCliente(e.target.value)}
                  placeholder="Nome do cliente"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Telefone</label>
                <input
                  type="text"
                  className="form-control"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  placeholder="Telefone"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Profissional</label>
                <input
                  type="text"
                  className="form-control"
                  value={profissional}
                  onChange={(e) => setProfissional(e.target.value)}
                  placeholder="Nome do profissional"
                />
              </div>

              <div className="col-md-3">
                <label className="form-label">Serviço</label>
                <input
                  type="text"
                  className="form-control"
                  value={servico}
                  onChange={(e) => setServico(e.target.value)}
                  placeholder="Nome do serviço"
                />
              </div>
            </div>

            <div className="text-end mt-3">
              <button
                className="btn btn-primary"
                onClick={fetchAgendamentos}
                disabled={loading}
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  />
                ) : null}
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Agendamentos */}
        {loading ? (
          <div className="d-flex justify-content-center my-5">
            <div className="spinner-border text-danger" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
          </div>
        ) : (
          <>
            {agendamentosPagina.length > 0 ? (
              agendamentosPagina.map((agendamento, index) => (
                <div key={index} className={`card mb-3 shadow-sm ${getCardClass(agendamento)}`}>
                  <div className="card-header d-flex justify-content-between align-items-center bg-light">
                    <span>
                      <i className="bi bi-calendar-event me-2"></i>
                      {formatarData(agendamento.data)}
                    </span>
                    <span>
                      <i className="bi bi-clock me-2"></i>
                      {agendamento.hora}
                    </span>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{agendamento.service}</h5>
                    <p className="card-text mb-1">
                      <strong>Cliente:</strong> {agendamento.nome}
                    </p>
                    <p className="card-text mb-1">
                      <strong>Profissional:</strong> {agendamento.professional}
                    </p>
                    <p className="card-text">
                      <strong>Telefone:</strong>{" "}
                      <a href={`tel:${agendamento.telefone}`}>
                        {agendamento.telefone}
                      </a>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted mt-4">
                Nenhum agendamento encontrado.
              </p>
            )}

            {/* Paginação */}
            {totalPaginas > 1 && (
              <div className="d-flex justify-content-center align-items-center mt-3 gap-3">
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => setPaginaAtual((prev) => Math.max(prev - 1, 1))}
                  disabled={paginaAtual === 1}
                >
                  <i className="bi bi-chevron-left"></i>
                </button>
                <span>
                  {paginaAtual} / {totalPaginas}
                </span>
                <button
                  className="btn btn-outline-danger btn-sm"
                  onClick={() =>
                    setPaginaAtual((prev) => Math.min(prev + 1, totalPaginas))
                  }
                  disabled={paginaAtual === totalPaginas}
                >
                  <i className="bi bi-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );

}

export default UserHistory;
