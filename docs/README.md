# GitHub Pages - CA-ICP Brasil

Esta pasta contém a página estática do projeto, gerada com Jekyll e o tema architect.

## Como executar localmente

### Pré-requisitos

- Ruby 2.7+
- Bundler

### Instalação e execução

1. Instale as dependências:
```bash
bundle install
```

2. Execute o servidor Jekyll:
```bash
bundle exec jekyll serve
```

3. Acesse http://localhost:4000 no seu navegador

## Estrutura

- `_config.yml` - Configuração do Jekyll
- `index.md` - Página inicial
- `Gemfile` - Dependências Ruby
- `_site/` - Arquivos gerados (ignorado no git)

## Tema

Este site usa o tema [Jekyll Theme Architect](https://github.com/pages-themes/architect).

## Personalização

Para personalizar:

1. Edite `_config.yml` para alterar configurações globais
2. Edite `index.md` para alterar o conteúdo da página inicial
3. Crie novos arquivos `.md` para adicionar novas páginas

## Deploy

O site é automaticamente compilado e publicado pelo GitHub Pages quando você faz push para a pasta `docs` da branch `gh-pages`.
