'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/types'
import { formatDate, getPriorityColor } from '@/lib/utils'
import {
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  FunnelIcon,
  TrashIcon,
  PencilIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [formData, setFormData] = useState<{
    title: string
    description: string
    priority: string
    category: string
    dueDate: string
  }>({
    title: '',
    description: '',
    priority: 'MEDIUM',
    category: 'Trabalho',
    dueDate: '',
  })

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [tasks, filter, priorityFilter])

  const loadTasks = async () => {
    try {
      console.log('📋 Carregando tarefas da API...')
      const response = await fetch('/api/tasks?userId=user_1')
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Tarefas carregadas:', data.tasks?.length || 0)
        setTasks(data.tasks || [])
      } else {
        console.error('❌ Erro ao carregar tarefas:', response.statusText)
        toast.error('Erro ao carregar tarefas')
      }
    } catch (error) {
      console.error('❌ Erro ao carregar tarefas:', error)
      toast.error('Erro ao conectar com o servidor')
    }
  }

  const applyFilters = () => {
    let filtered = tasks

    // Filtro por status
    if (filter === 'pending') {
      filtered = filtered.filter((task) => !task.completed)
    } else if (filter === 'completed') {
      filtered = filtered.filter((task) => task.completed)
    }

    // Filtro por prioridade
    if (priorityFilter !== 'all') {
      filtered = filtered.filter((task) => task.priority === priorityFilter)
    }

    // Ordenar por prioridade e data
    filtered.sort((a, b) => {
      const priorityOrder = { CRITICAL: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
      const aPriority =
        priorityOrder[a.priority as keyof typeof priorityOrder] || 2
      const bPriority =
        priorityOrder[b.priority as keyof typeof priorityOrder] || 2

      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

    setFilteredTasks(filtered)
  }

  const handleCreateTask = async () => {
    if (!formData.title.trim()) {
      toast.error('Título é obrigatório')
      return
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          category: formData.category,
          dueDate: formData.dueDate
            ? new Date(formData.dueDate).toISOString()
            : null,
          userId: 'user_1',
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTasks((prev) => [data.task, ...prev])
        resetForm()
        setShowForm(false)
        toast.success('Tarefa criada com sucesso!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao criar tarefa')
      }
    } catch (error) {
      console.error('Erro ao criar tarefa:', error)
      toast.error('Erro ao conectar com o servidor')
    }
  }

  const handleEditTask = async () => {
    if (!formData.title.trim() || !selectedTask) {
      toast.error('Título é obrigatório')
      return
    }

    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedTask.id,
          title: formData.title,
          description: formData.description,
          priority: formData.priority,
          category: formData.category,
          dueDate: formData.dueDate
            ? new Date(formData.dueDate).toISOString()
            : null,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTasks((prev) =>
          prev.map((t) => (t.id === selectedTask.id ? data.task : t))
        )
        resetForm()
        setShowForm(false)
        setIsEditMode(false)
        setSelectedTask(null)
        toast.success('Tarefa atualizada com sucesso!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao atualizar tarefa')
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
      toast.error('Erro ao conectar com o servidor')
    }
  }

  const openEditModal = (task: Task) => {
    setSelectedTask(task)
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      category: task.category,
      dueDate: task.dueDate ? formatDateForInput(task.dueDate) : '',
    })
    setIsEditMode(true)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'MEDIUM',
      category: 'Trabalho',
      dueDate: '',
    })
  }

  const formatDateForInput = (date: Date | string) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date
    return dateObj.toISOString().split('T')[0]
  }

  const toggleTaskCompletion = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    try {
      const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: taskId,
          completed: !task.completed,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setTasks((prev) => prev.map((t) => (t.id === taskId ? data.task : t)))
        toast.success(
          data.task.completed ? 'Tarefa concluída!' : 'Tarefa reaberta!'
        )
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao atualizar tarefa')
      }
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error)
      toast.error('Erro ao conectar com o servidor')
    }
  }

  const deleteTask = async (taskId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta tarefa?')) return

    try {
      const response = await fetch(`/api/tasks?id=${taskId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setTasks((prev) => prev.filter((t) => t.id !== taskId))
        toast.success('Tarefa excluída!')
      } else {
        const error = await response.json()
        toast.error(error.error || 'Erro ao excluir tarefa')
      }
    } catch (error) {
      console.error('Erro ao excluir tarefa:', error)
      toast.error('Erro ao conectar com o servidor')
    }
  }

  const categories = [
    'Trabalho',
    'Pessoal',
    'Estudos',
    'Saúde',
    'Casa',
    'Outros',
  ]
  const priorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']
  const priorityLabels = {
    CRITICAL: 'Crítica',
    HIGH: 'Alta',
    MEDIUM: 'Média',
    LOW: 'Baixa',
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            ✅ Gerenciar Tarefas
          </h1>
          <p className="text-white/60">
            Organize e acompanhe suas atividades diárias
          </p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nova Tarefa</span>
        </button>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-white/60" />
            <span className="text-sm font-medium text-white/80">Filtros:</span>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as any)}
            className="input-dark"
          >
            <option value="all">Todas</option>
            <option value="pending">Pendentes</option>
            <option value="completed">Concluídas</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="input-dark"
          >
            <option value="all">Todas as Prioridades</option>
            {priorities.map((priority) => (
              <option key={priority} value={priority}>
                {priorityLabels[priority as keyof typeof priorityLabels]}
              </option>
            ))}
          </select>

          <span className="text-sm text-white/50">
            {filteredTasks.length} tarefa(s) encontrada(s)
          </span>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="task-item">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                      task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-white/30 hover:border-green-500'
                    }`}
                  >
                    {task.completed && (
                      <CheckCircleIcon className="w-3 h-3 text-white" />
                    )}
                  </button>

                  <div className="flex-1">
                    <h3
                      className={`font-medium ${
                        task.completed
                          ? 'line-through text-white/50'
                          : 'text-white'
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-white/70 mt-1">
                        {task.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 mt-2">
                      <span className="text-xs px-2 py-1 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded-full">
                        {task.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {
                          priorityLabels[
                            task.priority as keyof typeof priorityLabels
                          ]
                        }
                      </span>
                      {task.dueDate && (
                        <div className="flex items-center space-x-1 text-xs text-white/50">
                          <ClockIcon className="w-3 h-3" />
                          <span>{formatDate(task.dueDate)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => openEditModal(task)}
                    className="icon-btn !w-8 !h-8 text-yellow-400 hover:text-yellow-300"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="icon-btn !w-8 !h-8 text-red-400 hover:text-red-300"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12">
            <ClockIcon className="w-16 h-16 text-white/30 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">
              Nenhuma tarefa encontrada
            </h3>
            <p className="text-white/60 mb-4">
              Comece criando sua primeira tarefa!
            </p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Criar Tarefa
            </button>
          </div>
        )}
      </div>

      {/* Create/Edit Task Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              {isEditMode ? 'Editar Tarefa' : 'Nova Tarefa'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Título *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="input-dark w-full"
                  placeholder="Digite o título da tarefa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className="input-dark w-full h-20 resize-none"
                  placeholder="Descrição opcional"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Prioridade
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        priority: e.target.value,
                      }))
                    }
                    className="input-dark w-full"
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {
                          priorityLabels[
                            priority as keyof typeof priorityLabels
                          ]
                        }
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/80 mb-1">
                    Categoria
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
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
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-1">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  className="input-dark w-full"
                />
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => {
                  setShowForm(false)
                  setIsEditMode(false)
                  setSelectedTask(null)
                  resetForm()
                }}
                className="flex-1 btn-ghost"
              >
                Cancelar
              </button>
              <button
                onClick={isEditMode ? handleEditTask : handleCreateTask}
                className="flex-1 btn-primary"
                disabled={!formData.title.trim()}
              >
                {isEditMode ? 'Salvar Alterações' : 'Criar Tarefa'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
