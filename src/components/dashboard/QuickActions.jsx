import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { FileText, Plus, Zap } from "lucide-react";

export default function QuickActions() {
  return (
    <Card className="border-none shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 merriweather">
          <Zap className="w-5 h-5 text-[#6E0000]" />
          Ações Rápidas
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button asChild className="w-full bg-[#6E0000] hover:bg-[#8B1538] justify-start">
          <Link to={createPageUrl("CriarPeticao")}>
            <Plus className="w-4 h-4 mr-3" />
            Nova Petição
          </Link>
        </Button>
        <Button asChild variant="outline" className="w-full justify-start">
          <Link to={createPageUrl("Historico")}>
            <FileText className="w-4 h-4 mr-3" />
            Ver Histórico
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}