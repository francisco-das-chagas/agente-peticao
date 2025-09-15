import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  FileText, 
  Plus, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  Calendar,
  Scale
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import StatsCard from "../components/dashboard/StatsCard";
import RecentPetitions from "../components/dashboard/RecentPetitions";
import QuickActions from "../components/dashboard/QuickActions";

export default function VisaoGeral() {
  const [peticoes, setPeticoes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadPeticoes();
  }, []);

  const loadPeticoes = async () => {
    setIsLoading(true);
    const data = await Peticao.list("-created_date", 10);
    setPeticoes(data);
    setIsLoading(false);
  };

  const getStats = () => {
    const total = peticoes.length;
    const concluidas = peticoes.filter(p => p.status_geral === 'concluido').length;
    const processando = peticoes.filter(p => p.status_geral === 'processando').length;
    const rascunhos = peticoes.filter(p => p.status_geral === 'rascunho').length;
    
    return { total, concluidas, processando, rascunhos };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 merriweather mb-2">
            Visão Geral
          </h1>
          <p className="text-gray-600 text-lg">
            Acompanhe suas petições e gerencie seu workflow jurídico
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total de Petições"
            value={stats.total}
            icon={FileText}
            bgColor="bg-blue-500"
            textColor="text-blue-600"
            trend={`${stats.concluidas} concluídas`}
          />
          <StatsCard
            title="Em Processamento"
            value={stats.processando}
            icon={Clock}
            bgColor="bg-orange-500"
            textColor="text-orange-600"
            trend="Aguardando IA"
          />
          <StatsCard
            title="Concluídas"
            value={stats.concluidas}
            icon={CheckCircle2}
            bgColor="bg-green-500"
            textColor="text-green-600"
            trend="Prontas para uso"
          />
          <StatsCard
            title="Rascunhos"
            value={stats.rascunhos}
            icon={AlertTriangle}
            bgColor="bg-yellow-500"
            textColor="text-yellow-600"
            trend="Pendentes"
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentPetitions 
              peticoes={peticoes}
              isLoading={isLoading}
            />
          </div>

          <div className="space-y-6">
            <QuickActions />
            
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 merriweather">
                  <Calendar className="w-5 h-5 text-[#6E0000]" />
                  Hoje
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-4">
                  <p className="text-gray-600 mb-2">
                    {format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR })}
                  </p>
                  <p className="text-2xl font-bold text-[#6E0000] merriweather">
                    {format(new Date(), "HH:mm")}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}