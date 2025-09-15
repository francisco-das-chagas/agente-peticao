import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { createPageUrl } from '@/utils'
import {
  LayoutDashboard,
  FileText,
  History,
  Settings,
  Scale
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger
} from '@/components/ui/sidebar'

const navigationItems = [
  {
    title: 'Visão Geral',
    url: createPageUrl('VisaoGeral'),
    icon: LayoutDashboard
  },
  {
    title: 'Criar Petição',
    url: createPageUrl('CriarPeticao'),
    icon: FileText
  },
  {
    title: 'Histórico de Petições',
    url: createPageUrl('Historico'),
    icon: History
  },
  {
    title: 'Configurações',
    url: createPageUrl('Configuracoes'),
    icon: Settings
  }
]

export default function Layout({ children, currentPageName }) {
  const location = useLocation()

  return (
    <SidebarProvider>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&family=Inter:wght@300;400;500;600;700&display=swap');
          
          :root {
            --sidebar-bg: #6E0000;
            --sidebar-hover: #8B1538;
            --accent: #DC2626;
            --warm-bg: #FAFAF9;
            --text-primary: #1F2937;
            --text-secondary: #6B7280;
          }
          
          .sidebar-custom {
            background: linear-gradient(135deg, var(--sidebar-bg) 0%, #8B1538 100%);
          }
          
          .merriweather {
            font-family: 'Merriweather', serif;
          }
          
          .inter {
            font-family: 'Inter', sans-serif;
          }
        `}
      </style>
      <div className="min-h-screen flex w-full bg-[#FAFAF9] inter">
        <Sidebar className="border-r-0 sidebar-custom">
          {/* CABEÇALHO APENAS COM A LOGO */}
          <SidebarHeader className="bg-[#6E0000] p-6 flex flex-col items-center gap-2 border-b border-white/10">
            <div className="w-full h-32 rounded-lg flex items-center justify-center overflow-hidden p-2">
              <img
                // src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/user_68b03fb3ce559daab8005704/1f16d1bb9_Logo-RFeitosapng.png"
                src="src/Logo-Original.png"
                alt="R Feitosa Group"
                className="bg-[#6E0000] w-[400px] h-full object-contain"
              />
            </div>
          </SidebarHeader>

          <SidebarContent className="bg-[#6E0000] p-4 flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden">
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-2">
                  {navigationItems.map(item => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`
                            text-white transition-all duration-200 rounded-xl py-3 px-4
                            hover:bg-white hover:text-gray-900 
                            ${location.pathname === item.url ? 'bg-white text-gray-900 shadow-lg' : ''}
                          `}>
                        <Link to={item.url} className="flex items-center gap-4">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* RODAPÉ COM O NOME E DESCRIÇÃO */}
          <SidebarFooter className="bg-[#6E0000] p-6 flex flex-col items-center text-center gap-2 border-t border-white/10">
            <h2 className="font-bold text-white text-lg merriweather leading-tight">
              R Feitosa Group
            </h2>
            <p className="text-white/70 text-sm font-medium">
              Agente de Petição Jurídica
            </p>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          <header className="bg-white border-b border-gray-200 px-6 py-4 md:hidden shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <h1 className="text-xl font-semibold merriweather">
                Agente de Petição
              </h1>
            </div>
          </header>

          <div className="flex-1 overflow-auto">{children}</div>
        </main>
      </div>
    </SidebarProvider>
  )
}
