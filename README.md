# ca-icp-brasil

Script para baixar automaticamente certificados raiz do ICP-Brasil a partir do repositório público do SERPRO.

## Motivação

Para emissão de nota fiscal eletrônica, muitos estados usam webservices das secretarias de fazenda. Alguns desses serviços usam certificados raiz comuns, mas outros usam certificados emitidos pelo ICP-Brasil. Esses certificados nem sempre vêm pré-instalados no sistema operacional, navegadores ou Node.js.

Este projeto automatiza a extração dos certificados válidos do repositório SERPRO e gera um arquivo `Serpro.pem` com os certificados válidos juntos, facilitando sua inclusão em bundles de CA no Linux e uso em Node.

## Como funciona

1. O script baixa a página de índice do repositório SERPRO.
2. Extrai todos os links em uma tabela HTML.
3. Resolve links relativos/absolutos usando a `BASE_URL`.
4. Filtra apenas URLs de certificados ICP-Brasil (`icpbrasil...crt`).
5. Baixa cada certificado, valida o formato PEM e valida as datas de validade.
6. Gera um arquivo `Serpro.pem` contendo apenas certificados válidos, com comentários acima de cada certificado.

## Uso

Instale dependências:

```bash
npm install
```

Execute o script:

```bash
npm start
```

Isso compila o TypeScript e executa `dist/index.js`.

## Variável de ambiente

O script usa por padrão:

```bash
https://repositorio.serpro.gov.br/docs/
```

Mas você pode sobrescrever a base URL com:

```bash
export SERPRO_DIRECTORY=https://meu.repositorio.serpro.gov.br/docs/
npm start
```

## Resultado

O arquivo gerado é:

- `Serpro.pem`

Ele contém apenas certificados válidos, cada um precedido por comentários com:

- Subject
- Valid From
- Valid Until
- URL
- Filename

## Uso no Linux / Node.js

No Linux, você pode adicionar o conteúdo de `Serpro.pem` ao bundle de CAs do sistema, por exemplo no `ca-certificates.pem` ou integrá-lo ao fluxo de atualização de certificados da distribuição.

No Node.js, você também pode usar o arquivo gerado com a variável de ambiente padrão do Node:

```bash
export NODE_EXTRA_CA_CERTS=$(pwd)/Serpro.pem
node dist/index.js
```

## Observações

- O script foi desenvolvido para Node 24.
- O arquivo `Serpro.pem` inclui apenas certificados válidos no momento da execução.
- Links relativos no repositório são resolvidos contra a base URL definida.

