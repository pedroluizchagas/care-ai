'use client'

import {
  HomeIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon,
  DocumentTextIcon,
  TrophyIcon,
  CalendarIcon,
  CalendarDaysIcon,
  Bars3Icon,
  XMarkIcon,
  CogIcon,
  SparklesIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline'
import { useState, useEffect } from 'react'

type ActiveView =
  | 'dashboard'
  | 'chat'
  | 'tasks'
  | 'notes'
  | 'goals'
  | 'calendar'
  | 'finances'
  | 'settings'
  | 'profile'

interface SidebarProps {
  activeView: ActiveView
  setActiveView: (view: ActiveView) => void
  isOpen: boolean
  setIsOpen: (open: boolean) => void
}

const mainNavigation = [
  {
    name: 'Dashboard',
    href: 'dashboard' as const,
    icon: HomeIcon,
    description: 'Visão geral e estatísticas',
  },
  {
    name: 'Chat AI',
    href: 'chat' as const,
    icon: ChatBubbleLeftRightIcon,
    description: 'Assistente inteligente',
  },
]

const workNavigation = [
  {
    name: 'Tarefas',
    href: 'tasks' as const,
    icon: CheckCircleIcon,
    description: 'Gerenciar tarefas e projetos',
  },
  {
    name: 'Notas',
    href: 'notes' as const,
    icon: DocumentTextIcon,
    description: 'Anotações e lembretes',
  },
  {
    name: 'Metas',
    href: 'goals' as const,
    icon: TrophyIcon,
    description: 'Objetivos e conquistas',
  },
  {
    name: 'Agenda',
    href: 'calendar' as const,
    icon: CalendarIcon,
    description: 'Calendário e eventos',
  },
  {
    name: 'Finanças',
    href: 'finances' as const,
    icon: CurrencyDollarIcon,
    description: 'Gestão financeira pessoal',
  },
]

export default function Sidebar({
  activeView,
  setActiveView,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkIsMobile = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
    }

    checkIsMobile()
    window.addEventListener('resize', checkIsMobile)
    return () => window.removeEventListener('resize', checkIsMobile)
  }, [])

  const handleItemClick = (view: ActiveView) => {
    setActiveView(view)
    if (isMobile) {
      setIsOpen(false)
    }
  }

  const handleToggle = () => {
    setIsOpen(!isOpen)
  }

  // No mobile, só renderiza a sidebar se estiver aberta
  if (isMobile && !isOpen) {
    return null
  }

  // Overlay para mobile
  if (isMobile && isOpen) {
    return (
      <>
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setIsOpen(false)}
        />

        {/* Sidebar Mobile */}
        <div className="fixed left-0 top-0 h-full w-80 z-50 transition-transform duration-300">
          <div className="flex h-full flex-col glass-card m-2 rounded-3xl overflow-hidden">
            {/* Header */}
            <div className="flex h-20 items-center justify-between px-6 border-b border-white/10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow-blue">
                  <SparklesIcon className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <span className="text-xl font-bold text-white">CareAI</span>
                  <p className="text-xs text-white/60">Personal Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="icon-btn"
                aria-label="Fechar menu"
              >
                <XMarkIcon className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-6 px-4 space-y-6 overflow-y-auto">
              {/* Main Section */}
              <div className="space-y-2">
                <div className="px-2 mb-4">
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider text-left">
                    Principal
                  </h3>
                </div>
                {mainNavigation.map((item) => {
                  const isActive = activeView === item.href
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleItemClick(item.href)}
                      className={`w-full flex items-center px-4 py-3 space-x-3 rounded-2xl transition-all duration-200 ${
                        isActive
                          ? 'glass-active text-white shadow-glow-blue'
                          : 'text-white/70 hover:text-white hover:glass-hover'
                      }`}
                    >
                      <item.icon className="w-6 h-6 flex-shrink-0" />
                      <div className="min-w-0 text-left">
                        <span className="font-medium block truncate text-left">
                          {item.name}
                        </span>
                        <span className="text-xs text-white/50 block truncate text-left">
                          {item.description}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Divider */}
              <div className="border-t border-white/10 mx-2" />

              {/* Work Section */}
              <div className="space-y-2">
                <div className="px-2 mb-4">
                  <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider text-left">
                    Produtividade
                  </h3>
                </div>
                {workNavigation.map((item) => {
                  const isActive = activeView === item.href
                  return (
                    <button
                      key={item.name}
                      onClick={() => handleItemClick(item.href)}
                      className={`w-full flex items-center px-4 py-3 space-x-3 rounded-2xl transition-all duration-200 ${
                        isActive
                          ? 'glass-active text-white shadow-glow-blue'
                          : 'text-white/70 hover:text-white hover:glass-hover'
                      }`}
                    >
                      <item.icon className="w-6 h-6 flex-shrink-0" />
                      <div className="min-w-0 text-left">
                        <span className="font-medium block truncate text-left">
                          {item.name}
                        </span>
                        <span className="text-xs text-white/50 block truncate text-left">
                          {item.description}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </nav>

            {/* Footer */}
            <div className="border-t border-white/10 p-4 space-y-2">
              <button
                onClick={() => handleItemClick('settings')}
                className={`w-full flex items-center px-4 py-3 space-x-3 rounded-2xl transition-all duration-200 ${
                  activeView === 'settings'
                    ? 'glass-active text-white shadow-glow-blue'
                    : 'text-white/70 hover:text-white hover:glass-hover'
                }`}
              >
                <CogIcon className="w-6 h-6 flex-shrink-0" />
                <div className="min-w-0 text-left">
                  <span className="font-medium block truncate text-left">
                    Configurações
                  </span>
                  <span className="text-xs text-white/50 block truncate text-left">
                    Personalizar aplicativo
                  </span>
                </div>
              </button>
              <button
                onClick={() => handleItemClick('profile')}
                className={`w-full flex items-center px-4 py-3 space-x-3 rounded-2xl transition-all duration-200 ${
                  activeView === 'profile'
                    ? 'glass-active text-white shadow-glow-blue'
                    : 'text-white/70 hover:text-white hover:glass-hover'
                }`}
              >
                <UserCircleIcon className="w-6 h-6 flex-shrink-0" />
                <div className="min-w-0 text-left">
                  <span className="font-medium block truncate text-left">
                    Perfil
                  </span>
                  <span className="text-xs text-white/50 block truncate text-left">
                    Gerenciar conta
                  </span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </>
    )
  }

  // Desktop Sidebar
  return (
    <div
      className={`fixed left-0 top-0 h-full z-50 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-72' : 'w-20'
      }`}
    >
      <div className="flex h-full flex-col glass-card m-2 rounded-3xl overflow-hidden">
        {/* Header */}
        <div
          className={`flex h-20 items-center border-b border-white/10 flex-shrink-0 ${
            isOpen ? 'justify-between px-6' : 'justify-center px-2'
          }`}
        >
          {isOpen && (
            <div className="flex items-center space-x-3 min-w-0">
              <div className="w-10 h-10 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow-blue flex-shrink-0">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
              <div className="min-w-0 text-left">
                <span className="text-xl font-bold text-white block truncate text-left">
                  CareAI
                </span>
                <p className="text-xs text-white/60 truncate text-left">
                  Personal Assistant
                </p>
              </div>
            </div>
          )}
          {!isOpen && (
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow-blue">
                <SparklesIcon className="w-6 h-6 text-white" />
              </div>
            </div>
          )}
          {isOpen && (
            <button
              onClick={handleToggle}
              className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300"
              aria-label="Fechar menu"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav
          className={`flex-1 py-6 space-y-6 overflow-y-auto scrollbar-thin ${
            isOpen ? 'px-4' : 'px-2'
          }`}
        >
          {/* Botão hambúrguer quando fechado - posicionado no topo da navegação */}
          {!isOpen && (
            <div className="flex justify-center mb-4">
              <button
                onClick={handleToggle}
                className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all duration-300"
                aria-label="Abrir menu"
              >
                <Bars3Icon className="w-5 h-5" />
              </button>
            </div>
          )}

          {/* Main Section */}
          <div className="space-y-2">
            {isOpen && (
              <div className="px-2 mb-4">
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider text-left">
                  Principal
                </h3>
              </div>
            )}
            {mainNavigation.map((item) => {
              const isActive = activeView === item.href
              return (
                <button
                  key={item.name}
                  onClick={() => handleItemClick(item.href)}
                  className={`w-full flex items-center transition-all duration-200 rounded-2xl ${
                    isOpen ? 'px-4 py-3 space-x-3' : 'px-2 py-3 justify-center'
                  } ${
                    isActive
                      ? 'glass-active text-white shadow-glow-blue'
                      : 'text-white/70 hover:text-white hover:glass-hover'
                  }`}
                >
                  <item.icon
                    className={`flex-shrink-0 ${
                      isOpen ? 'w-6 h-6' : 'w-7 h-7'
                    }`}
                  />
                  {isOpen && (
                    <div className="min-w-0 text-left">
                      <span className="font-medium block truncate text-left">
                        {item.name}
                      </span>
                      <span className="text-xs text-white/50 block truncate text-left">
                        {item.description}
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>

          {/* Divider */}
          {isOpen && <div className="border-t border-white/10 mx-2" />}
          {!isOpen && <div className="border-t border-white/10 mx-2" />}

          {/* Work Section */}
          <div className="space-y-2">
            {isOpen && (
              <div className="px-2 mb-4">
                <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider text-left">
                  Produtividade
                </h3>
              </div>
            )}
            {workNavigation.map((item) => {
              const isActive = activeView === item.href
              return (
                <button
                  key={item.name}
                  onClick={() => handleItemClick(item.href)}
                  className={`w-full flex items-center transition-all duration-200 rounded-2xl ${
                    isOpen ? 'px-4 py-3 space-x-3' : 'px-2 py-3 justify-center'
                  } ${
                    isActive
                      ? 'glass-active text-white shadow-glow-blue'
                      : 'text-white/70 hover:text-white hover:glass-hover'
                  }`}
                >
                  <item.icon
                    className={`flex-shrink-0 ${
                      isOpen ? 'w-6 h-6' : 'w-7 h-7'
                    }`}
                  />
                  {isOpen && (
                    <div className="min-w-0 text-left">
                      <span className="font-medium block truncate text-left">
                        {item.name}
                      </span>
                      <span className="text-xs text-white/50 block truncate text-left">
                        {item.description}
                      </span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* Footer */}
        <div
          className={`border-t border-white/10 p-4 space-y-2 ${
            !isOpen ? 'flex flex-col items-center' : ''
          }`}
        >
          <button
            onClick={() => handleItemClick('settings')}
            className={`w-full flex items-center transition-all duration-200 rounded-2xl ${
              isOpen ? 'px-4 py-3 space-x-3' : 'px-2 py-3 justify-center'
            } ${
              activeView === 'settings'
                ? 'glass-active text-white shadow-glow-blue'
                : 'text-white/70 hover:text-white hover:glass-hover'
            }`}
          >
            <CogIcon
              className={`flex-shrink-0 ${isOpen ? 'w-6 h-6' : 'w-7 h-7'}`}
            />
            {isOpen && (
              <div className="min-w-0 text-left">
                <span className="font-medium block truncate text-left">
                  Configurações
                </span>
                <span className="text-xs text-white/50 block truncate text-left">
                  Personalizar aplicativo
                </span>
              </div>
            )}
          </button>
          <button
            onClick={() => handleItemClick('profile')}
            className={`w-full flex items-center transition-all duration-200 rounded-2xl ${
              isOpen ? 'px-4 py-3 space-x-3' : 'px-2 py-3 justify-center'
            } ${
              activeView === 'profile'
                ? 'glass-active text-white shadow-glow-blue'
                : 'text-white/70 hover:text-white hover:glass-hover'
            }`}
          >
            <UserCircleIcon
              className={`flex-shrink-0 ${isOpen ? 'w-6 h-6' : 'w-7 h-7'}`}
            />
            {isOpen && (
              <div className="min-w-0 text-left">
                <span className="font-medium block truncate text-left">
                  Perfil
                </span>
                <span className="text-xs text-white/50 block truncate text-left">
                  Gerenciar conta
                </span>
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
