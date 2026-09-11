# Atividade prática – Componentizando nossa interface

## Elementos reutilizáveis identificados

1. Cards de estatísticas do painel.
2. Cards de ação (Adicionar Nova Peça / Criar Look).
3. Links do menu de navegação.

## Componentes criados

### `src/app/components/StatCard.tsx`
Componente para os cards de estatísticas.

Props usadas:
- `value`: valor mostrado no card.
- `title`: título do card.
- `icon`: ícone mostrado no card.
- `link`: rota opcional.
- `linkText`: texto opcional do link.

### `src/app/components/ActionCard.tsx`
Componente para os cards de ação.

Props usadas:
- `title`: título.
- `description`: descrição.
- `link`: rota de destino.
- `filled`: define se o card usa o estilo preenchido.

## Arquivo alterado

### `src/app/screens/Home.tsx`
- Importei `StatCard` e `ActionCard`.
- Substituí os 5 cards de estatísticas repetidos por `StatCard`.
- Substituí os 2 cards de ação repetidos por `ActionCard`.
- Os componentes recebem valores diferentes por props.
- A lógica dos dados do painel foi mantida.

## Relação com a atividade

- Pelo menos 3 elementos reutilizáveis: cards de estatísticas, cards de ação e links do menu.
- 2 elementos foram transformados em componentes: `StatCard` e `ActionCard`.
- Os componentes recebem várias props.
- `StatCard` é reutilizado 5 vezes com valores diferentes.
- `ActionCard` é reutilizado 2 vezes com valores diferentes.
