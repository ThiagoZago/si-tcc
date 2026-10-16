# Decisões de dependências

As versões principais de Next.js, React e React DOM são fixas e o `package-lock.json` acompanha o projeto. `npm ci` reproduz a instalação.

ESLint 9 é mantido porque os plugins React, JSX a11y e import usados por `eslint-config-next@16.4.1` ainda declaram compatibilidade apenas até essa versão. Usar ESLint 10 produz conflitos de peer dependencies.

O override de `fast-glob` é limitado a `@next/eslint-plugin-next@16.4.1`. Essa versão importa somente `globSync(pattern, { onlyDirectories: true })`, API também fornecida por `tinyglobby@0.2.17`. A substituição remove a cadeia `fast-glob → micromatch → braces`, afetada pelo [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), sem fazer downgrade do Next.js nem desativar regras de lint. A configuração do projeto usa a raiz padrão do Next.js e não fornece padrões de `settings.next.rootDir`.

Ao atualizar `eslint-config-next`, revise o override e remova-o quando o pacote oficial deixar de depender da versão afetada. TypeScript, lint, testes e compilação devem ser executados após mudanças em dependências.

`server-only` marca todos os módulos de `src/server`. Dentro do Next.js, importar esses módulos a partir de um Client Component interrompe a compilação. O pacote é instalado para que o `tsx`, fora do Next.js, consiga resolvê-lo. Sua entrada padrão lança um erro ao ser importada; por isso `npm test`, `npm run db:init` e `npm run db:seed` usam `tsx --conditions=react-server`, que resolve para a versão vazia do pacote, a mesma condição de resolução do ambiente de servidor do React.
