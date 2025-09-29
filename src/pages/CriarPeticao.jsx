import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import LoadingOverlay from '../components/common/LoadingOverlay'
import {
  AlertTriangle,
  CheckCircle2,
  ArrowLeft,
  Clock,
  FileText,
  Scale
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { createPageUrl } from '@/utils' 

import TipoPeticaoSelector from '../components/peticao/TipoPeticaoSelector'
import RequiredDocuments from '../components/peticao/RequiredDocuments'
import ProcessingStatus from '../components/peticao/ProcessingStatus'

// Função para chamar a API do backend
async function uploadFilesAndGenerateReport(files, tipoPeticao) {
  // AQUI ESTÁ A CORREÇÃO: A URL é lida da variável de ambiente.
  const url = `${import.meta.env.VITE_API_BASE_URL}/upload`;

  const fd = new FormData();
  files.forEach(file => fd.append('files', file));
  fd.append('tipo_peticao', tipoPeticao);

  const response = await fetch(url, { method: 'POST', body: fd });

  // O response.json() agora vai funcionar, pois a chamada será feita para a URL certa.
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Falha ao se comunicar com o backend.');
  }
  return data;
}

// LISTA COMPLETA DE PETIÇÕES RESTAURADA
const TIPOS_PETICAO = {
  pecas_iniciais: [
    {
      value: 'peticao_inicial_civel',
      label: 'Petição Inicial - Ações cíveis em geral'
    },
    {
      value: 'reclamacao_trabalhista_direitos',
      label: 'Reclamação Trabalhista - Direitos trabalhistas'
    },
    {
      value: 'reclamacao_trabalhista_defesa',
      label: 'Reclamação Trabalhista - Defesa trabalhista'
    },
    {
      value: 'mandado_seguranca',
      label: 'Mandado de Segurança - Direito líquido e certo'
    },
    { value: 'acao_despejo', label: 'Ação de Despejo - Locação e posse' },
    { value: 'acao_cobranca', label: 'Ação de Cobrança - Créditos e débitos' }
  ],
  pecas_defensivas: [
    {
      value: 'contestacao_trabalhista',
      label: 'Contestação - Defesa trabalhista'
    },
    { value: 'contestacao', label: 'Contestação - Defesa em ações cíveis' },
    {
      value: 'replica_contestacao',
      label: 'Réplica à Contestação - Tríplica do autor'
    },
    {
      value: 'embargos_execucao',
      label: 'Embargos à Execução - Defesa em execução'
    },
    {
      value: 'impugnacao_cumprimento',
      label: 'Impugnação ao Cumprimento - Defesa em cumprimento'
    },
    {
      value: 'excecao_pre_executividade',
      label: 'Exceção de Pré-Executividade - Defesa sem garantia'
    },
    {
      value: 'manifestacao_de_laudo',
      label: 'Manifestação de Laudo'
    }
  ],
  recursos: [
    {
      value: 'embargos_declaracao',
      label: 'Embargos de Declaração - Esclarecimentos'
    },
    { value: 'apelacao', label: 'Apelação - Recurso ordinário' },
    {
      value: 'agravo_instrumento',
      label: 'Agravo de Instrumento - Decisões interlocutórias'
    },
    {
      value: 'agravo_regimental',
      label: 'Agravo Regimental - Tribunais superiores'
    },
    { value: 'recurso_especial', label: 'Recurso Especial - STJ' },
    { value: 'recurso_extraordinario', label: 'Recurso Extraordinário - STF' },
    { value: 'recurso_revista', label: 'Recurso de Revista - TST' },
    {
      value: 'contrarrazoes_recurso',
      label: 'Contrarrazões de Recurso - Defesa em recursos'
    }
  ],
  pecas_executivas: [
    {
      value: 'cumprimento_sentenca_particular',
      label: 'Cível - Cumprimento de Sentença Particular'
    },
    {
      value: 'cumprimento_sentenca_honorarios_sucumbenciais',
      label: 'Cível - Cumprimento de Sentença honorários Sucumbenciais'
    },
    {
      value: 'cumprimento_sentenca_honorarios_sucumbenciais_fazenda_publica',
      label:
        'Cível - Cumprimento de Sentença honorários Sucumbenciais Fazenda Pública'
    },
    {
      value: 'implantacao_adicional_noturno',
      label: 'Cível - Implantação Adicional Noturno'
    },
    {
      value: 'obrigacao_pagar',
      label: 'Cível - Obrigação de Pagar'
    },
    {
      value: 'quinquenio_implantacao',
      label: 'Cível - Quinquênio Implantação'
    },
    {
      value: 'ciencia_rpv',
      label: 'Previdenciário - Ciência RPV'
    },
    {
      value: 'concordancia_calculos_destacamento_honorarios',
      label:
        'Previdenciário - Concordância Cálculos, Destacamento dos Honorários Contratuais'
    },
    {
      value: 'cumprimento_sentenca_previdenciario',
      label: 'Previdenciário - Cumprimento de Sentença'
    },
    {
      value: 'destacamento_honorarios_contratual',
      label: 'Previdenciário - Destacamento dos Honorários Contratuais'
    },
    {
      value: 'execucao_multa',
      label: 'Previdenciário - Execução de Multa'
    },
    {
      value: 'expedicao_alvara',
      label: 'Previdenciário - Exçedição de Alvará'
    },
    {
      value: 'impugnacao_calculos_contadoria_judicial',
      label:
        'Previdenciário - Impugnação dos Cálculos Contadoria Judicial - Não consta o 13º'
    },
    {
      value: 'impugnacao_a_obrigacao_fazer_pagar',
      label: 'Previdenciário - Impugnação à obrigação de fazer e pagar'
    },
    {
      value: 'majoracao_multa_oficiar_cgu',
      label: 'Previdenciário - Majoração da Multa Aplicada e Oficiar a CGU'
    },
    {
      value: 'manifestacao_renuncia_rpv',
      label:
        'Previdenciário - Manifestação - Não Houve Renúncia Para Fins de Recebimento por RPV'
    },
    {
      value: 'manifestacao_aplicacao_multa',
      label: 'Previdenciário - Manifestação Aplicação de Multa'
    },
    {
      value: 'renuncia_excedente_rpv',
      label: 'Previdenciário - Renúncia Excedente ao Teto da RPV'
    },
    {
      value: 'resposta_impugnacao_astreintes',
      label:
        'Previdenciário - Resposta a Impugnação ao Cumprimento da Astreintes/Multa'
    },
    {
      value: 'resposta_impugnacao_inss',
      label: 'Previdenciário - Resposta à Impugnação INSS'
    },
    {
      value: 'cumprimento_sentenca_trabalhista',
      label: 'Trabalhista - Cumprimento de Sentença'
    },
    {
      value: 'meios_executivos_trabalhista',
      label: 'Trabalhista - Meios executivos'
    },
    {
      value: 'peticoes_intermediarias_trabalhista',
      label: 'Trabalhista - Petições Intermediárias'
    },
    {
      value: 'recurso_trabalhista',
      label: 'Trabalhista - Recurso'
    },
    {
      value: 'liquidacao_artigos',
      label: 'Liquidação por Artigos -  EXPEDIÇÃO DE ALVARÁ'
    }
  ]
}

export default function CriarPeticao() {
  const navigate = useNavigate()
  const [selectedCategoria, setSelectedCategoria] = useState('')
  const [selectedTipo, setSelectedTipo] = useState('')
  const [documents, setDocuments] = useState({
    relatorio_processo: { status: 'pendente', files: [] },
    documentos_essenciais: { status: 'pendente', files: [] },
    copia_processo: { status: 'pendente', files: [] }
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedResult, setProcessedResult] = useState(null)

  const getProgress = () => {
    const validatedCount = Object.values(documents).filter(
      doc => doc.status === 'validado'
    ).length
    const hasType = selectedCategoria && selectedTipo
    return ((validatedCount + (hasType ? 1 : 0)) / 4) * 100
  }

  const canGenerate = () => {
    return (
      selectedCategoria &&
      selectedTipo &&
      Object.values(documents).every(doc => doc.status === 'validado')
    )
  }

  const handleDocumentUpdate = (field, data) => {
    setDocuments(prev => ({
      ...prev,
      [field]: { ...prev[field], ...data, status: 'validado' }
    }))
  }

  const handleGeneratePetition = async () => {
    if (!canGenerate()) return
    setIsProcessing(true)

    try {
      const allFiles = Object.values(documents).flatMap(doc => doc.files || [])
      if (allFiles.length === 0) {
        alert(
          'Nenhum arquivo foi enviado. Por favor, adicione os documentos necessários.'
        )
        setIsProcessing(false)
        return
      }

      // Passa o `selectedTipo` para a função de upload
      const response = await uploadFilesAndGenerateReport(
        allFiles,
        selectedTipo
      )

      setProcessedResult({
        id: new Date().getTime(),
        resumo: response.report
      })
    } catch (error) {
      console.error('Erro ao processar petição:', error)
      alert(`Erro ao gerar petição: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  if (processedResult) {
    return (
      <ProcessingStatus
        result={processedResult}
        onNewPetition={() => {
          setProcessedResult(null)
          setSelectedCategoria('')
          setSelectedTipo('')
          setDocuments({
            relatorio_processo: { status: 'pendente', files: [] },
            documentos_essenciais: { status: 'pendente', files: [] },
            copia_processo: { status: 'pendente', files: [] }
          })
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {isProcessing && <LoadingOverlay />}
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(createPageUrl('VisaoGeral'))}
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 merriweather">
                Criar Nova Petição
              </h1>
              <p className="text-gray-600 mt-1">
                Preencha os dados necessários para gerar sua petição
              </p>
            </div>
          </div>
        </div>

        <Card className="mb-6 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-[#6E0000]" />
              Progresso da Petição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={getProgress()} className="h-3 mb-3" />
            <div className="flex justify-between text-sm text-gray-600">
              <span>Progresso: {Math.round(getProgress())}%</span>
              <span>
                {
                  Object.values(documents).filter(
                    doc => doc.status === 'validado'
                  ).length
                }
                /3 documentos validados
              </span>
            </div>
          </CardContent>
        </Card>

        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <AlertDescription className="text-red-800 font-semibold">
            <strong>ATENÇÃO:</strong> SEM ESTES 3 ITENS, NÃO ELABORO NENHUMA
            PETIÇÃO.
          </AlertDescription>
        </Alert>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <TipoPeticaoSelector
              tiposPeticao={TIPOS_PETICAO}
              selectedCategoria={selectedCategoria}
              selectedTipo={selectedTipo}
              onCategoriaChange={setSelectedCategoria}
              onTipoChange={setSelectedTipo}
            />
            <RequiredDocuments
              documents={documents}
              onDocumentUpdate={handleDocumentUpdate}
            />
          </div>

          <div className="space-y-6">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="merriweather text-[#6E0000]">
                  Resumo da Petição
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Categoria selecionada:
                  </p>
                  <p className="font-semibold text-gray-900">
                    {selectedCategoria
                      ? selectedCategoria
                          .replace(/_/g, ' ')
                          .replace(/\b\w/g, l => l.toUpperCase())
                      : 'Nenhuma categoria selecionada'}
                  </p>
                </div>

                {selectedTipo && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">Tipo de petição:</p>
                    <p className="font-semibold text-gray-900">
                      {TIPOS_PETICAO[selectedCategoria]?.find(
                        t => t.value === selectedTipo
                      )?.label || selectedTipo}
                    </p>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Status dos Documentos:</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Relatório do Processo</span>
                      {documents.relatorio_processo.status === 'validado' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Documentos Essenciais</span>
                      {documents.documentos_essenciais.status === 'validado' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cópia do Processo</span>
                      {documents.copia_processo.status === 'validado' ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-orange-600" />
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardContent className="p-6">
                <Button
                  onClick={handleGeneratePetition}
                  disabled={!canGenerate() || isProcessing}
                  className="w-full bg-[#6E0000] hover:bg-[#8B1538] text-white font-semibold py-3 text-lg disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <Clock className="w-5 h-5 mr-2 animate-spin" />
                      Processando Petição...
                    </>
                  ) : (
                    <>
                      <FileText className="w-5 h-5 mr-2" />
                      Gerar Petição
                    </>
                  )}
                </Button>
                {!canGenerate() && (
                  <p className="text-center text-sm text-gray-500 mt-3">
                    Complete todos os campos para gerar a petição
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
