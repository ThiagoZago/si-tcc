# BarbApp

Aplicação de agendamento e gestão de barbearias, reconstruída em **Next.js 16, React 19 e TypeScript**, com interface em português, API integrada e SQLite persistente. A aplicação atual está na raiz; a primeira versão, em React e Python/Flask, está em `legacy/` apenas para consulta.

## Rodar localmente

Requer **Node.js 24+** e npm 11+. Não precisa de Python, MongoDB ou servidor de banco separado.

No Windows, execute **`dev.cmd`** na raiz. Ele confere o Node.js, instala as dependências quando necessário, cria o `.env.local` a partir do `.env.example` se ele não existir, inicia o servidor, aguarda as rotas responderem e abre o Chrome. Em outros sistemas:

```bash
npm ci
npm run dev
```

O endereço é <http://localhost:3000>. O banco é inicializado automaticamente em `data/barbapp.sqlite`. No desenvolvimento, a demonstração é criada automaticamente, a menos que `ENABLE_DEMO=false`. Na tela **Entrar**, selecione **Conhecer o painel de demonstração**. Dados e contatos dessa conta são fictícios e compartilhados.

Para configurar explicitamente o ambiente, copie `.env.example` para `.env.local`. `APP_URL` precisa corresponder ao endereço usado no navegador (incluindo protocolo e porta). A execução local sem `.env.local` aceita a origem do próprio servidor.

## Funcionalidades

- Página inicial, apresentação, central de ajuda, novidades, informações do projeto e páginas de termos e privacidade.
- Cadastro do responsável com criação do estabelecimento, login, logout, edição do perfil e alteração de senha com revogação das demais sessões.
- Agendamento sem conta de cliente: barbearia, serviço, profissional, data, horário, dados de contato e consentimento.
- Disponibilidade calculada por duração real, expediente da barbearia e do profissional, pausas, datas bloqueadas e reservas existentes.
- Proteção contra sobreposição por transação e gatilhos no banco, inclusive em requisições concorrentes.
- Link secreto por agendamento para consultar, cancelar ou remarcar antes do início. Download de evento `.ics` para o calendário.
- Painel com indicadores reais, faturamento semanal e mensal, serviços mais realizados e agenda do dia.
- Agenda com busca, filtro por data, profissional e status; confirmação, conclusão, cancelamento e registro de ausência.
- Clientes com contato, observações internas, visitas concluídas e total em serviços.
- Serviços com preço em centavos, duração, descrição e profissionais habilitados.
- Profissionais com disponibilidade semanal, pausas, datas bloqueadas e identificação por cor.
- Arquivamento de serviços e profissionais com preservação do histórico; reativação pela edição.
- Lista de espera com contato manual, controle de status e prevenção de duplicatas.
- Relatórios por serviço e profissional e exportação CSV protegida contra fórmulas.
- Layout responsivo, menu móvel, navegação por teclado, diálogos com foco controlado e suporte a movimento reduzido.

## Scripts

| Comando                | Função                                                               |
| ---------------------- | -------------------------------------------------------------------- |
| `npm run dev`          | Servidor de desenvolvimento                                          |
| `npm run build`        | Compilação de produção                                               |
| `npm start`            | Servidor de produção após a compilação                               |
| `npm run typecheck`    | Verificação estrita de TypeScript                                    |
| `npm run lint`         | ESLint com regras Next.js/React e zero avisos                        |
| `npm run format`       | Formatação com Prettier                                              |
| `npm run format:check` | Verificação da formatação, como na CI                                |
| `npm run check`        | TypeScript, lint e testes das regras de negócio                      |
| `npm test`             | Testes unitários de horários, segurança, validação e persistência    |
| `npm run test:e2e`     | Testes HTTP de integração, em banco separado na porta 3100           |
| `npm run db:init`      | Inicialização e migrações do banco, com as variáveis de `.env.local` |
| `npm run db:seed`      | Adicionar demonstração sem sobrescrever contas existentes            |

Os testes de integração iniciam e encerram seu próprio servidor. Cada execução usa um novo `data/e2e-<id>.sqlite`, apaga os bancos de execuções anteriores e usa a saída `.next-test`, sem alterar a base principal. Se a porta 3100 estiver ocupada, defina outra em `E2E_PORT` (por exemplo, `E2E_PORT=3110`). Execute as verificações e os testes de integração em sequência, pois o Next.js regenera seus arquivos de tipos. Não precisam instalar um navegador. A revisão da interface é feita separadamente no navegador.

## Arquitetura

O código segue camadas com fronteiras verificadas pelo ESLint e por `server-only`. A descrição completa, com diagrama, regras de dependência, mapa da API e guia de onde colocar código novo, está em [`docs/arquitetura.md`](docs/arquitetura.md).

```text
src/
  app/          Rotas: páginas, layouts e route handlers da API (uma pasta por recurso)
  features/     Telas e componentes por funcionalidade: site, auth, booking, dashboard
  components/   Componentes visuais reutilizáveis (ui/)
  lib/          Cliente HTTP usado pela interface
  server/       Back-end: banco, sessões, segurança, infraestrutura HTTP e regras por entidade
  shared/       Tipos, schemas Zod, formatação e cálculo de horários usados pelos dois lados
  styles/       CSS global dividido por área
  instrumentation.ts   Inicialização do banco na partida do servidor
  proxy.ts      Proteção das páginas privadas
scripts/        Inicialização do banco
tests/          Testes unitários (unit/) e de integração HTTP (e2e/)
public/         Imagens e fontes locais com licença
legacy/         Primeira versão (React, Flask e SQL), fora da compilação
docs/           Arquitetura e decisões de dependências
```

Preços são inteiros em centavos e a duração é armazenada em minutos. Cada atendimento preserva os dados informados na reserva e o nome, preço e duração do serviço no momento da criação. Alterar preços e cadastros não muda os valores históricos. Todos os horários de atendimento usam `America/Sao_Paulo`.

As sessões usam tokens opacos de 256 bits. O banco guarda apenas seus hashes, e o navegador recebe um cookie `HttpOnly` e `SameSite=Lax`. Com `APP_URL=https://...`, o cookie também é `Secure`. Cada operação privada consulta o estabelecimento do usuário autenticado; IDs enviados pelo cliente não permitem trocar de estabelecimento.

Os endpoints privados são agrupados em `/api/dashboard`; os públicos são `/api/auth`, `/api/businesses`, `/api/catalog/:businessId`, `/api/slots`, `/api/bookings`, `/api/waitlist` e `/api/manage/:token`. Respostas privadas e de gestão não são armazenadas em cache. Login, cadastro, alterações de senha e reservas têm limites de tentativas persistidos no SQLite.

## Produção

Use um servidor Node.js 24 com disco persistente, ou um contêiner com volume para `data/`. Defina `DATABASE_PATH` para o caminho persistente, `APP_URL` para a URL HTTPS real e **`ENABLE_DEMO=false`**. Depois execute:

```bash
npm ci
npm run build
npm start
```

Para produção, inicialize uma base nova sem a demonstração. Desativar `ENABLE_DEMO` remove o botão e o acesso rápido de demonstração, mas não apaga dados já criados. O SQLite local não é adequado a hospedagens com disco efêmero ou várias instâncias independentes. Para esses ambientes, a camada de persistência precisa ser adaptada a um banco compartilhado.

O operador deve definir sua identificação e procedimentos de privacidade nos textos institucionais antes de disponibilizar a instalação a clientes reais. Hospedagem, HTTPS e cópias de segurança são responsabilidades da instalação.

Também há um `Dockerfile` com usuário sem privilégios e um `compose.yaml` com volume persistente. Use `docker compose up --build -d` quando Docker estiver disponível. A configuração de CI em `.github/workflows/ci.yml` executa as verificações, os testes e a compilação. O contêiner e o workflow são fornecidos como configuração; sua execução depende dos ambientes Docker e GitHub Actions.

As decisões de compatibilidade e o override restrito da dependência de lint estão documentados em `docs/dependencias.md`.

## Escopo e migração

O faturamento é a soma dos valores dos serviços **concluídos**, sem processamento de pagamento ou despesas. WhatsApp abre uma conversa para contato manual. E-mail, SMS e Telegram automáticos, recuperação de senha por e-mail, pagamentos e verificação de telefone não estão integrados.

A base antiga era MongoDB, embora `legacy/database/estruturaDB.sql` descrevesse outra modelagem. Esta versão usa uma nova base SQLite; os dados antigos **não são importados automaticamente**. A versão anterior completa está em `legacy/` (veja `legacy/README.md`) e será removida. As rotas antigas `/inicio` e `/configuracao-*` redirecionam para o novo painel. Execute os comandos da raiz para usar a aplicação atual.

As imagens vêm do próprio repositório. A fonte DM Sans é servida localmente, com a licença em `public/fonts/OFL.txt`. A interface funciona sem chamadas externas para carregar imagens ou fontes.
