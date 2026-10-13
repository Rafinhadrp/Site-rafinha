/*
 * Serviços da APIBrasil disponíveis na aba "Consultas".
 *
 * ⚠ Confira cada `caminho` e os nomes dos campos na documentação da APIBrasil
 *   (área do cliente → documentação de cada API). Se algo estiver diferente,
 *   ajuste só aqui: a tela da Central se monta a partir desta lista.
 *
 * Para adicionar um serviço novo, copie um bloco e mude id/nome/caminho/campos.
 *
 * Campos:
 *   nome     → nome enviado para a APIBrasil no corpo da requisição
 *   rotulo   → texto exibido na tela
 *   tipo     → 'placa' | 'cpf' | 'cnpj' | 'cep' | 'renavam' | 'uf' | 'texto'
 *   opcional → true se não for obrigatório
 *
 * Tokens (configurados nas variáveis de ambiente do Vercel, nunca no código):
 *   APIBRASIL_BEARER_TOKEN        → seu Bearer Token (obrigatório)
 *   APIBRASIL_DEVICE_TOKEN        → DeviceToken padrão
 *   APIBRASIL_DEVICE_TOKEN_<ID>   → DeviceToken específico de um serviço,
 *                                   ex.: APIBRASIL_DEVICE_TOKEN_DEBITOS
 */

export const API_BASE = 'https://gateway.apibrasil.io/api/v2';

export const SERVICOS = [
  {
    id: 'placa',
    grupo: 'Veículos',
    nome: 'Dados do veículo',
    descricao: 'Marca, modelo, ano, cor, chassi e situação pela placa.',
    caminho: '/vehicles/dados',
    campos: [{ nome: 'placa', rotulo: 'Placa', tipo: 'placa' }]
  },
  {
    id: 'debitos',
    grupo: 'Veículos',
    nome: 'Débitos do veículo',
    descricao: 'IPVA, licenciamento, multas e outros débitos.',
    caminho: '/vehicles/debitos',
    campos: [
      { nome: 'placa', rotulo: 'Placa', tipo: 'placa' },
      { nome: 'renavam', rotulo: 'Renavam', tipo: 'renavam', opcional: true },
      { nome: 'uf', rotulo: 'UF', tipo: 'uf', opcional: true }
    ]
  },
  {
    id: 'fipe',
    grupo: 'Veículos',
    nome: 'Tabela FIPE',
    descricao: 'Valor FIPE do veículo pela placa.',
    caminho: '/vehicles/fipe',
    campos: [{ nome: 'placa', rotulo: 'Placa', tipo: 'placa' }]
  },
  {
    id: 'cnpj',
    grupo: 'Documentos',
    nome: 'CNPJ',
    descricao: 'Razão social, situação, endereço e sócios.',
    caminho: '/dados/cnpj',
    campos: [{ nome: 'cnpj', rotulo: 'CNPJ', tipo: 'cnpj' }]
  },
  {
    id: 'cpf',
    grupo: 'Documentos',
    nome: 'CPF',
    descricao: 'Nome e situação cadastral do CPF.',
    caminho: '/dados/cpf',
    campos: [{ nome: 'cpf', rotulo: 'CPF', tipo: 'cpf' }]
  },
  {
    id: 'cep',
    grupo: 'Endereço',
    nome: 'CEP',
    descricao: 'Rua, bairro, cidade e UF.',
    caminho: '/cep/cep',
    campos: [{ nome: 'cep', rotulo: 'CEP', tipo: 'cep' }]
  }
];
