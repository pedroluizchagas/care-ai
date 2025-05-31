'use client'

import { useState, useEffect } from 'react'
import { store } from '@/lib/store'
import { Task, Goal, DashboardStats } from '@/types'
import {
  formatDate,
  getPriorityColor,
  getProgressColor,
  calculateProductivityScore,
} from '@/lib/utils'
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
} from '@heroicons/react/24/outline'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    tasksCompleted: 0,
    tasksTotal: 0,
    upcomingEvents: 0,
    activeGoals: 0,
    notesCount: 0,
    productivityScore: 0,
  })
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [activeGoals, setActiveGoals] = useState<Goal[]>([])
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    loadDashboardData()
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const loadDashboardData = () => {
    const tasks = store.getTasks()
    const goals = store.getGoals()
    const notes = store.getNotes()
    const events = store.getEvents()

    const completed = tasks.filter((t) => t.completed).length
    const total = tasks.length
    const upcoming = events.filter(
      (e) =>
        new Date(e.startDate) > new Date() &&
        new Date(e.startDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    ).length
    const active = goals.filter((g) => !g.completed).length
    const goalsProgress = goals.map((g) => g.progress)

    setStats({
      tasksCompleted: completed,
      tasksTotal: total,
      upcomingEvents: upcoming,
      activeGoals: active,
      notesCount: notes.length,
      productivityScore: calculateProductivityScore(
        completed,
        total,
        goalsProgress
      ),
    })

    setRecentTasks(tasks.slice(0, 5))
    setActiveGoals(goals.filter((g) => !g.completed).slice(0, 3))
  }

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

        {/* Search Bar */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Pesquise suas tarefas..."
            className="input-dark w-full pl-12"
          />
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
            <ClockIcon className="w-5 h-5 text-white/50" />
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

        {/* Today Tasks */}
        <div className="dark-card p-6 rounded-3xl mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              Tarefas de Hoje
            </h3>
            <button className="btn-ghost flex items-center space-x-2">
              <PlusIcon className="w-4 h-4" />
              <span className="text-sm">Adicionar</span>
            </button>
          </div>

          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.slice(0, 3).map((task) => (
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
                          className={`px-2 py-1 rounded-full text-xs ${
                            task.priority === 'crítica'
                              ? 'priority-critical'
                              : task.priority === 'alta'
                              ? 'priority-high'
                              : task.priority === 'média'
                              ? 'priority-medium'
                              : 'priority-low'
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>
                    <div className="text-white/40 text-sm">52%</div>
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

        {/* All Tasks */}
        <div className="dark-card p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-white">
              Todas as Tarefas
            </h3>
            <button className="btn-ghost flex items-center space-x-2">
              <PlusIcon className="w-4 h-4" />
              <span className="text-sm">Nova Tarefa</span>
            </button>
          </div>

          <div className="space-y-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <div key={task.id} className="task-item">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-4 h-4 rounded-full border-2 ${
                          task.completed
                            ? 'bg-primary-500 border-primary-500'
                            : 'border-white/30'
                        }`}
                      />
                      <div>
                        <h4
                          className={`font-medium ${
                            task.completed
                              ? 'text-white/50 line-through'
                              : 'text-white'
                          }`}
                        >
                          {task.title}
                        </h4>
                        <p className="text-white/60 text-sm">{task.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-white/40 text-sm">20</span>
                      <ClockIcon className="w-4 h-4 text-white/40" />
                      <span className="text-white/40 text-sm">4 horas</span>
                      <div className="flex -space-x-2">
                        <div className="w-6 h-6 rounded-full bg-primary-500 border-2 border-dark-700" />
                        <div className="w-6 h-6 rounded-full bg-yellow-500 border-2 border-dark-700" />
                        <div className="w-6 h-6 rounded-full bg-green-500 border-2 border-dark-700 flex items-center justify-center">
                          <span className="text-xs text-white font-medium">
                            +3
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <DocumentTextIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
                <p className="text-white/60">Nenhuma tarefa encontrada</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
