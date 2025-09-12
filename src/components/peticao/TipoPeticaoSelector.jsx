import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { FileText, Scale } from 'lucide-react'

export default function TipoPeticaoSelector({
  tiposPeticao,
  selectedCategoria,
  selectedTipo,
  onCategoriaChange,
  onTipoChange
}) {
  const categoriaLabels = {
    pecas_iniciais: 'Peças Iniciais',
    pecas_defensivas: 'Peças Defensivas',
    recursos: 'Recursos',
    pecas_executivas: 'Peças Executivas'
  }

  const itemClass =
    'cursor-pointer transition-colors hover:bg-rose-50 hover:text-[#6E0000] ' +
    'data-[highlighted]:bg-rose-50 data-[highlighted]:text-[#6E0000] ' +
    'focus:bg-rose-50 focus:text-[#6E0000]'

  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 merriweather">
          <Scale className="w-5 h-5 text-[#6E0000]" />
          Seleção do Tipo de Petição
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Categoria da Petição</Label>
          <Select value={selectedCategoria} onValueChange={onCategoriaChange}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione a categoria..." />
            </SelectTrigger>
            <SelectContent className="p-0">
              {Object.entries(categoriaLabels).map(([value, label]) => (
                <SelectItem key={value} value={value} className={itemClass}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCategoria && (
          <div className="space-y-2">
            <Label>Tipo Específico</Label>
            <Select value={selectedTipo} onValueChange={onTipoChange}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de petição..." />
              </SelectTrigger>
              <SelectContent className="p-0">
                {tiposPeticao[selectedCategoria]?.map(tipo => (
                  <SelectItem
                    key={tipo.value}
                    value={tipo.value}
                    className={itemClass}
                  >
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {selectedCategoria && selectedTipo && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-800">
              <FileText className="w-4 h-4" />
              <span className="font-semibold">
                Tipo selecionado com sucesso!
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
