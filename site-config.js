/* Configurações do site — editadas pelo painel em admin.html.
   Pode editar à mão também: é só manter o formato JSON. */
window.SITE_CONFIG = {
  "geral": {
    "disponivel": true,
    "textoStatus": "disponível para novos projetos"
  },
  "contato": {
    "email": "",
    "whatsapp": "",
    "mensagemWhatsapp": "Olá! Vim pelo site e quero fazer um orçamento.",
    "discord": "",
    "discordLink": "",
    "instagram": "rafinhadr_",
    "github": "rafinhadr"
  },
  "planos": [
    {
      "rotulo": "essencial",
      "titulo": "Bot Admin",
      "descricao": "Para começar organizado no Discord.",
      "preco": "Sob consulta",
      "precoNota": "pagamento único",
      "destaque": false,
      "selo": "",
      "itens": ["Whitelist pelo Discord", "Cargos automáticos", "Logs de entrada e saída", "Comandos de moderação"]
    },
    {
      "rotulo": "profissional",
      "titulo": "Bot Completo",
      "descricao": "Toda a gestão da staff em um só bot.",
      "preco": "Sob consulta",
      "precoNota": "pagamento único",
      "destaque": true,
      "selo": "mais pedido",
      "itens": ["Tudo do Essencial", "Hierarquia e ponto da staff", "Sistema de tickets", "Advertências e banimentos", "Cargos de facções e empregos"]
    },
    {
      "rotulo": "premium",
      "titulo": "Bot + Site",
      "descricao": "Bot completo integrado ao site do servidor.",
      "preco": "Sob consulta",
      "precoNota": "pagamento único",
      "destaque": false,
      "selo": "",
      "itens": ["Tudo do Profissional", "Site do servidor", "Whitelist pelo site", "Login com Discord", "Painel web da staff"]
    }
  ],
  "notaPlanos": "// precisa de algo diferente? monto um pacote sob medida.",
  "projetos": [
    {
      "titulo": "Bot de administração RP",
      "categoria": "bot",
      "etiqueta": "bot · fivem",
      "capa": "/whitelist",
      "descricao": "Whitelist, hierarquia da staff, tickets e logs para servidor de GTA RP.",
      "tecnologias": ["Node.js", "Discord.js", "MySQL"],
      "link": ""
    },
    {
      "titulo": "Site com whitelist integrada",
      "categoria": "web",
      "etiqueta": "site",
      "capa": "</>",
      "descricao": "Site do servidor com login via Discord e formulário de whitelist ligado ao bot.",
      "tecnologias": ["HTML", "CSS", "JavaScript", "API"],
      "link": ""
    },
    {
      "titulo": "Bot para comunidades",
      "categoria": "bot",
      "etiqueta": "bot · comunidade",
      "capa": "{ }",
      "descricao": "Moderação, verificação de membros, cargos por reação e comandos personalizados.",
      "tecnologias": ["Node.js", "Discord.js", "SQLite"],
      "link": ""
    },
    {
      "titulo": "Sistemas internos",
      "categoria": "sistema",
      "etiqueta": "sistema",
      "capa": "SYS",
      "descricao": "Painéis e ferramentas para organizar processos e equipes.",
      "tecnologias": ["JavaScript", "Node.js", "SQL"],
      "link": ""
    }
  ],
  "faq": [
    { "pergunta": "O bot fica hospedado onde?", "resposta": "Posso configurar o bot na sua hospedagem ou indicar e cuidar de uma para você. Você recebe tudo funcionando." },
    { "pergunta": "Dá para personalizar com as regras do meu servidor?", "resposta": "Sim. Perguntas da whitelist, cargos, hierarquia, mensagens e cores são configurados de acordo com a sua cidade." },
    { "pergunta": "Como funciona a whitelist pelo site?", "resposta": "O jogador entra com o Discord no site, preenche o formulário e o pedido chega para a staff no Discord. Ao aprovar, o bot aplica o cargo e libera o ID automaticamente." },
    { "pergunta": "Tem suporte depois da entrega?", "resposta": "Sim. Após a entrega há um período de suporte para ajustes e dúvidas da staff." }
  ]
};
