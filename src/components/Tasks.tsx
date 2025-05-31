'use client'

import { useState, useEffect } from 'react'
import { store } from '@/lib/store'
import { Task } from '@/types'
import { formatDate, getPriorityColor } from '@/lib/utils'
import {
  PlusIcon,
  CheckCircleIcon,
  ClockIcon,
  FunnelIcon,
  TrashIcon,
} from '@heroicons/react/24/outline'
import toast from 'react-hot-toast'

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all')
  const [priorityFilter, setPriorityFilter] = useState<string>('all')
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'média' as Task['priority'],
    category: 'Trabalho',
    dueDate: '',
  })

  useEffect(() => {
    loadTasks()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [tasks, filter, priorityFilter])

  const loadTasks = () => {
    const allTasks = store.getTasks()
    setTasks(allTasks)
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
      const priorityOrder = { crítica: 4, alta: 3, média: 2, baixa: 1 }
      const aPriority = priorityOrder[a.priority]
      const bPriority = priorityOrder[b.priority]

      if (aPriority !== bPriority) {
        return bPriority - aPriority
      }

      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

    setFilteredTasks(filtered)
  }

  const handleCreateTask = () => {
    if (!formData.title.trim()) {
      toast.error('Título é obrigatório')
      return
    }

    const newTask = store.addTask({
      title: formData.title,
      description: formData.description,
      priority: formData.priority,
      category: formData.category,
      completed: false,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
    })

    setTasks((prev) => [...prev, newTask])
    setFormData({
      title: '',
      description: '',
      priority: 'média',
      category: 'Trabalho',
      dueDate: '',
    })
    setShowForm(false)
    toast.success('Tarefa criada com sucesso!')
  }

  const toggleTaskCompletion = (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    const updatedTask = store.updateTask(taskId, { completed: !task.completed })
    if (updatedTask) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? updatedTask : t)))
      toast.success(
        updatedTask.completed ? 'Tarefa concluída!' : 'Tarefa reaberta!'
      )
    }
  }

  const deleteTask = (taskId: string) => {
    if (store.deleteTask(taskId)) {
      setTasks((prev) => prev.filter((t) => t.id !== taskId))
      toast.success('Tarefa excluída!')
    }
  }

  const categories = store.getPreferences().categories.tasks
  const priorities = ['crítica', 'alta', 'média', 'baixa']

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
                {priority}
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
                        {task.priority}
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

                <button
                  onClick={() => deleteTask(task.id)}
                  className="icon-btn !w-8 !h-8 text-red-400 hover:text-red-300"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
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

      {/* Create Task Form Modal */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal-content max-w-md">
            <h3 className="text-lg font-semibold text-white mb-4">
              Nova Tarefa
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
                        priority: e.target.value as Task['priority'],
                      }))
                    }
                    className="input-dark w-full"
                  >
                    {priorities.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
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
                onClick={() => setShowForm(false)}
                className="flex-1 btn-ghost"
              >
                Cancelar
              </button>
              <button onClick={handleCreateTask} className="flex-1 btn-primary">
                Criar Tarefa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
