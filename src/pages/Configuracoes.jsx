
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge"; // Added Badge import
import { 
  User as UserIcon, 
  Building, 
  Mail, 
  Phone, 
  MapPin,
  Save,
  Settings as SettingsIcon,
  FileText, // Added FileText import
  Clock, // Added Clock import
  Scale // Added Scale import (as per outline, even if not explicitly used in current snippet)
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function Configuracoes() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    escritorio: "",
    oab_numero: "",
    telefone: "",
    endereco: "",
    especialidades: "",
    assinatura_digital: ""
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const userData = await User.me();
      setUser(userData);
      setFormData({
        escritorio: userData.escritorio || "",
        oab_numero: userData.oab_numero || "",
        telefone: userData.telefone || "",
        endereco: userData.endereco || "",
        especialidades: userData.especialidades || "",
        assinatura_digital: userData.assinatura_digital || ""
      });
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
    setIsLoading(false);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveMessage("");
    
    try {
      await User.updateMyUserData(formData);
      setSaveMessage("Configurações salvas com sucesso!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (error) {
      setSaveMessage("Erro ao salvar configurações. Tente novamente.");
      console.error("Erro ao salvar:", error);
    }
    
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 merriweather mb-2">
            Configurações
          </h1>
          <p className="text-gray-600 text-lg">
            Gerencie suas informações profissionais e preferências
          </p>
        </div>

        {saveMessage && (
          <Alert className={`mb-6 ${saveMessage.includes('sucesso') ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <AlertDescription className={saveMessage.includes('sucesso') ? 'text-green-800' : 'text-red-800'}>
              {saveMessage}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 merriweather">
                <UserIcon className="w-5 h-5 text-[#6E0000]" />
                Perfil do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#6E0000] rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">
                    {user?.full_name?.[0]?.toUpperCase() || "U"}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{user?.full_name}</h3>
                <p className="text-sm text-gray-600">{user?.email}</p>
                <Badge className="mt-2 bg-[#6E0000] text-white">
                  {user?.role === 'admin' ? 'Administrador' : 'Advogado'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <div className="md:col-span-2">
            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 merriweather">
                  <SettingsIcon className="w-5 h-5 text-[#6E0000]" />
                  Informações Profissionais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="escritorio" className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-[#6E0000]" />
                      Nome do Escritório
                    </Label>
                    <Input
                      id="escritorio"
                      value={formData.escritorio}
                      onChange={(e) => handleInputChange('escritorio', e.target.value)}
                      placeholder="R Feitosa Group"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="oab_numero" className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#6E0000]" />
                      Número da OAB
                    </Label>
                    <Input
                      id="oab_numero"
                      value={formData.oab_numero}
                      onChange={(e) => handleInputChange('oab_numero', e.target.value)}
                      placeholder="OAB/XX 123456"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-[#6E0000]" />
                      Telefone
                    </Label>
                    <Input
                      id="telefone"
                      value={formData.telefone}
                      onChange={(e) => handleInputChange('telefone', e.target.value)}
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endereco" className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#6E0000]" />
                      Endereço do Escritório
                    </Label>
                    <Input
                      id="endereco"
                      value={formData.endereco}
                      onChange={(e) => handleInputChange('endereco', e.target.value)}
                      placeholder="Rua, número, cidade - UF"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="especialidades">Especialidades Jurídicas</Label>
                  <Textarea
                    id="especialidades"
                    value={formData.especialidades}
                    onChange={(e) => handleInputChange('especialidades', e.target.value)}
                    placeholder="Ex: Direito Trabalhista, Direito Civil, Direito Empresarial..."
                    className="h-24"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="assinatura_digital">Assinatura Digital</Label>
                  <Textarea
                    id="assinatura_digital"
                    value={formData.assinatura_digital}
                    onChange={(e) => handleInputChange('assinatura_digital', e.target.value)}
                    placeholder="Texto da assinatura que aparecerá nas petições..."
                    className="h-32"
                  />
                </div>

                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full bg-[#6E0000] hover:bg-[#8B1538] text-white font-semibold py-3"
                >
                  {isSaving ? (
                    <>
                      <Clock className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvar Configurações
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
