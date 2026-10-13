# Central Autoforte

Guia interno, cofre de senhas, tarefas e **consultas da APIBrasil** (débitos e dados de veículo, FIPE, CNPJ, CPF e CEP).

```
central-autoforte/
├── index.html          → a Central (tela)
├── img/                → ícone
├── api/
│   ├── consulta.js     → função do Vercel que chama a APIBrasil (guarda os tokens)
│   └── _servicos.js    → lista de consultas: caminhos e campos da APIBrasil
├── .env.example        → nomes das variáveis de ambiente
└── package.json
```

## Publicar no Vercel

1. Em [vercel.com/new](https://vercel.com/new), importe o repositório do GitHub.
   - Se a Central continuar dentro do repositório `Site-rafinha`, em **Root Directory** escolha `central-autoforte`.
   - Se criar um repositório só para ela, deixe o Root Directory vazio.
2. **Framework Preset:** `Other`. Não precisa de comando de build.
3. Em **Environment Variables**, cadastre:

| Variável | O que é |
|---|---|
| `CENTRAL_SENHA` | Senha para usar a aba Consultas (escolha uma forte) |
| `APIBRASIL_BEARER_TOKEN` | Bearer Token da sua conta APIBrasil |
| `APIBRASIL_DEVICE_TOKEN` | DeviceToken padrão da APIBrasil |
| `APIBRASIL_DEVICE_TOKEN_DEBITOS` *(opcional)* | DeviceToken só para débitos. Vale para qualquer serviço: `_PLACA`, `_FIPE`, `_CNPJ`, `_CPF`, `_CEP` |

4. Clique em **Deploy**. Sempre que mudar uma variável, faça um novo deploy (Deployments → ⋯ → Redeploy).

## Ajustar as consultas

Os caminhos e os nomes dos campos de cada consulta estão em `api/_servicos.js`.
**Confira cada um na documentação da APIBrasil** e ajuste lá se algo estiver diferente — a tela se monta sozinha a partir desse arquivo.
Para adicionar outra consulta da APIBrasil, copie um bloco do arquivo e troque `id`, `nome`, `caminho` e `campos`.

## Segurança

- Os tokens da APIBrasil ficam **só** nas variáveis do Vercel; nunca vão para o navegador nem para o GitHub.
- A função só responde a quem envia a `CENTRAL_SENHA` correta, para ninguém de fora gastar seus créditos.
- No navegador ficam salvos apenas a senha da Central (para não pedir toda vez) e as últimas consultas feitas (só os dados digitados, nunca os resultados). O botão **Sair** apaga a senha.
