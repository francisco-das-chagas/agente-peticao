// src/api/n8n.js
// Envia N arquivos ao Webhook do n8n via multipart/form-data
export async function uploadToN8N(files, extra = {}) {
  const url = import.meta.env.VITE_N8N_SUMMARY_FILES_WEBHOOK
  if (!url)
    throw new Error('Defina VITE_N8N_SUMMARY_FILES_WEBHOOK no .env.local')

  if (!files || !files.length) {
    throw new Error('Nenhum arquivo selecionado para upload.')
  }

  const fd = new FormData()
  for (const f of files) fd.append('files', f) // o Code do n8n espera o campo "files"

  // Campos extras (metadados)
  for (const [k, v] of Object.entries(extra)) {
    fd.append(k, typeof v === 'string' ? v : JSON.stringify(v))
  }

  // OBS: não defina manualmente Content-Type; deixe o browser setar o boundary
  const res = await fetch(url, { method: 'POST', body: fd })

  // Lemos como texto e tentamos JSON por segurança
  const raw = await res.text().catch(() => '')
  let data = null
  try {
    data = raw ? JSON.parse(raw) : null
  } catch (_) {
    /* mantém como texto */
  }

  if (!res.ok) {
    // se o n8n retornar { code, message }, mostramos a message
    const msg =
      (data && data.message) ||
      raw ||
      `Falha no upload: ${res.status} ${res.statusText}`
    throw new Error(msg)
  }

  // Preferimos JSON; se não for JSON, devolvemos o texto cru
  return data ?? raw ?? { ok: true }
}
