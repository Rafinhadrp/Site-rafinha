// Cloudflare Worker: proxy entre o site de recibo (recibo.html) e a API da Anthropic.
//
// A chave da API fica guardada como SECRET no Cloudflare, nunca no site.
// Como publicar:
//   1. Cloudflare > Workers & Pages > abra o worker (ou crie um) > Edit code
//   2. Cole este arquivo inteiro e clique em Deploy
//   3. Settings > Variables and Secrets > Add > Type: Secret
//        Nome: ANTHROPIC_API_KEY   Valor: sk-ant-...
//   4. (Opcional) Variável ALLOWED_ORIGIN com o endereço do site
//        (ex.: https://rafinhadrp.github.io) para só ele poder usar o proxy.

const ALLOWED_MODELS = ['claude-opus-5-5', 'claude-sonnet-5-5'];
const MAX_TOKENS_LIMIT = 16000;
const ALLOWED_BETAS = ['server-side-fallback-2026-07-01'];

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigin = env.ALLOWED_ORIGIN || '*';
    const cors = {
      'Access-Control-Allow-Origin': allowedOrigin === '*' ? '*' : allowedOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'content-type, anthropic-version, anthropic-beta',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };

    const json = (status, obj) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: { ...cors, 'content-type': 'application/json' }
      });

    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
    if (request.method !== 'POST') return json(405, { error: { message: 'Use POST.' } });

    if (allowedOrigin !== '*' && origin !== allowedOrigin) {
      return json(403, { error: { message: 'Origem não autorizada: ' + origin } });
    }
    if (!env.ANTHROPIC_API_KEY) {
      return json(500, { error: { message: 'O secret ANTHROPIC_API_KEY não está configurado no Worker.' } });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json(400, { error: { message: 'Corpo da requisição não é JSON válido.' } });
    }

    // Evita que alguém use o proxy para outros modelos ou respostas enormes.
    if (!ALLOWED_MODELS.includes(body.model)) {
      return json(400, { error: { message: 'Modelo não permitido: ' + body.model } });
    }
    body.max_tokens = Math.min(Number(body.max_tokens) || 1024, MAX_TOKENS_LIMIT);

    const betas = (request.headers.get('anthropic-beta') || '')
      .split(',')
      .map(s => s.trim())
      .filter(b => ALLOWED_BETAS.includes(b));

    const headers = {
      'content-type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    };
    if (betas.length) headers['anthropic-beta'] = betas.join(',');

    let upstream;
    try {
      upstream = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers,
        body: JSON.stringify(body)
      });
    } catch (err) {
      return json(502, { error: { message: 'Falha ao conectar na API da Anthropic: ' + err.message } });
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers: { ...cors, 'content-type': 'application/json' }
    });
  }
};
