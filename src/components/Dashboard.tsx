'use client'

import { useState, useEffect } from 'react'
import { Task, Goal, Note, DashboardStats } from '@/types'
import { formatDate, calculateProductivityScore } from '@/lib/utils'
import {
  CalendarIcon,
  ClockIcon,
  TrophyIcon,
  DocumentTextIcon,
  PlusIcon,
  ArrowTrendingUpIcon,
  UserIcon,
  BellIcon,
  Squares2X2Icon,
  CheckCircleIcon,
  FireIcon,
  ChartBarIcon,
  SparklesIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid'

// Mock data como fallback
const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Revisar relatório mensal',
    description: 'Revisar e finalizar o relatório de vendas do mês',
    completed: false,
    priority: 'alta',
    category: 'Trabalho',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Exercitar-se',
    description: 'Fazer 30 minutos de exercício',
    completed: true,
    priority: 'média',
    category: 'Saúde',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    title: 'Estudar React',
    description: 'Completar módulo avançado',
    completed: false,
    priority: 'alta',
    category: 'Estudos',
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Ideias para novo projeto',
    content: 'Desenvolver um aplicativo de gestão de tempo com IA integrada...',
    category: 'Ideias',
    tags: ['projeto', 'ia', 'produtividade'],
    pinned: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    title: 'Notas da reunião',
    content: 'Discutir objetivos do próximo trimestre...',
    category: 'Reuniões',
    tags: ['trabalho', 'metas'],
    pinned: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Aprender TypeScript',
    description: 'Dominar TypeScript para desenvolvimento web moderno',
    category: 'Estudos',
    targetDate: new Date('2024-03-31'),
    progress: 75,
    milestones: [],
    completed: false,
    createdAt: new Date('2024-01-01T00:00:00Z'),
    updatedAt: new Date('2024-01-01T00:00:00Z'),
  },
  {
    id: '2',
    title: 'Exercitar-se 5x por semana',
    description: 'Manter consistência nos exercícios físicos',
    category: 'Saúde',
    targetDate: new Date('2024-06-30'),
    progress: 60,
    milestones: [],
    completed: false,
    createdAt: new Date('2024-01-15T00:00:00Z'),
    updatedAt: new Date('2024-01-15T00:00:00Z'),
  },
]

// Interface Event para dashboard (compatível com API)
interface Event {
  id: string
  title: string
  description: string
  location: string
  category: string
  startDate: string
  endDate: string | null
  allDay: boolean
  priority: string
  status: string
  reminder: string | null
  attendees: string | null
  createdAt: string
  updatedAt: string
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Reunião de Planejamento',
    description: 'Revisar objetivos e metas do trimestre',
    location: 'Sala de Reuniões A',
    category: 'Reunião',
    startDate: '2025-01-15T09:00:00',
    endDate: '2025-01-15T10:30:00',
    allDay: false,
    priority: 'HIGH',
    status: 'SCHEDULED',
    reminder: '15min',
    attendees: 'João, Maria, Pedro',
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
  },
  {
    id: '2',
    title: 'Consulta Médica',
    description: 'Check-up de rotina',
    location: 'Clínica São José',
    category: 'Consulta',
    startDate: '2025-01-20T14:00:00',
    endDate: '2025-01-20T15:00:00',
    allDay: false,
    priority: 'MEDIUM',
    status: 'SCHEDULED',
    reminder: '1hour',
    attendees: null,
    createdAt: '2025-01-18T00:00:00Z',
    updatedAt: '2025-01-18T00:00:00Z',
  },
]

// Interface para notificações
interface Notification {
  id: string
  eventId: string
  title: string
  message: string
  eventTime: Date
  reminderTime: Date
  read: boolean
  dismissed: boolean
}

type ActiveView =
  | 'dashboard'
  | 'chat'
  | 'tasks'
  | 'notes'
  | 'goals'
  | 'calendar'
  | 'settings'
  | 'profile'

interface DashboardProps {
  activeView?: string
  setActiveView?: (view: ActiveView) => void
}

export default function Dashboard({ setActiveView }: DashboardProps) {
  const [stats, setStats] = useState<DashboardStats>({
    tasksCompleted: 0,
    tasksTotal: 0,
    upcomingEvents: 0,
    activeGoals: 0,
    notesCount: 0,
    productivityScore: 0,
  })
  const [tasks, setTasks] = useState<Task[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [goals, setGoals] = useState<Goal[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())
  const [isLoading, setIsLoading] = useState(true)

  // Estados para notificações
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [showNotifications, setShowNotifications] = useState(false)
  const [hasUnreadNotifications, setHasUnreadNotifications] = useState(false)

  // Estados para configurações de visualização
  const [showViewSettings, setShowViewSettings] = useState(false)
  const [viewSettings, setViewSettings] = useState({
    layout: 'default', // 'default', 'compact', 'expanded'
    showMotivation: true,
    showStats: true,
    showQuickActions: true,
    showTodayTasks: true,
    showGoalsProgress: true,
    showUpcomingEvents: true,
    density: 'normal', // 'compact', 'normal', 'spacious'
  })

  useEffect(() => {
    console.log('🚀 Dashboard: Iniciando carregamento...')
    loadAllData()

    // Reduzir frequência do timer de 1s para 30s
    const timer = setInterval(() => {
      setCurrentTime(new Date())
      checkForNotifications()
    }, 30000) // Mudança de 1000 para 30000 (30 segundos)

    console.log('✅ Dashboard: Timer configurado')
    return () => {
      console.log('🧹 Dashboard: Limpando timer')
      clearInterval(timer)
    }
  }, [])

  useEffect(() => {
    console.log('📅 Dashboard: Eventos atualizados:', events.length)
    if (events.length > 0) {
      generateNotifications()
    }
  }, [events])

  const loadAllData = async () => {
    console.log('🚀 Dashboard: Carregando todos os dados...')
    setIsLoading(true)

    try {
      // Carregar dados mock primeiro (garantir que algo apareça)
      console.log('📦 Dashboard: Carregando dados mock...')
      setTasks(mockTasks)
      setNotes(mockNotes)
      setGoals(mockGoals)
      setEvents(mockEvents)
      calculateStats(mockTasks, mockNotes, mockGoals, mockEvents)
      console.log('✅ Dashboard: Dados mock carregados')

      // Tentar carregar da API sequencialmente para evitar sobrecarga
      console.log('🌐 Dashboard: Iniciando carregamento da API...')
      await loadTasks()
      await loadNotes()
      await loadGoals()
      await loadEvents()
      console.log('✅ Dashboard: Carregamento da API concluído')
    } catch (error) {
      console.error('❌ Erro ao carregar dados do dashboard:', error)
    } finally {
      console.log('🏁 Dashboard: Finalizando carregamento')
      setIsLoading(false)
    }
  }

  const loadTasks = async () => {
    try {
      console.log('📋 Carregando tarefas...')
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 segundos timeout

      const response = await fetch('/api/tasks?userId=user_1', {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Tarefas da API:', data.tasks?.length || 0)
        if (data.tasks && data.tasks.length > 0) {
          setTasks(data.tasks)
        }
      } else {
        console.log('⚠️ API tasks response não OK:', response.status)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('⏰ Timeout na requisição de tarefas')
      } else {
        console.log('⚠️ Erro ao carregar tarefas:', error.message)
      }
      console.log('⚠️ Usando tarefas mock')
    }
  }

  const loadNotes = async () => {
    try {
      console.log('📝 Carregando notas...')
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch('/api/notes?userId=user_1', {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Notas da API:', data.notes?.length || 0)
        if (data.notes && data.notes.length > 0) {
          setNotes(data.notes)
        }
      } else {
        console.log('⚠️ API notes response não OK:', response.status)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('⏰ Timeout na requisição de notas')
      } else {
        console.log('⚠️ Erro ao carregar notas:', error.message)
      }
      console.log('⚠️ Usando notas mock')
    }
  }

  const loadGoals = async () => {
    try {
      console.log('🎯 Carregando metas...')
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch('/api/goals?userId=user_1', {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Metas da API:', data.goals?.length || 0)
        if (data.goals && data.goals.length > 0) {
          setGoals(data.goals)
        }
      } else {
        console.log('⚠️ API goals response não OK:', response.status)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('⏰ Timeout na requisição de metas')
      } else {
        console.log('⚠️ Erro ao carregar metas:', error.message)
      }
      console.log('⚠️ Usando metas mock')
    }
  }

  const loadEvents = async () => {
    try {
      console.log('📅 Carregando eventos...')
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000)

      const response = await fetch('/api/events?userId=user_1', {
        signal: controller.signal,
      })
      clearTimeout(timeoutId)

      if (response.ok) {
        const data = await response.json()
        console.log('✅ Eventos da API:', data.events?.length || 0)
        if (data.events && data.events.length > 0) {
          setEvents(data.events)
        }
      } else {
        console.log('⚠️ API events response não OK:', response.status)
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('⏰ Timeout na requisição de eventos')
      } else {
        console.log('⚠️ Erro ao carregar eventos:', error.message)
      }
      console.log('⚠️ Usando eventos mock')
    }
  }

  const calculateStats = (
    currentTasks: Task[],
    currentNotes: Note[],
    currentGoals: Goal[],
    currentEvents: Event[]
  ) => {
    const completed = currentTasks.filter((t) => t.completed).length
    const total = currentTasks.length
    const upcoming = currentEvents.filter((e) => {
      const eventDate = new Date(e.startDate)
      const now = new Date()
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      return eventDate > now && eventDate <= weekFromNow
    }).length
    const active = currentGoals.filter((g) => !g.completed).length
    const goalsProgress = currentGoals.map((g) => g.progress || 0)

    const newStats = {
      tasksCompleted: completed,
      tasksTotal: total,
      upcomingEvents: upcoming,
      activeGoals: active,
      notesCount: currentNotes.length,
      productivityScore: calculateProductivityScore(
        completed,
        total,
        goalsProgress
      ),
    }

    console.log('📊 Estatísticas calculadas:', newStats)
    setStats(newStats)
  }

  // Recalcular stats quando dados mudarem
  useEffect(() => {
    calculateStats(tasks, notes, goals, events)
  }, [tasks, notes, goals, events])

  const getGreeting = () => {
    const hour = currentTime.getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'crítica':
      case 'critical':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'alta':
      case 'high':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'média':
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'baixa':
      case 'low':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      default:
        return 'bg-white/10 text-white/60 border-white/20'
    }
  }

  // Funções de navegação para as ações rápidas
  const handleQuickAction = (view: string) => {
    if (setActiveView) {
      setActiveView(view as ActiveView)
    }
  }

  // Função para gerar notificações baseadas nos eventos com lembretes
  const generateNotifications = () => {
    const newNotifications: Notification[] = []
    const now = new Date()

    events.forEach((event) => {
      if (event.reminder && event.reminder !== '') {
        const eventTime = new Date(event.startDate)
        const reminderMinutes = parseReminderTime(event.reminder)

        if (reminderMinutes > 0) {
          const reminderTime = new Date(
            eventTime.getTime() - reminderMinutes * 60000
          )

          // Só gerar notificação se o lembrete é no futuro
          if (reminderTime > now) {
            const notification: Notification = {
              id: `${event.id}-${reminderMinutes}`,
              eventId: event.id,
              title: `Lembrete: ${event.title}`,
              message: `${event.title} começará em ${event.reminder}`,
              eventTime: eventTime,
              reminderTime: reminderTime,
              read: false,
              dismissed: false,
            }

            newNotifications.push(notification)
          }
        }
      }
    })

    setNotifications(newNotifications)
  }

  // Função para converter tempo de lembrete em minutos
  const parseReminderTime = (reminder: string): number => {
    const reminderMap: { [key: string]: number } = {
      '5min': 5,
      '10min': 10,
      '15min': 15,
      '30min': 30,
      '1hour': 60,
      '2hours': 120,
      '1day': 1440,
    }

    return reminderMap[reminder] || 0
  }

  // Função para verificar se é hora de mostrar notificações
  const checkForNotifications = () => {
    const now = new Date()
    let shouldUpdateUnread = false

    notifications.forEach((notification) => {
      // Verificar se é hora de mostrar a notificação e ela ainda não foi lida
      if (
        !notification.read &&
        !notification.dismissed &&
        now >= notification.reminderTime
      ) {
        shouldUpdateUnread = true

        // Mostrar notificação do navegador se possível
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification(notification.title, {
            body: notification.message,
            icon: '/logo.png',
          })
        }
      }
    })

    if (shouldUpdateUnread) {
      setHasUnreadNotifications(true)
    }

    // Verificar se ainda há notificações não lidas ativas
    const activeUnreadNotifications = notifications.filter(
      (n) => !n.read && !n.dismissed && now >= n.reminderTime
    )

    setHasUnreadNotifications(activeUnreadNotifications.length > 0)
  }

  // Função para marcar notificação como lida
  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    )

    // Verificar se ainda há notificações não lidas
    const unreadCount = notifications.filter(
      (n) => !n.read && !n.dismissed
    ).length
    setHasUnreadNotifications(unreadCount > 1) // > 1 porque esta ainda não foi atualizada
  }

  // Função para dispensar notificação
  const dismissNotification = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, dismissed: true, read: true }
          : notification
      )
    )

    // Verificar se ainda há notificações não lidas
    const unreadCount = notifications.filter(
      (n) => !n.read && !n.dismissed
    ).length
    setHasUnreadNotifications(unreadCount > 1)
  }

  // Função para solicitar permissão de notificação
  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }

  useEffect(() => {
    requestNotificationPermission()
  }, [])

  // Fechar dropdown de notificações ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (showNotifications && !target.closest('.notification-dropdown')) {
        setShowNotifications(false)
      }
      if (showViewSettings && !target.closest('.view-settings-dropdown')) {
        setShowViewSettings(false)
      }
    }

    if (showNotifications || showViewSettings) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showNotifications, showViewSettings])

  // Carregar configurações de visualização do localStorage
  useEffect(() => {
    const savedSettings = localStorage.getItem('dashboard-view-settings')
    if (savedSettings) {
      setViewSettings(JSON.parse(savedSettings))
    }
  }, [])

  // Salvar configurações quando mudarem
  useEffect(() => {
    localStorage.setItem(
      'dashboard-view-settings',
      JSON.stringify(viewSettings)
    )
  }, [viewSettings])

  // Função para atualizar configurações de visualização
  const updateViewSetting = (key: string, value: any) => {
    setViewSettings((prev) => ({ ...prev, [key]: value }))
  }

  // Função para resetar configurações
  const resetViewSettings = () => {
    const defaultSettings = {
      layout: 'default',
      showMotivation: true,
      showStats: true,
      showQuickActions: true,
      showTodayTasks: true,
      showGoalsProgress: true,
      showUpcomingEvents: true,
      density: 'normal',
    }
    setViewSettings(defaultSettings)
  }

  if (isLoading) {
    return (
      <div className="h-full bg-gradient-main flex items-center justify-center">
        <div className="text-center">
          <SparklesIcon className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Carregando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-main overflow-auto">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-accent flex items-center justify-center shadow-glow-blue">
              <UserIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                {getGreeting()}, Usuário
              </h1>
              <p className="text-white/60 text-sm">
                {formatTime(currentTime)} • {formatDate(new Date())}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Botão de Notificações */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`icon-btn relative transition-all duration-300 ${
                  hasUnreadNotifications
                    ? 'bg-yellow-500/20 border-yellow-400/30 shadow-glow-blue'
                    : ''
                }`}
              >
                {hasUnreadNotifications ? (
                  <BellSolidIcon className="w-5 h-5 text-yellow-400" />
                ) : (
                  <BellIcon className="w-5 h-5 text-white" />
                )}

                {/* Badge de notificações não lidas */}
                {hasUnreadNotifications && (
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-gray-900 animate-pulse"></span>
                )}
              </button>

              {/* Dropdown de Notificações */}
              {showNotifications && (
                <div className="notification-dropdown absolute right-0 top-12 w-72 glass-card rounded-3xl shadow-dark-lg z-50 overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <h3 className="text-white font-semibold text-lg">
                      Notificações
                    </h3>
                    <p className="text-white/60 text-sm mt-1">
                      {
                        notifications.filter((n) => !n.read && !n.dismissed)
                          .length
                      }{' '}
                      não lidas
                    </p>
                  </div>

                  <div className="max-h-96 overflow-y-auto scrollbar-thin">
                    {notifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                          <BellIcon className="w-8 h-8 text-white/30" />
                        </div>
                        <p className="text-white/60 font-medium mb-2">
                          Nenhuma notificação
                        </p>
                        <p className="text-white/40 text-sm">
                          Você será notificado sobre seus compromissos
                        </p>
                      </div>
                    ) : (
                      <div className="p-3">
                        {notifications
                          .filter((notification) => !notification.dismissed)
                          .sort(
                            (a, b) =>
                              b.reminderTime.getTime() -
                              a.reminderTime.getTime()
                          )
                          .map((notification) => {
                            const isActive =
                              new Date() >= notification.reminderTime
                            const event = events.find(
                              (e) => e.id === notification.eventId
                            )

                            return (
                              <div
                                key={notification.id}
                                className={`p-4 rounded-2xl mb-3 transition-all duration-300 border ${
                                  !notification.read && isActive
                                    ? 'glass-active border-blue-400/30'
                                    : 'dark-card-secondary border-white/5 hover:border-white/10'
                                }`}
                              >
                                <div className="flex items-start justify-between">
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-2">
                                      <div
                                        className={`w-3 h-3 rounded-full ${
                                          !notification.read && isActive
                                            ? 'bg-blue-400 shadow-glow-blue'
                                            : 'bg-white/20'
                                        }`}
                                      />
                                      <h4 className="text-white text-sm font-semibold truncate">
                                        {notification.title}
                                      </h4>
                                    </div>
                                    <p className="text-white/70 text-sm mb-3 leading-relaxed">
                                      {notification.message}
                                    </p>
                                    {event && (
                                      <div className="flex items-center space-x-1 text-xs text-white/50">
                                        <ClockIcon className="w-3 h-3" />
                                        <span>
                                          {new Date(
                                            event.startDate
                                          ).toLocaleDateString('pt-BR')}{' '}
                                          às{' '}
                                          {new Date(
                                            event.startDate
                                          ).toLocaleTimeString('pt-BR', {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                          })}
                                        </span>
                                      </div>
                                    )}
                                  </div>

                                  <button
                                    onClick={() =>
                                      dismissNotification(notification.id)
                                    }
                                    className="ml-3 w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/40 hover:text-white/80 transition-all duration-200"
                                  >
                                    <XMarkIcon className="w-4 h-4" />
                                  </button>
                                </div>

                                {!notification.read && isActive && (
                                  <button
                                    onClick={() =>
                                      markNotificationAsRead(notification.id)
                                    }
                                    className="w-full mt-3 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-medium rounded-xl transition-all duration-200 border border-blue-500/30"
                                  >
                                    Marcar como lida
                                  </button>
                                )}
                              </div>
                            )
                          })}
                      </div>
                    )}
                  </div>

                  {notifications.filter((n) => !n.dismissed).length > 0 && (
                    <div className="p-4 border-t border-white/10">
                      <button
                        onClick={() => {
                          setNotifications((prev) =>
                            prev.map((n) => ({ ...n, read: true }))
                          )
                          setHasUnreadNotifications(false)
                        }}
                        className="w-full text-center text-blue-400 hover:text-blue-300 text-sm font-medium py-2 rounded-xl hover:bg-blue-500/10 transition-all duration-200"
                      >
                        Marcar todas como lidas
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Botão de Configurações de Visualização */}
            <div className="relative">
              <button
                onClick={() => setShowViewSettings(!showViewSettings)}
                className="icon-btn transition-all duration-300"
              >
                <Squares2X2Icon className="w-5 h-5 text-white" />
              </button>

              {/* Dropdown de Configurações de Visualização */}
              {showViewSettings && (
                <div className="view-settings-dropdown absolute right-0 top-12 w-72 glass-card rounded-3xl shadow-dark-lg z-50 overflow-hidden">
                  <div className="p-6 border-b border-white/10">
                    <h3 className="text-white font-semibold text-lg">
                      Configurações de Visualização
                    </h3>
                    <p className="text-white/60 text-sm mt-1">
                      Personalize como o dashboard é exibido
                    </p>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Layout */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Layout
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: 'default', label: 'Padrão' },
                          { key: 'compact', label: 'Compacto' },
                          { key: 'expanded', label: 'Expandido' },
                        ].map((layout) => (
                          <button
                            key={layout.key}
                            onClick={() =>
                              updateViewSetting('layout', layout.key)
                            }
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                              viewSettings.layout === layout.key
                                ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
                                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-transparent'
                            }`}
                          >
                            {layout.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Densidade */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Densidade
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { key: 'compact', label: 'Compacta' },
                          { key: 'normal', label: 'Normal' },
                          { key: 'spacious', label: 'Espaçosa' },
                        ].map((density) => (
                          <button
                            key={density.key}
                            onClick={() =>
                              updateViewSetting('density', density.key)
                            }
                            className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 ${
                              viewSettings.density === density.key
                                ? 'bg-blue-500/30 text-blue-400 border border-blue-500/50'
                                : 'bg-white/5 text-white/70 hover:bg-white/10 border border-transparent'
                            }`}
                          >
                            {density.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Widgets para mostrar/ocultar */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-3">
                        Widgets Visíveis
                      </label>
                      <div className="space-y-2">
                        {[
                          {
                            key: 'showMotivation',
                            label: 'Mensagem Motivacional',
                          },
                          { key: 'showStats', label: 'Estatísticas' },
                          { key: 'showQuickActions', label: 'Ações Rápidas' },
                          { key: 'showTodayTasks', label: 'Tarefas de Hoje' },
                          {
                            key: 'showGoalsProgress',
                            label: 'Progresso das Metas',
                          },
                          {
                            key: 'showUpcomingEvents',
                            label: 'Próximos Eventos',
                          },
                        ].map((widget) => (
                          <label
                            key={widget.key}
                            className="flex items-center justify-between"
                          >
                            <span className="text-white/70 text-sm">
                              {widget.label}
                            </span>
                            <button
                              onClick={() =>
                                updateViewSetting(
                                  widget.key,
                                  !viewSettings[
                                    widget.key as keyof typeof viewSettings
                                  ]
                                )
                              }
                              className={`relative w-11 h-6 rounded-full transition-all duration-200 ${
                                viewSettings[
                                  widget.key as keyof typeof viewSettings
                                ]
                                  ? 'bg-blue-500'
                                  : 'bg-white/20'
                              }`}
                            >
                              <div
                                className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-200 ${
                                  viewSettings[
                                    widget.key as keyof typeof viewSettings
                                  ]
                                    ? 'left-5'
                                    : 'left-0.5'
                                }`}
                              />
                            </button>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer com ações */}
                  <div className="p-4 border-t border-white/10 flex items-center justify-between">
                    <button
                      onClick={resetViewSettings}
                      className="text-white/60 hover:text-white/80 text-sm font-medium transition-colors"
                    >
                      Resetar
                    </button>
                    <button
                      onClick={() => setShowViewSettings(false)}
                      className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-sm font-medium rounded-xl transition-all duration-200 border border-blue-500/30"
                    >
                      Aplicar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Motivational Message */}
        {viewSettings.showMotivation && (
          <div
            className={`glass-card rounded-3xl mb-6 ${
              viewSettings.density === 'compact'
                ? 'p-4'
                : viewSettings.density === 'spacious'
                ? 'p-8'
                : 'p-6'
            }`}
          >
            <div className="flex items-center space-x-3">
              <ArrowTrendingUpIcon className="w-8 h-8 text-primary-400" />
              <div>
                <h2
                  className={`font-semibold text-white mb-1 ${
                    viewSettings.layout === 'compact' ? 'text-lg' : 'text-xl'
                  }`}
                >
                  Seja útil agora mesmo.
                </h2>
                <p className="text-white/70 text-sm">
                  Transforme suas ideias em ações e conquiste seus objetivos
                  hoje!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        {viewSettings.showStats && (
          <div
            className={`grid gap-4 mb-8 ${
              viewSettings.layout === 'compact'
                ? 'grid-cols-2 lg:grid-cols-4'
                : viewSettings.layout === 'expanded'
                ? 'grid-cols-1 md:grid-cols-2'
                : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            } ${viewSettings.density === 'spacious' ? 'gap-6' : 'gap-4'}`}
          >
            <div className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white/60 text-sm font-medium">Tarefas</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.tasksCompleted}/{stats.tasksTotal}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-primary-500/20 flex items-center justify-center">
                  <CheckCircleIcon className="w-6 h-6 text-primary-400" />
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${
                      stats.tasksTotal > 0
                        ? (stats.tasksCompleted / stats.tasksTotal) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white/60 text-sm font-medium">Eventos</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.upcomingEvents}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <CalendarIcon className="w-6 h-6 text-blue-400" />
                </div>
              </div>
              <p className="text-white/60 text-xs">Próximos 7 dias</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white/60 text-sm font-medium">Metas</p>
                  <p className="text-2xl font-bold text-white">
                    {stats.activeGoals}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                  <TrophyIcon className="w-6 h-6 text-yellow-400" />
                </div>
              </div>
              <p className="text-white/60 text-xs">Em progresso</p>
            </div>

            <div className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-white/60 text-sm font-medium">
                    Produtividade
                  </p>
                  <p className="text-2xl font-bold text-white">
                    {stats.productivityScore}%
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
                  <ArrowTrendingUpIcon className="w-6 h-6 text-green-400" />
                </div>
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${stats.productivityScore}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        {viewSettings.showQuickActions && (
          <div
            className={`grid gap-4 mb-8 ${
              viewSettings.layout === 'compact'
                ? 'grid-cols-4'
                : viewSettings.layout === 'expanded'
                ? 'grid-cols-1 sm:grid-cols-2'
                : 'grid-cols-2 lg:grid-cols-4'
            } ${viewSettings.density === 'spacious' ? 'gap-6' : 'gap-4'}`}
          >
            <button
              onClick={() => handleQuickAction('tasks')}
              className={`glass-card rounded-2xl hover:scale-105 transition-all duration-200 text-left ${
                viewSettings.density === 'compact'
                  ? 'p-3'
                  : viewSettings.density === 'spacious'
                  ? 'p-6'
                  : 'p-4'
              }`}
            >
              <CheckCircleIcon className="w-8 h-8 text-blue-400 mb-2" />
              <h3 className="text-white font-medium mb-1">Nova Tarefa</h3>
              {viewSettings.layout !== 'compact' && (
                <p className="text-white/60 text-sm">Adicionar item à lista</p>
              )}
            </button>

            <button
              onClick={() => handleQuickAction('notes')}
              className={`glass-card rounded-2xl hover:scale-105 transition-all duration-200 text-left ${
                viewSettings.density === 'compact'
                  ? 'p-3'
                  : viewSettings.density === 'spacious'
                  ? 'p-6'
                  : 'p-4'
              }`}
            >
              <DocumentTextIcon className="w-8 h-8 text-green-400 mb-2" />
              <h3 className="text-white font-medium mb-1">Nova Nota</h3>
              {viewSettings.layout !== 'compact' && (
                <p className="text-white/60 text-sm">Capturar uma ideia</p>
              )}
            </button>

            <button
              onClick={() => handleQuickAction('goals')}
              className={`glass-card rounded-2xl hover:scale-105 transition-all duration-200 text-left ${
                viewSettings.density === 'compact'
                  ? 'p-3'
                  : viewSettings.density === 'spacious'
                  ? 'p-6'
                  : 'p-4'
              }`}
            >
              <TrophyIcon className="w-8 h-8 text-yellow-400 mb-2" />
              <h3 className="text-white font-medium mb-1">Nova Meta</h3>
              {viewSettings.layout !== 'compact' && (
                <p className="text-white/60 text-sm">Definir objetivo</p>
              )}
            </button>

            <button
              onClick={() => handleQuickAction('calendar')}
              className={`glass-card rounded-2xl hover:scale-105 transition-all duration-200 text-left ${
                viewSettings.density === 'compact'
                  ? 'p-3'
                  : viewSettings.density === 'spacious'
                  ? 'p-6'
                  : 'p-4'
              }`}
            >
              <CalendarIcon className="w-8 h-8 text-purple-400 mb-2" />
              <h3 className="text-white font-medium mb-1">Novo Evento</h3>
              {viewSettings.layout !== 'compact' && (
                <p className="text-white/60 text-sm">Agendar compromisso</p>
              )}
            </button>
          </div>
        )}

        {/* Today Tasks */}
        {viewSettings.showTodayTasks && (
          <div
            className={`dark-card rounded-3xl mb-6 ${
              viewSettings.density === 'compact'
                ? 'p-4'
                : viewSettings.density === 'spacious'
                ? 'p-8'
                : 'p-6'
            }`}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                Tarefas de Hoje
              </h3>
              <button
                onClick={() => handleQuickAction('tasks')}
                className="btn-ghost flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span className="text-sm">Adicionar</span>
              </button>
            </div>

            <div className="space-y-3">
              {tasks.length > 0 ? (
                tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="task-item">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          task.completed
                            ? 'bg-primary-500 border-primary-500'
                            : 'border-white/30'
                        }`}
                      />
                      <div className="flex-1">
                        <h4
                          className={`font-medium ${
                            task.completed
                              ? 'text-white/50 line-through'
                              : 'text-white'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <div className="flex items-center space-x-3 mt-1">
                          <span className="text-white/60 text-xs">
                            {task.category}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        </div>
                      </div>
                      <div className="text-white/40 text-sm">
                        {task.dueDate ? formatDate(task.dueDate) : 'Sem prazo'}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <ClockIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
                  <p className="text-white/60">Nenhuma tarefa para hoje</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resumo de Atividades */}
        <div
          className={`grid gap-6 ${
            viewSettings.layout === 'expanded'
              ? 'grid-cols-1'
              : 'grid-cols-1 lg:grid-cols-2'
          } ${viewSettings.density === 'spacious' ? 'gap-8' : 'gap-6'}`}
        >
          {/* Metas em Progresso */}
          {viewSettings.showGoalsProgress && (
            <div
              className={`dark-card rounded-3xl ${
                viewSettings.density === 'compact'
                  ? 'p-4'
                  : viewSettings.density === 'spacious'
                  ? 'p-8'
                  : 'p-6'
              }`}
            >
              <h3
                className={`font-semibold text-white mb-6 ${
                  viewSettings.layout === 'compact' ? 'text-lg' : 'text-xl'
                }`}
              >
                Metas em Progresso
              </h3>
              <div
                className={`space-y-4 ${
                  viewSettings.density === 'spacious'
                    ? 'space-y-6'
                    : 'space-y-4'
                }`}
              >
                {goals
                  .filter((g) => !g.completed)
                  .slice(0, 3)
                  .map((goal) => (
                    <div key={goal.id} className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                        <TrophyIcon className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">{goal.title}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex-1 bg-white/10 rounded-full h-2">
                            <div
                              className="bg-yellow-400 h-2 rounded-full"
                              style={{ width: `${goal.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-white/60 text-sm">
                            {goal.progress || 0}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                {goals.filter((g) => !g.completed).length === 0 && (
                  <div className="text-center py-8">
                    <TrophyIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/60">Nenhuma meta ativa</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Próximos Eventos */}
          {viewSettings.showUpcomingEvents && (
            <div
              className={`dark-card rounded-3xl ${
                viewSettings.density === 'compact'
                  ? 'p-4'
                  : viewSettings.density === 'spacious'
                  ? 'p-8'
                  : 'p-6'
              }`}
            >
              <h3
                className={`font-semibold text-white mb-6 ${
                  viewSettings.layout === 'compact' ? 'text-lg' : 'text-xl'
                }`}
              >
                Próximos Eventos
              </h3>
              <div
                className={`space-y-4 ${
                  viewSettings.density === 'spacious'
                    ? 'space-y-6'
                    : 'space-y-4'
                }`}
              >
                {events
                  .filter((e) => new Date(e.startDate) > new Date())
                  .slice(0, 3)
                  .map((event) => (
                    <div key={event.id} className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                        <CalendarIcon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">
                          {event.title}
                        </h4>
                        <p className="text-white/60 text-sm">
                          {new Date(event.startDate).toLocaleDateString(
                            'pt-BR'
                          )}{' '}
                          às{' '}
                          {new Date(event.startDate).toLocaleTimeString(
                            'pt-BR',
                            {
                              hour: '2-digit',
                              minute: '2-digit',
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                {events.filter((e) => new Date(e.startDate) > new Date())
                  .length === 0 && (
                  <div className="text-center py-8">
                    <CalendarIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/60">Nenhum evento próximo</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
