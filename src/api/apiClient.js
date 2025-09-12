// src/api/apiClient.js

// Esta função será a ÚNICA forma de comunicar com seu backend Python.
export async function uploadAndProcessFiles(files, tipoPeticao) {
  // Usaremos a variável de ambiente padrão que já configuramos
  const url = `${import.meta.env.VITE_API_BASE_URL}/upload`

  if (!url) {
    throw new Error(
      'A URL da API não está definida. Verifique seu arquivo .env'
    )
  }
  if (!files || !files.length) {
    throw new Error('Nenhum arquivo selecionado para upload.')
  }

  const fd = new FormData()
  files.forEach(file => fd.append('files', file))
  fd.append('tipo_peticao', tipoPeticao)

  const response = await fetch(url, { method: 'POST', body: fd })
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error || 'Falha ao se comunicar com o backend.')
  }
  return data
}
