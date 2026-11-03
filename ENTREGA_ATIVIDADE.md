# Atividade — Listas dinâmicas com React

## Item 2 — Tela implementada
Foi implementada a tela **Looks Predefinidos**, do Smart Sustainable Digital Closet. Ela apresenta combinações de roupas para diferentes ocasiões, com nome, ocasião, descrição e categorias necessárias. A tela possui oito objetos no array `PREDEFINED_LOOKS` e permite pesquisar e filtrar os looks por ocasião.

## Item 4 — Componente, props e key
- **Componente reutilizável:** `LookCard`, localizado em `src/app/components/LookCard.tsx`.
- **Props:** `look`, que contém `id`, `name`, `occasion`, `description` e `requiredCategories`; e `availability`, que contém `canCreate`, `missing` e `available`.
- **Renderização dinâmica:** `filteredLooks.map(...)` em `src/app/screens/PredefinedLooks.tsx` cria um `LookCard` para cada look filtrado.
- **Key:** `key={look.id}` usa o identificador único e estável de cada look. A `key` é utilizada pelo React para acompanhar os elementos da lista e não é uma prop comum recebida pelo componente.
- **Estilo:** o componente mantém a identidade visual existente do projeto, com tons rosados, marrom, cartões arredondados e grade responsiva.

## Testes e verificação
- Verificado no código: o array contém oito looks (mais que os quatro exigidos).
- Verificado no código: a lista usa `map()` e `key={look.id}`.
- Verificado no código: o componente recebe duas props (`look` e `availability`) e exibe informações de ambas.
- Verificado no código: a busca e o filtro continuam aplicados antes da renderização da lista.
- **Limitação do teste:** a compilação de produção (`npm run build`) não pôde ser concluída neste ambiente porque as dependências do projeto não estavam instaladas; a tentativa de instalação via `npm install` excedeu o tempo disponível. Portanto, não afirmo que o teste de execução no navegador foi concluído. Para finalizar localmente, execute `npm install` e depois `npm run build`.
