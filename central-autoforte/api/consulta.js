/*
 * Função do Vercel: /api/consulta
 *
 * GET  → lista os serviços disponíveis (para montar a tela)
 * POST → { servico: 'placa', dados: { placa: 'ABC1D23' } } faz a consulta na APIBrasil
 *
 * Os tokens da APIBrasil ficam só aqui no servidor (variáveis de ambiente).
 * Toda chamada precisa do cabeçalho `x-central-senha` igual a CENTRAL_SENHA,
 * para ninguém de fora gastar seus créditos.
 */
import { createHash, timingSafeEqual } from 'node:crypto';
import { API_BASE, SERVICOS } from './_servicos.js';

const UFS = 'AC AL AM AP BA CE DF ES GO MA MG MS MT PA PB PE PI PR RJ RN RO RR RS SC SE SP TO'.split(' ');
const TIMEOUT_MS = 25000;

const LIMPAR = {
  placa: v => v.toUpperCase().replace(/[^A-Z0-9]/g, ''),
  cpf: v => v.replace(/\D/g, ''),
  cnpj: v => v.replace(/\D/g, ''),
  cep: v => v.replace(/\D/g, ''),
  renavam: v => v.replace(/\D/g, ''),
  uf: v => v.toUpperCase().replace(/[^A-Z]/g, ''),
  texto: v => v.trim().slice(0, 120)
};
const VALIDO = {
  placa: v => /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(v),
  cpf: v => /^\d{11}$/.test(v),
  cnpj: v => /^\d{14}$/.test(v),
  cep: v => /^\d{8}$/.test(v),
  renavam: v => /^\d{9,11}$/.test(v),
  uf: v => UFS.includes(v),
  texto: v => v.length > 0
};

const hash = s => createHash('sha256').update(String(s)).digest();
function senhaConfere(recebida) {
  const certa = process.env.CENTRAL_SENHA;
  if (!certa || !recebida) return false;
  return timingSafeEqual(hash(recebida), hash(certa));
}

function deviceToken(id) {
  return process.env['APIBRASIL_DEVICE_TOKEN_' + id.toUpperCase()] || process.env.APIBRASIL_DEVICE_TOKEN || '';
}

function listaPublica() {
  const configurada = !!process.env.APIBRASIL_BEARER_TOKEN;
  return SERVICOS.map(({ id, grupo, nome, descricao, campos }) => ({
    id, grupo, nome, descricao,
    campos: campos.map(({ nome, rotulo, tipo, opcional }) => ({ nome, rotulo, tipo, opcional: !!opcional })),
    configurado: configurada && !!deviceToken(id)
  }));
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (!process.env.CENTRAL_SENHA) {
    return res.status(503).json({ erro: 'Defina a variável CENTRAL_SENHA no Vercel para liberar as consultas.' });
  }
  if (!senhaConfere(req.headers['x-central-senha'])) {
    return res.status(401).json({ erro: 'Senha da Central incorreta.' });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ servicos: listaPublica() });
  }
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ erro: 'Método não permitido.' });
  }

  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  const servico = SERVICOS.find(s => s.id === body?.servico);
  if (!servico) return res.status(400).json({ erro: 'Serviço inválido.' });

  const dados = {};
  for (const campo of servico.campos) {
    const bruto = body.dados?.[campo.nome];
    const valor = LIMPAR[campo.tipo](typeof bruto === 'string' ? bruto : '');
    if (!valor) {
      if (campo.opcional) continue;
      return res.status(400).json({ erro: `Preencha o campo ${campo.rotulo}.` });
    }
    if (!VALIDO[campo.tipo](valor)) return res.status(400).json({ erro: `${campo.rotulo} inválido.` });
    dados[campo.nome] = valor;
  }

  const bearer = process.env.APIBRASIL_BEARER_TOKEN;
  const device = deviceToken(servico.id);
  if (!bearer || !device) {
    return res.status(503).json({ erro: 'APIBrasil ainda não configurada para este serviço (faltam os tokens no Vercel).' });
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const resposta = await fetch(API_BASE + servico.caminho, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + bearer,
        'DeviceToken': device
      },
      body: JSON.stringify(dados),
      signal: controller.signal
    });
    const texto = await resposta.text();
    let json;
    try { json = JSON.parse(texto); } catch { json = { resposta: texto.slice(0, 2000) }; }
    if (!resposta.ok) {
      return res.status(502).json({ erro: `A APIBrasil respondeu com erro (${resposta.status}).`, detalhes: json });
    }
    return res.status(200).json({ servico: servico.id, consulta: dados, resultado: json });
  } catch (e) {
    const tempo = e.name === 'AbortError';
    return res.status(504).json({ erro: tempo ? 'A APIBrasil demorou demais para responder.' : 'Não foi possível falar com a APIBrasil.' });
  } finally {
    clearTimeout(timer);
  }
}
