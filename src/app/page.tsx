'use client'

import { useState } from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import Sidebar from '@/presentation/components/Sidebar'
import Dashboard from '@/presentation/components/Dashboard'
import Chat from '@/presentation/components/Chat'
import Tasks from '@/presentation/components/Tasks'
import Notes from '@/presentation/components/Notes'
import Goals from '@/presentation/components/Goals'
import Calendar from '@/presentation/components/Calendar'
import Events from '@/presentation/components/Events'
import Settings from '@/presentation/components/Settings'
import Profile from '@/presentation/components/Profile'

type ActiveView =
  | 'dashboard'
  | 'chat'
  | 'tasks'
  | 'notes'
  | 'goals'
  | 'calendar'
  | 'settings'
  | 'profile'

export default function Home() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const renderActiveView = () => {
    switch (activeView) {
      case 'dashboard':
        return <Dashboard setActiveView={setActiveView} />
      case 'chat':
        return <Chat />
      case 'tasks':
        return <Tasks />
      case 'notes':
        return <Notes />
      case 'goals':
        return <Goals />
      case 'calendar':
        return <Events />
      case 'settings':
        return <Settings />
      case 'profile':
        return <Profile />
      default:
        return <Dashboard setActiveView={setActiveView} />
    }
  }

  const getPageTitle = () => {
    switch (activeView) {
      case 'dashboard':
        return 'Dashboard'
      case 'chat':
        return 'Chat AI'
      case 'tasks':
        return 'Tarefas'
      case 'notes':
        return 'Notas'
      case 'goals':
        return 'Metas'
      case 'calendar':
        return 'Agenda'
      case 'settings':
        return 'Configurações'
      case 'profile':
        return 'Perfil'
      default:
        return 'Dashboard'
    }
  }

  return (
    <div className="flex h-screen bg-gradient-main overflow-hidden">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Header mobile */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 h-16 glass-card m-2 rounded-2xl flex items-center justify-between px-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="icon-btn"
          aria-label="Abrir menu"
        >
          <Bars3Icon className="w-6 h-6 text-white" />
        </button>
        <h1 className="text-lg font-semibold text-white">{getPageTitle()}</h1>
        <div className="w-10" /> {/* Spacer para centralizar o título */}
      </div>

      <main
        className={`flex-1 transition-all duration-300 ease-in-out ${
          // Mobile: padding top para o header mobile, sem margem lateral
          'pt-20 md:pt-0'
        } ${
          // Desktop: margem lateral baseada no estado da sidebar
          sidebarOpen ? 'md:ml-72' : 'md:ml-20'
        }`}
      >
        <div className="h-full overflow-auto p-2">
          <div className="min-h-full rounded-3xl">{renderActiveView()}</div>
        </div>
      </main>
    </div>
  )
}
