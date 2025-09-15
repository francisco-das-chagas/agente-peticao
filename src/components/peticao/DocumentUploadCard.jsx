import React, { useState, useRef, useCallback, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Paperclip,
  Trash2
} from 'lucide-react'

const toDisplayName = f =>
  f?.name || f?.filename || f?.originalName || 'arquivo'

export default function DocumentUploadCard({ document, status, onUpdate }) {
  const [activeTab, setActiveTab] = useState('upload')
  const [textContent, setTextContent] = useState('')
  const [selectedFiles, setSelectedFiles] = useState([]) // Apenas para exibição
  const fileInputRef = useRef(null)

  const textFieldName = useMemo(() => {
    if (document?.key === 'documentos_essenciais') return 'lista_documentos'
    if (document?.key === 'copia_processo') return 'conteudo'
    return 'texto'
  }, [document?.key])

  const handleSelectedFiles = useCallback(
    fileList => {
      const files = Array.from(fileList || [])
      if (!files.length) return

      const newFiles = [...selectedFiles, ...files]
      setSelectedFiles(newFiles)

      const label = `Arquivos: ${newFiles.map(toDisplayName).join(', ')}`

      // *** MUDANÇA PRINCIPAL: Passa os arquivos para o componente pai ***
      onUpdate({
        [textFieldName]: label,
        files: newFiles // Envia a lista de objetos File
      })
    },
    [onUpdate, selectedFiles, textFieldName]
  )

  const onInputChange = e => {
    handleSelectedFiles(e.target.files)
    e.target.value = ''
  }

  const handleDrop = useCallback(
    e => {
      e.preventDefault()
      e.stopPropagation()
      handleSelectedFiles(e.dataTransfer.files)
    },
    [handleSelectedFiles]
  )

  const handleDragOver = useCallback(e => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleTextSubmit = () => {
    if (!textContent.trim()) return
    onUpdate({ [textFieldName]: textContent.trim(), files: [] })
  }

  const removeFile = indexToRemove => {
    const newFiles = selectedFiles.filter((_, i) => i !== indexToRemove)
    setSelectedFiles(newFiles)

    if (newFiles.length) {
      const label = `Arquivos: ${newFiles.map(toDisplayName).join(', ')}`
      onUpdate({
        arquivo_urls: newFiles.map(f => f.name),
        [textFieldName]: label,
        files: newFiles
      })
    } else {
      onUpdate({ status: 'pendente', arquivo_urls: [], files: [] })
    }
  }

  const clearDocument = () => {
    setSelectedFiles([])
    setTextContent('')
    onUpdate({
      status: 'pendente',
      arquivo_urls: [],
      texto: '',
      lista_documentos: '',
      conteudo: '',
      files: []
    })
  }

  return (
    <Card
      className={`border-none shadow-lg transition-all duration-300 ${
        status === 'validado' ? 'bg-green-50 border-green-200' : 'bg-white'
      }`}
    >
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {status === 'validado' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            )}
            <span className="merriweather">{document?.title}</span>
          </div>
          {status === 'validado' && (
            <Button variant="ghost" size="icon" onClick={clearDocument}>
              <X className="w-4 h-4" />
            </Button>
          )}
        </CardTitle>
        <p className="text-sm text-gray-600">{document?.description}</p>
      </CardHeader>
      <CardContent>
        {status === 'validado' ? (
          <div className="p-4 bg-green-100 border border-green-200 rounded-lg space-y-2">
            <div className="flex items-center gap-2 text-green-800">
              <CheckCircle2 className="w-4 h-4" />
              <span className="font-semibold">Documento(s) validado(s)!</span>
            </div>
            {selectedFiles.length > 0 ? (
              selectedFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="text-sm text-green-700 flex items-center gap-2"
                >
                  <Paperclip className="w-3 h-3" />
                  <span>{toDisplayName(file)}</span>
                </div>
              ))
            ) : textContent ? (
              <p className="text-sm text-green-700 mt-2 truncate">
                Texto inserido.
              </p>
            ) : null}
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="upload">Upload de Arquivos</TabsTrigger>
              <TabsTrigger value="text">Entrada de Texto</TabsTrigger>
            </TabsList>
            <TabsContent value="upload" className="mt-4">
              <div className="space-y-4">
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#6E0000] transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  <div className="flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-gray-400" />
                    <p className="text-gray-600">
                      Clique para selecionar ou arraste aqui
                    </p>
                    <p className="text-xs text-gray-500">
                      {document?.acceptedTypes} — Suporta vários arquivos
                    </p>
                  </div>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={document?.acceptedTypes}
                  onChange={onInputChange}
                  className="hidden"
                />
                {selectedFiles.length > 0 && (
                  <div className="space-y-3">
                    <div className="space-y-2">
                      <h4 className="font-medium text-sm">
                        Arquivos Selecionados:
                      </h4>
                      {selectedFiles.map((file, index) => (
                        <div
                          key={`${file.name}-${file.size}-${index}`}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                        >
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Paperclip className="w-4 h-4" />
                            <span className="truncate">
                              {toDisplayName(file)}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(index)}
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
            <TabsContent value="text" className="mt-4">
              <div className="space-y-4">
                <Textarea
                  placeholder={`Digite ou cole o ${document?.title?.toLowerCase()} aqui...`}
                  value={textContent}
                  onChange={e => setTextContent(e.target.value)}
                  className="h-32"
                />
                <Button
                  onClick={handleTextSubmit}
                  disabled={!textContent.trim()}
                  className="w-full bg-[#6E0000] hover:bg-[#8B1538]"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Validar Texto
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
