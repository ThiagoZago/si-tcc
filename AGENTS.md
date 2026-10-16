# Instruções do projeto

## Acesso SSH via jump

"via jump" = skill capybara-ssh-jump: sessão "jump" do codex-ssh-terminal-mcp, depois `ssh <IP>` de dentro dela. Nunca ProxyJump, nunca ssh local, nunca segredo no chat.

## Aplicação

A aplicação atual fica na raiz, em `src/`, com Next.js, React e TypeScript. `legacy/` guarda a primeira versão (React, Flask e SQL) só para consulta: não altere nem importe nada de lá. Use Node.js 24 ou superior. Execute `npm run check` e `npm run build` após alterações; `npm run test:e2e` testa a API em banco isolado na porta 3100 (use `E2E_PORT` se ela estiver ocupada).

## Arquitetura

Siga as camadas descritas em `docs/arquitetura.md`:

- `src/app` só compõe: páginas renderizam telas de `src/features`; route handlers em `src/app/api/<recurso>/route.ts` usam `publicRoute` ou `privateRoute` de `src/server/http/handler.ts`.
- O banco é aberto e migrado uma única vez por `src/instrumentation.ts`; não chame `initialize()` em rotas, páginas ou módulos.
- Regras de negócio e SQL ficam em `src/server/modules/<entidade>.ts`. Todo arquivo em `src/server` começa com `import "server-only"`.
- A interface (`src/features`, `src/components`, `src/lib`) nunca importa `src/server`; conversa com o servidor por `src/lib/api-client.ts`.
- `src/shared` contém apenas código isomórfico (tipos, schemas Zod, formatação, cálculo de horários), sem `node:*` nem `next/*`.
- Alterações no banco entram como nova migração em `src/server/db/schema.ts`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
