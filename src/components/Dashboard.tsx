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
} from '@heroicons/react/24/outline'

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

  useEffect(() => {
    loadAllData()
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const loadAllData = async () => {
    console.log('🚀 Dashboard: Carregando todos os dados...')
    setIsLoading(true)

    try {
      // Carregar dados mock primeiro (garantir que algo apareça)
      setTasks(mockTasks)
      setNotes(mockNotes)
      setGoals(mockGoals)
      setEvents(mockEvents)
      calculateStats(mockTasks, mockNotes, mockGoals, mockEvents)

      // Tentar carregar da API
      await Promise.all([loadTasks(), loadNotes(), loadGoals(), loadEvents()])
    } catch (error) {
      console.error('❌ Erro ao carregar dados do dashboard:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadTasks = async () => {
    try {
      console.log('📋 Carregando tarefas...')
      const response = await fetch('/api/tasks?userId=user_1')
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Tarefas da API:', data.tasks?.length || 0)
        if (data.tasks && data.tasks.length > 0) {
          setTasks(data.tasks)
        }
      }
    } catch (error) {
      console.log('⚠️ Usando tarefas mock')
    }
  }

  const loadNotes = async () => {
    try {
      console.log('📝 Carregando notas...')
      const response = await fetch('/api/notes?userId=user_1')
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Notas da API:', data.notes?.length || 0)
        if (data.notes && data.notes.length > 0) {
          setNotes(data.notes)
        }
      }
    } catch (error) {
      console.log('⚠️ Usando notas mock')
    }
  }

  const loadGoals = async () => {
    try {
      console.log('🎯 Carregando metas...')
      const response = await fetch('/api/goals?userId=user_1')
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Metas da API:', data.goals?.length || 0)
        if (data.goals && data.goals.length > 0) {
          setGoals(data.goals)
        }
      }
    } catch (error) {
      console.log('⚠️ Usando metas mock')
    }
  }

  const loadEvents = async () => {
    try {
      console.log('📅 Carregando eventos...')
      const response = await fetch('/api/events?userId=user_1')
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Eventos da API:', data.events?.length || 0)
        if (data.events && data.events.length > 0) {
          setEvents(data.events)
        }
      }
    } catch (error) {
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
            <button className="icon-btn">
              <BellIcon className="w-5 h-5 text-white" />
            </button>
            <button className="icon-btn">
              <Squares2X2Icon className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Motivational Message */}
        <div className="glass-card p-6 rounded-3xl mb-6">
          <div className="flex items-center space-x-3">
            <ArrowTrendingUpIcon className="w-8 h-8 text-primary-400" />
            <div>
              <h2 className="text-xl font-semibold text-white mb-1">
                Seja útil agora mesmo.
              </h2>
              <p className="text-white/70 text-sm">
                Transforme suas ideias em ações e conquiste seus objetivos hoje!
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => handleQuickAction('tasks')}
            className="glass-card p-4 rounded-2xl hover:scale-105 transition-all duration-200 text-left"
          >
            <CheckCircleIcon className="w-8 h-8 text-blue-400 mb-2" />
            <h3 className="text-white font-medium mb-1">Nova Tarefa</h3>
            <p className="text-white/60 text-sm">Adicionar item à lista</p>
          </button>

          <button
            onClick={() => handleQuickAction('notes')}
            className="glass-card p-4 rounded-2xl hover:scale-105 transition-all duration-200 text-left"
          >
            <DocumentTextIcon className="w-8 h-8 text-green-400 mb-2" />
            <h3 className="text-white font-medium mb-1">Nova Nota</h3>
            <p className="text-white/60 text-sm">Capturar uma ideia</p>
          </button>

          <button
            onClick={() => handleQuickAction('goals')}
            className="glass-card p-4 rounded-2xl hover:scale-105 transition-all duration-200 text-left"
          >
            <TrophyIcon className="w-8 h-8 text-yellow-400 mb-2" />
            <h3 className="text-white font-medium mb-1">Nova Meta</h3>
            <p className="text-white/60 text-sm">Definir objetivo</p>
          </button>

          <button
            onClick={() => handleQuickAction('calendar')}
            className="glass-card p-4 rounded-2xl hover:scale-105 transition-all duration-200 text-left"
          >
            <CalendarIcon className="w-8 h-8 text-purple-400 mb-2" />
            <h3 className="text-white font-medium mb-1">Novo Evento</h3>
            <p className="text-white/60 text-sm">Agendar compromisso</p>
          </button>
        </div>

        {/* Today Tasks */}
        <div className="dark-card p-6 rounded-3xl mb-6">
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

        {/* Resumo de Atividades */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Metas em Progresso */}
          <div className="dark-card p-6 rounded-3xl">
            <h3 className="text-xl font-semibold text-white mb-6">
              Metas em Progresso
            </h3>
            <div className="space-y-4">
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

          {/* Próximos Eventos */}
          <div className="dark-card p-6 rounded-3xl">
            <h3 className="text-xl font-semibold text-white mb-6">
              Próximos Eventos
            </h3>
            <div className="space-y-4">
              {events
                .filter((e) => new Date(e.startDate) > new Date())
                .slice(0, 3)
                .map((event) => (
                  <div key={event.id} className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                      <CalendarIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium">{event.title}</h4>
                      <p className="text-white/60 text-sm">
                        {new Date(event.startDate).toLocaleDateString('pt-BR')}{' '}
                        às{' '}
                        {new Date(event.startDate).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
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
        </div>
      </div>
    </div>
  )
}
