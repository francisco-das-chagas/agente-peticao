export async function uploadAndProcessFiles(files, tipoPeticao) {
  const url = `${import.meta.env.VITE_API_BASE_URL}/upload`
  if (!url) throw new Error('URL da API não definida no .env')
  const fd = new FormData()
  files.forEach(file => fd.append('files', file))
  fd.append('tipo_peticao', tipoPeticao)
  const response = await fetch(url, { method: 'POST', body: fd })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Falha no backend.')
  return data
}

export async function downloadReportAsDocx(reportText) {
  const url = `${import.meta.env.VITE_API_BASE_URL}/download-report`
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ report: reportText })
  })
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(
      errorData.error || `Erro no servidor: ${response.statusText}`
    )
  }
  const blob = await response.blob()
  const downloadUrl = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.style.display = 'none'
  a.href = downloadUrl
  a.download = 'peticao_gerada.docx'
  document.body.appendChild(a)
  a.click()
  window.URL.revokeObjectURL(downloadUrl)
  a.remove()
}
