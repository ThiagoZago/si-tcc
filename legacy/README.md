# Legado

Esta pasta guarda a primeira versão do BarbApp apenas para consulta. Ela **não faz parte da aplicação atual** e será removida. Nada aqui é instalado, compilado, verificado ou empacotado pela raiz do projeto.

| Pasta       | Conteúdo                                                                      |
| ----------- | ----------------------------------------------------------------------------- |
| `frontend/` | Interface em React 18 criada com Create React App, React Router e Axios       |
| `backend/`  | API em Python com Flask, PyMongo, JWT, CORS e Flask-Limiter                   |
| `database/` | `estruturaDB.sql`, modelagem relacional inicial que não chegou a ser aplicada |

## Correspondência com a versão atual

| Versão antiga                                        | Versão atual                                              |
| ---------------------------------------------------- | --------------------------------------------------------- |
| React (CRA) em `frontend/src/components/pages`       | Páginas do Next.js em `src/app` e telas em `src/features` |
| Flask em `backend/app/routes` e `controllers`        | Route handlers em `src/app/api` e regras em `src/server`  |
| MongoDB via `MONGO_CONECTION`                        | SQLite nativo do Node.js em `data/barbapp.sqlite`         |
| JWT no `localStorage`                                | Sessão opaca em cookie `HttpOnly`                         |
| `/inicio` e `/configuracao-*`                        | `/painel` e suas seções, com redirecionamento permanente  |
| `estruturaDB.sql` (PostgreSQL, nunca usado pela API) | Esquema e migrações em `src/server/db/schema.ts`          |

Os dados da base antiga não são importados pela versão atual.

## Execução (somente para consulta)

A versão antiga depende de um MongoDB externo e de variáveis `MONGO_CONECTION` e `SECRET_KEY` em `backend/.env`. As dependências usam versões `latest` e podem não instalar mais da mesma forma.

Em um terminal, a partir da raiz do repositório, inicie a API antiga:

```bash
cd legacy/backend
python -m venv .venv
source .venv/Scripts/activate
pip install -r requirements.txt
python run.py
```

No Linux ou macOS, ative o ambiente com `source .venv/bin/activate`; no PowerShell, com `.venv\Scripts\Activate.ps1`.

Em outro terminal, também a partir da raiz e com a API antiga rodando, inicie a interface antiga:

```bash
cd legacy/frontend
npm install
npm start
```

A API antiga escuta na porta 5000 e a interface antiga na porta 3000, a mesma da aplicação atual. Encerre a aplicação atual antes de iniciar a interface antiga.
