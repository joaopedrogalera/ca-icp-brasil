---
layout: default
title: CA-ICP Brasil
---

---
layout: default
title: CA-ICP Brasil
---

# CA-ICP Brasil

Script para baixar automaticamente certificados raiz do ICP-Brasil a partir do repositório público do SERPRO.

## Motivação

Para emissão de nota fiscal eletrônica, muitos estados usam webservices das secretarias de fazenda. Alguns desses serviços usam certificados raiz comuns, mas outros usam certificados emitidos pelo ICP-Brasil. Esses certificados nem sempre vêm pré-instalados no sistema operacional, navegadores ou Node.js.

Este projeto automatiza a extração dos certificados válidos do repositório SERPRO e gera um arquivo `ca-icp-brasil.pem` com os certificados válidos juntos, facilitando sua inclusão em bundles de CA no Linux e uso em Node.

## Como funciona

1. O script baixa a página de índice do repositório SERPRO.
2. Extrai todos os links em uma tabela HTML.
3. Resolve links relativos/absolutos usando a `BASE_URL`.
4. Filtra apenas URLs de certificados ICP-Brasil (`icpbrasil...crt`).
5. Baixa cada certificado, valida o formato PEM e valida as datas de validade.
6. Gera um arquivo `ca-icp-brasil.pem` contendo apenas certificados válidos, com comentários acima de cada certificado.

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

## Opções de linha de comando

O script suporta os seguintes argumentos:

```bash
npm start -- --outfile ca-icp-brasil.pem --logfile result.json
```

- `--outfile <arquivo>`: arquivo de saída do bundle PEM (padrão `ca-icp-brasil.pem`).
- `--logfile <arquivo>`: arquivo JSON de log com informações dos certificados validados (padrão `result.json`).
- `--nolog`: não gera o arquivo de log JSON.

## Certificados Pré-gerados

Um workflow no GitHub Actions atualiza automaticamente os certificados **todos os dias** e os disponibiliza para download em:

```
https://joaopedrogalera.github.io/ca-icp-brasil/cacerts.pem
```

(A URL redireciona para `https://joaopedrogalera.com/ca-icp-brasil/cacerts.pem`)

Faça download e use localmente:

```bash
curl -o cacerts.pem https://joaopedrogalera.com/ca-icp-brasil/cacerts.pem
export NODE_EXTRA_CA_CERTS=$(pwd)/cacerts.pem
node seu-app.js
```

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

Os arquivos gerados são:

- `ca-icp-brasil.pem` (ou o nome customizado via `--outfile`): Bundle PEM com todos os certificados válidos
- `result.json` (exceto se `--nolog` for passado): Arquivo JSON com informações estruturadas dos certificados

### Formato do PEM

Cada certificado é precedido por um comentário com:

- Subject
- Fingerprint (SHA-1)
- Valid From
- Valid Until
- URL
- Filename

### Formato do JSON

```json
{
  "timestamp": "2026-05-28T...",
  "totalCertificates": 5,
  "certificates": [
    {
      "subject": "...",
      "fingerprint": "...",
      "validFrom": "...",
      "validTo": "...",
      "url": "...",
      "filename": "..."
    }
  ]
}
```

## Observações

- O script foi desenvolvido para Node 24.
- O arquivo `ca-icp-brasil.pem` inclui apenas certificados válidos no momento da execução.
- Links relativos no repositório são resolvidos contra a base URL definida.
