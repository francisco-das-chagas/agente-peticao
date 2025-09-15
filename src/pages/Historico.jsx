
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  FileText, 
  Search, 
  Filter, 
  Download,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Plus
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function Historico() {
  const [peticoes, setPeticoes] = useState([]);
  const [filteredPeticoes, setFilteredPeticoes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPetition, setSelectedPetition] = useState(null);

  const filterPeticoes = useCallback(() => {
    let filtered = peticoes;

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.tipo_peticao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.tipo_categoria?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedFilter !== "all") {
      filtered = filtered.filter(p => p.status_geral === selectedFilter);
    }

    setFilteredPeticoes(filtered);
  }, [searchTerm, selectedFilter, peticoes]);

  useEffect(() => {
    loadPeticoes();
  }, []);

  useEffect(() => {
    filterPeticoes();
  }, [filterPeticoes]);

  const loadPeticoes = async () => {
    setIsLoading(true);
    const data = await Peticao.list("-created_date");
    setPeticoes(data);
    setIsLoading(false);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "concluido": return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case "processando": return <Clock className="w-4 h-4 text-orange-600 animate-spin" />;
      case "erro": return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status) => {
    const styles = {
      rascunho: "bg-gray-100 text-gray-800",
      processando: "bg-orange-100 text-orange-800",
      concluido: "bg-green-100 text-green-800",
      erro: "bg-red-100 text-red-800"
    };
    
    const labels = {
      rascunho: "Rascunho",
      processando: "Processando",
      concluido: "Concluído",
      erro: "Erro"
    };

    return (
      <Badge className={styles[status] || styles.rascunho}>
        {labels[status] || status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 merriweather mb-2">
            Histórico de Petições
          </h1>
          <p className="text-gray-600 text-lg">
            Visualize e gerencie todas as suas petições anteriores
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar petições..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <select 
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg bg-white"
          >
            <option value="all">Todos os Status</option>
            <option value="rascunho">Rascunhos</option>
            <option value="processando">Processando</option>
            <option value="concluido">Concluídos</option>
            <option value="erro">Com Erro</option>
          </select>
        </div>

        <div className="grid gap-4">
          {filteredPeticoes.map((peticao) => (
            <Card key={peticao.id} className="border-none shadow-lg hover:shadow-xl transition-all duration-200">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {getStatusIcon(peticao.status_geral)}
                    <div>
                      <CardTitle className="merriweather text-lg">
                        {peticao.tipo_peticao?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">
                        {peticao.tipo_categoria?.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">
                        Criado em {format(new Date(peticao.created_date), "d 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(peticao.status_geral)}
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedPetition(selectedPetition?.id === peticao.id ? null : peticao)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {selectedPetition?.id === peticao.id && (
                <CardContent className="pt-0 border-t bg-gray-50">
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="font-semibold mb-2">Documentos Enviados:</h4>
                      <ul className="space-y-1 text-sm">
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          Relatório do Processo
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          Documentos Essenciais
                        </li>
                        <li className="flex items-center gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-600" />
                          Cópia Completa do Processo
                        </li>
                      </ul>
                    </div>
                    {peticao.resumo_n8n && (
                      <div>
                        <h4 className="font-semibold mb-2">Resumo da IA:</h4>
                        <p className="text-sm text-gray-700 bg-white p-3 rounded-lg">
                          {peticao.resumo_n8n}
                        </p>
                        <Button variant="outline" size="sm" className="mt-3">
                          <Download className="w-4 h-4 mr-2" />
                          Baixar Petição
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredPeticoes.length === 0 && !isLoading && (
          <Card className="border-none shadow-lg text-center py-12">
            <CardContent>
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 merriweather mb-2">
                Nenhuma petição encontrada
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || selectedFilter !== "all" ? 
                  "Ajuste os filtros para ver mais resultados" : 
                  "Comece criando sua primeira petição"
                }
              </p>
              <Button asChild className="bg-[#6E0000] hover:bg-[#8B1538]">
                <Link to={createPageUrl("CriarPeticao")}>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Petição
                </Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
