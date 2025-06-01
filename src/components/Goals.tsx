'use client'

import { useState, useEffect } from 'react'
import {
  TrophyIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  FireIcon,
  CalendarDaysIcon,
  ClockIcon,
  CheckCircleIcon,
  StarIcon,
  ChartBarIcon,
  FlagIcon,
} from '@heroicons/react/24/outline'
import {
  TrophyIcon as TrophySolidIcon,
  StarIcon as StarSolidIcon,
  FireIcon as FireSolidIcon,
} from '@heroicons/react/24/solid'

interface Goal {
  id: string
  title: string
  description: string
  category: string
  target: number
  current: number
  status: string
  completed: boolean
  deadline: string | null
  createdAt: string
  updatedAt: string
}

interface GoalFormData {
  title: string
  description: string
  category: string
  targetValue: number
  currentValue: number
  deadline: string
}

const categories = [
  'Carreira',
  'Saúde',
  'Financeiro',
  'Estudos',
  'Pessoal',
  'Relacionamentos',
  'Hobbies',
]

const mockGoals: Goal[] = [
  {
    id: '1',
    title: 'Aprender TypeScript',
    description: 'Dominar TypeScript para desenvolvimento web moderno',
    category: 'Estudos',
    target: 100,
    current: 75,
    status: 'ACTIVE',
    completed: false,
    deadline: '2024-03-31',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '2',
    title: 'Exercitar-se 5x por semana',
    description: 'Manter consistência nos exercícios físicos',
    category: 'Saúde',
    target: 20,
    current: 12,
    status: 'ACTIVE',
    completed: false,
    deadline: '2024-06-30',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    title: 'Economizar R$ 10.000',
    description: 'Reserva de emergência para o ano',
    category: 'Financeiro',
    target: 10000,
    current: 6500,
    status: 'ACTIVE',
    completed: false,
    deadline: '2024-12-31',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
  },
  {
    id: '4',
    title: 'Ler 24 livros',
    description: 'Meta de leitura para desenvolvimento pessoal',
    category: 'Pessoal',
    target: 24,
    current: 24,
    status: 'COMPLETED',
    completed: true,
    deadline: '2024-12-31',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
]

export default function Goals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null)
  const [formData, setFormData] = useState<GoalFormData>({
    title: '',
    description: '',
    category: 'Pessoal',
    targetValue: 0,
    currentValue: 0,
    deadline: '',
  })

  useEffect(() => {
    loadGoals()
  }, [])

  const loadGoals = async () => {
    try {
      // Buscar metas da API do banco de dados
      const response = await fetch('/api/goals?userId=user_1')
      if (response.ok) {
        const data = await response.json()
        setGoals(data.goals || [])
      } else {
        console.error('Erro ao carregar metas:', response.statusText)
        // Fallback para localStorage se API falhar
        const savedGoals = localStorage.getItem('care-ai-goals')
        if (savedGoals) {
          setGoals(JSON.parse(savedGoals))
        } else {
          setGoals(mockGoals)
          localStorage.setItem('care-ai-goals', JSON.stringify(mockGoals))
        }
      }
    } catch (error) {
      console.error('Erro ao carregar metas:', error)
      // Fallback para localStorage
      const savedGoals = localStorage.getItem('care-ai-goals')
      if (savedGoals) {
        setGoals(JSON.parse(savedGoals))
      } else {
        setGoals(mockGoals)
        localStorage.setItem('care-ai-goals', JSON.stringify(mockGoals))
      }
    }
  }

  const saveGoals = (newGoals: Goal[]) => {
    setGoals(newGoals)
    localStorage.setItem('care-ai-goals', JSON.stringify(newGoals))
  }

  const filteredGoals = goals.filter((goal) => {
    const matchesSearch =
      goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      goal.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === 'all' || goal.category === selectedCategory
    const matchesStatus =
      selectedStatus === 'all' || goal.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  const calculateProgress = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500'
    if (progress >= 75) return 'bg-blue-500'
    if (progress >= 50) return 'bg-yellow-500'
    if (progress >= 25) return 'bg-orange-500'
    return 'bg-red-500'
  }

  const handleCreateGoal = async () => {
    if (!formData.title.trim()) return

    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      target: formData.targetValue,
      current: formData.currentValue,
      status: 'ACTIVE',
      completed: false,
      deadline: formData.deadline,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Auto-complete if current value equals target
    if (formData.currentValue >= formData.targetValue) {
      newGoal.status = 'COMPLETED'
      newGoal.completed = true
    }

    try {
      // Tentar salvar na API
      const response = await fetch('/api/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newGoal,
          userId: 'user_1',
          target: formData.targetValue,
          current: formData.currentValue,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setGoals([data.goal, ...goals])
      } else {
        // Fallback para localStorage se API falhar
        const updatedGoals = [newGoal, ...goals]
        setGoals(updatedGoals)
        localStorage.setItem('care-ai-goals', JSON.stringify(updatedGoals))
      }
    } catch (error) {
      // Fallback para localStorage
      const updatedGoals = [newGoal, ...goals]
      setGoals(updatedGoals)
      localStorage.setItem('care-ai-goals', JSON.stringify(updatedGoals))
    }

    setIsCreateModalOpen(false)
    resetForm()
  }

  const handleEditGoal = async () => {
    if (!selectedGoal || !formData.title.trim()) return

    const updatedGoal = {
      ...selectedGoal,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      target: formData.targetValue,
      current: formData.currentValue,
      deadline: formData.deadline,
      updatedAt: new Date().toISOString(),
    }

    // Update status based on progress
    if (
      formData.currentValue >= formData.targetValue &&
      selectedGoal.status !== 'COMPLETED'
    ) {
      updatedGoal.status = 'COMPLETED'
      updatedGoal.completed = true
    } else if (formData.currentValue > 0 && selectedGoal.status !== 'ACTIVE') {
      updatedGoal.status = 'ACTIVE'
      updatedGoal.completed = false
    }

    try {
      // Tentar atualizar na API
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGoal),
      })

      if (response.ok) {
        const data = await response.json()
        setGoals(
          goals.map((goal) => (goal.id === selectedGoal.id ? data.goal : goal))
        )
      } else {
        // Fallback para localStorage se API falhar
        const updatedGoals = goals.map((goal) =>
          goal.id === selectedGoal.id ? updatedGoal : goal
        )
        setGoals(updatedGoals)
        localStorage.setItem('care-ai-goals', JSON.stringify(updatedGoals))
      }
    } catch (error) {
      // Fallback para localStorage
      const updatedGoals = goals.map((goal) =>
        goal.id === selectedGoal.id ? updatedGoal : goal
      )
      setGoals(updatedGoals)
      localStorage.setItem('care-ai-goals', JSON.stringify(updatedGoals))
    }

    setIsEditModalOpen(false)
    setSelectedGoal(null)
    resetForm()
  }

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta meta?')) return

    try {
      // Tentar deletar na API
      const response = await fetch(`/api/goals?id=${goalId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setGoals(goals.filter((goal) => goal.id !== goalId))
      } else {
        // Fallback para localStorage se API falhar
        const updatedGoals = goals.filter((goal) => goal.id !== goalId)
        setGoals(updatedGoals)
        localStorage.setItem('care-ai-goals', JSON.stringify(updatedGoals))
      }
    } catch (error) {
      // Fallback para localStorage
      const updatedGoals = goals.filter((goal) => goal.id !== goalId)
      setGoals(updatedGoals)
      localStorage.setItem('care-ai-goals', JSON.stringify(updatedGoals))
    }
  }

  const updateProgress = async (goalId: string, newValue: number) => {
    const goal = goals.find((g) => g.id === goalId)
    if (!goal) return

    const updatedGoal = { ...goal, current: newValue }

    if (newValue >= goal.target && goal.status !== 'COMPLETED') {
      updatedGoal.status = 'COMPLETED'
      updatedGoal.completed = true
    } else if (newValue > 0 && goal.status === 'ACTIVE') {
      updatedGoal.status = 'ACTIVE'
      updatedGoal.completed = false
    }

    try {
      // Tentar atualizar na API
      const response = await fetch('/api/goals', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGoal),
      })

      if (response.ok) {
        const data = await response.json()
        setGoals(goals.map((g) => (g.id === goalId ? data.goal : g)))
      } else {
        // Fallback para localStorage se API falhar
        const updatedGoals = goals.map((g) =>
          g.id === goalId ? updatedGoal : g
        )
        setGoals(updatedGoals)
        localStorage.setItem('care-ai-goals', JSON.stringify(updatedGoals))
      }
    } catch (error) {
      // Fallback para localStorage
      const updatedGoals = goals.map((g) => (g.id === goalId ? updatedGoal : g))
      setGoals(updatedGoals)
      localStorage.setItem('care-ai-goals', JSON.stringify(updatedGoals))
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: 'Pessoal',
      targetValue: 0,
      currentValue: 0,
      deadline: '',
    })
  }

  const openEditModal = (goal: Goal) => {
    setSelectedGoal(goal)
    setFormData({
      title: goal.title,
      description: goal.description || '',
      category: goal.category,
      targetValue: goal.target,
      currentValue: goal.current,
      deadline: goal.deadline || '',
    })
    setIsEditModalOpen(true)
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Sem prazo'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getDaysUntilDeadline = (deadline: string | null) => {
    if (!deadline) return 0
    const today = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusIcon = (status: Goal['status']) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />
      case 'ACTIVE':
        return <ClockIcon className="w-5 h-5 text-blue-400" />
      case 'PAUSED':
        return <ClockIcon className="w-5 h-5 text-yellow-400" />
      default:
        return <FlagIcon className="w-5 h-5 text-white/60" />
    }
  }

  const completedGoals = goals.filter((g) => g.status === 'COMPLETED').length
  const inProgressGoals = goals.filter((g) => g.status === 'ACTIVE').length
  const averageProgress =
    goals.length > 0
      ? goals.reduce(
          (acc, goal) => acc + calculateProgress(goal.current, goal.target),
          0
        ) / goals.length
      : 0

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">🏆 Metas</h1>
          <p className="text-white/60">
            Acompanhe seu progresso e conquiste seus objetivos
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nova Meta</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total</p>
              <p className="text-2xl font-bold text-white">{goals.length}</p>
            </div>
            <TrophyIcon className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Concluídas</p>
              <p className="text-2xl font-bold text-white">{completedGoals}</p>
            </div>
            <TrophySolidIcon className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Em Progresso</p>
              <p className="text-2xl font-bold text-white">{inProgressGoals}</p>
            </div>
            <FireSolidIcon className="w-8 h-8 text-orange-400" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Progresso Médio</p>
              <p className="text-2xl font-bold text-white">
                {averageProgress.toFixed(0)}%
              </p>
            </div>
            <ChartBarIcon className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Buscar metas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-dark pl-10 w-full"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="input-dark"
          >
            <option value="all">Todas as categorias</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="input-dark"
          >
            <option value="all">Todos os status</option>
            <option value="ACTIVE">Em andamento</option>
            <option value="COMPLETED">Concluída</option>
            <option value="PAUSED">Pausada</option>
          </select>
        </div>
      </div>

      {/* Goals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredGoals.map((goal) => {
          const progress = calculateProgress(goal.current, goal.target)
          const daysUntilDeadline = getDaysUntilDeadline(goal.deadline)

          return (
            <div
              key={goal.id}
              className="dark-card p-6 rounded-3xl group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    {getStatusIcon(goal.status)}
                    <h3 className="text-lg font-semibold text-white truncate">
                      {goal.title}
                    </h3>
                  </div>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {goal.description}
                  </p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {goal.category}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  <button
                    onClick={() => openEditModal(goal)}
                    className="icon-btn !w-8 !h-8"
                  >
                    <PencilIcon className="w-4 h-4 text-white/60" />
                  </button>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="icon-btn !w-8 !h-8"
                  >
                    <TrashIcon className="w-4 h-4 text-red-400" />
                  </button>
                </div>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-white/70">Progresso</span>
                  <span className="text-sm text-white font-medium">
                    {goal.current} / {goal.target}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(
                      progress
                    )}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-white/50">
                    {progress.toFixed(0)}%
                  </span>
                  {goal.status === 'COMPLETED' && (
                    <div className="flex items-center space-x-1">
                      <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                      <span className="text-xs text-yellow-400">
                        Concluída!
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Update */}
              {goal.status !== 'COMPLETED' && (
                <div className="mb-4">
                  <label className="block text-xs text-white/60 mb-1">
                    Atualizar progresso:
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={goal.target}
                    value={goal.current}
                    onChange={(e) =>
                      updateProgress(goal.id, Number(e.target.value))
                    }
                    className="input-dark w-full text-sm py-2"
                  />
                </div>
              )}

              {/* Deadline */}
              <div className="flex items-center justify-between text-xs text-white/50">
                <div className="flex items-center space-x-1">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>{formatDate(goal.deadline)}</span>
                </div>
                <div
                  className={`flex items-center space-x-1 ${
                    daysUntilDeadline < 0
                      ? 'text-red-400'
                      : daysUntilDeadline < 7
                      ? 'text-yellow-400'
                      : 'text-white/50'
                  }`}
                >
                  <ClockIcon className="w-4 h-4" />
                  <span>
                    {daysUntilDeadline < 0
                      ? `${Math.abs(daysUntilDeadline)} dias atrasado`
                      : `${daysUntilDeadline} dias restantes`}
                  </span>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredGoals.length === 0 && (
        <div className="text-center py-12">
          <TrophyIcon className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {searchTerm ||
            selectedCategory !== 'all' ||
            selectedStatus !== 'all'
              ? 'Nenhuma meta encontrada'
              : 'Nenhuma meta criada ainda'}
          </h3>
          <p className="text-white/60 mb-6">
            {searchTerm ||
            selectedCategory !== 'all' ||
            selectedStatus !== 'all'
              ? 'Tente ajustar seus filtros de busca'
              : 'Comece definindo suas primeiras metas'}
          </p>
          {!searchTerm &&
            selectedCategory === 'all' &&
            selectedStatus === 'all' && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary"
              >
                Criar primeira meta
              </button>
            )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-6">
              {isCreateModalOpen ? 'Nova Meta' : 'Editar Meta'}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Título
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="input-dark w-full"
                  placeholder="Ex: Aprender TypeScript"
                />
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="input-dark w-full h-20 resize-none"
                  placeholder="Descreva sua meta..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="input-dark w-full"
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Prazo
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) =>
                      setFormData({ ...formData, deadline: e.target.value })
                    }
                    className="input-dark w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Meta
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.targetValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        targetValue: Number(e.target.value),
                      })
                    }
                    className="input-dark w-full"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Progresso Atual
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.currentValue}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        currentValue: Number(e.target.value),
                      })
                    }
                    className="input-dark w-full"
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setIsEditModalOpen(false)
                  setSelectedGoal(null)
                  resetForm()
                }}
                className="btn-ghost"
              >
                Cancelar
              </button>
              <button
                onClick={isCreateModalOpen ? handleCreateGoal : handleEditGoal}
                className="btn-primary"
                disabled={!formData.title.trim() || !formData.deadline}
              >
                {isCreateModalOpen ? 'Criar Meta' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
