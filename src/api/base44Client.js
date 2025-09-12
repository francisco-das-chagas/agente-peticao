// src/api/base44Client.js
// Habilita um client mock quando em desenvolvimento para evitar redirecionamentos/autenticação do Base44

import { createClient } from '@base44/sdk' // manter import para production builds

const isDev = import.meta.env.MODE === 'development'

function createDevMock() {
  // armazenamento em memória para dev
  const mem = {
    user: { id: '1', name: 'Dev User', email: 'dev@local' },
    petitions: [],
    files: {},
    seq: 1
  }

  // helpers
  const genId = (prefix = 'id') => `${prefix}-${Date.now()}-${mem.seq++}`

  const Core = {
    InvokeLLM: async payload => {
      // retorna um conteúdo simulado que ajuda a testar o fluxo
      return {
        id: genId('llm'),
        content: `Relatório (mock) gerado a partir do prompt: ${JSON.stringify(
          payload
        )?.slice(0, 200)}...`,
        usage: { promptTokens: 0, completionTokens: 0, totalTokens: 0 }
      }
    },
    UploadFile: async ({ file, filename }) => {
      const id = genId('file')
      mem.files[id] = {
        id,
        filename: filename || file?.name || 'arquivo-local',
        size: file?.size || 0
      }
      return { id, filename: mem.files[id].filename }
    },
    UploadPrivateFile: async ({ file, filename }) => {
      const id = genId('pfile')
      mem.files[id] = {
        id,
        filename: filename || file?.name || 'arquivo-local-privado',
        size: file?.size || 0,
        private: true
      }
      return { id, filename: mem.files[id].filename }
    },
    GenerateImage: async ({ prompt }) => {
      // devolve uma imagem SVG simples embutida (data URL) para testes
      const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='400'>
        <rect width='100%' height='100%' fill='#eee'/>
        <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='20'>
          Mock Image: ${String(prompt || '').slice(0, 40)}
        </text>
      </svg>`
      const base64 =
        typeof btoa !== 'undefined'
          ? btoa(svg)
          : Buffer.from(svg).toString('base64')
      return { url: `data:image/svg+xml;base64,${base64}` }
    },
    ExtractDataFromUploadedFile: async ({ fileId }) => {
      const meta = mem.files[fileId] || null
      return { id: genId('extract'), data: { ok: true, file: meta } }
    }
  }

  const entities = {
    Peticao: {
      list: async () =>
        [...mem.petitions].sort(
          (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
        ),
      get: async id => mem.petitions.find(p => p.id === id) || null,
      create: async data => {
        const item = { id: genId('pet'), createdAt: Date.now(), ...data }
        mem.petitions.push(item)
        return item
      },
      update: async (id, data) => {
        const i = mem.petitions.findIndex(p => p.id === id)
        if (i >= 0)
          mem.petitions[i] = {
            ...mem.petitions[i],
            ...data,
            updatedAt: Date.now()
          }
        return mem.petitions[i] || null
      },
      delete: async id => {
        const before = mem.petitions.length
        mem.petitions = mem.petitions.filter(p => p.id !== id)
        return { deleted: before !== mem.petitions.length }
      }
    }
  }

  const auth = {
    getUser: async () => mem.user,
    login: async () => true,
    logout: async () => true
  }

  return { integrations: { Core }, entities, auth }
}

export const base44 = isDev
  ? createDevMock()
  : createClient({
      appId: '68b981ef6d34cacbfbd78064',
      requiresAuth: true
    })

export default base44
