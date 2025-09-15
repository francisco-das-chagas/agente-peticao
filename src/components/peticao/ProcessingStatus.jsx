import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import {
  CheckCircle2,
  Download,
  Plus,
  FileText,
  Sparkles,
  Loader2
} from 'lucide-react'
import { motion } from 'framer-motion'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog'
async function downloadReportAsDocx(reportText) {
  // AQUI ESTÁ A CORREÇÃO: Usamos a variável de ambiente para a URL
  const url = `${import.meta.env.VITE_API_BASE_URL}/download-report`

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ report: reportText })
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(
        errorData.error || `Erro no servidor: ${response.statusText}`
      )
    }

    // Pega o arquivo .docx retornado pelo backend e inicia o download
    const blob = await response.blob()
    const downloadUrl = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = downloadUrl
    a.download = 'peticao_gerada.docx' // Nome do arquivo que será baixado
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(downloadUrl)
    a.remove()
  } catch (error) {
    console.error('Falha ao baixar o DOCX:', error)
    // Propaga o erro para que a interface possa mostrá-lo
    throw error
  }
}

export default function ProcessingStatus({ result, onNewPetition }) {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleDownload = async () => {
    setIsDownloading(true)
    await downloadReportAsDocx(result.resumo)
    setIsDownloading(false)
  }

  return (
    <>
      {/* Modal de Visualização */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[800px] h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="merriweather">
              Visualização do Relatório
            </DialogTitle>
            <DialogDescription>
              Este é o conteúdo gerado pela IA. Role para ver o texto completo.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-auto p-4 border rounded-md bg-gray-50">
            <pre className="whitespace-pre-wrap text-sm font-sans">
              {result.resumo}
            </pre>
          </div>
        </DialogContent>
      </Dialog>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 merriweather mb-4">
              Petição Gerada com Sucesso!
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Sua petição foi processada pela inteligência artificial
            </p>

            <Card className="border-none shadow-lg text-left mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 merriweather">
                  <Sparkles className="w-5 h-5 text-[#6E0000]" />
                  Resumo da IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-6 rounded-lg max-h-60 overflow-y-auto">
                  <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                    {result.resumo || 'Petição processada com sucesso.'}
                  </p>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="bg-[#6E0000] hover:bg-[#8B1538] flex-1"
                  >
                    {isDownloading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Download className="w-4 h-4 mr-2" />
                    )}
                    Baixar Petição (DOCX)
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setIsModalOpen(true)}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Visualizar Online
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={onNewPetition}
                className="bg-[#6E0000] hover:bg-[#8B1538]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nova Petição
              </Button>
              <Button asChild variant="outline">
                <Link to={createPageUrl('Historico')}>
                  <FileText className="w-4 h-4 mr-2" />
                  Ver Histórico
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  )
}
