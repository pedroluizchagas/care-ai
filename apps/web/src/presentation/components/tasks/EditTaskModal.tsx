'use client'

import { useEffect, useState } from 'react'
import { Task } from '../../../../../../src/types'
import { store } from '../../../../../../src/lib/store'
import { formatDateISO } from '../../../../../../src/lib/utils'
import toast from 'react-hot-toast'

interface EditTaskModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onSave?: (task: Task) => void
}

const priorities = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'] as const
const priorityLabels: Record<(typeof priorities)[number], string> = {
  CRITICAL: 'Crítica',
  HIGH: 'Alta',
  MEDIUM: 'Média',
  LOW: 'Baixa',
}

export default function EditTaskModal({ task, isOpen, onClose, onSave }: EditTaskModalProps) {
  const categories = store.getPreferences().categories.tasks
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<(typeof priorities)[number]>('MEDIUM')
  const [category, setCategory] = useState(categories[0] || '')
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority((task.priority as string).toUpperCase() as (typeof priorities)[number])
      setCategory(task.category)
      setDueDate(task.dueDate ? formatDateISO(task.dueDate) : '')
    }
  }, [task])

  const handleSave = () => {
    if (!task) return onClose()
    if (!title.trim()) {
      toast.error('Título é obrigatório')
      return
    }

    const updated = store.updateTask(task.id, {
      title,
      description,
      priority,
      category,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    })

    if (updated) {
      toast.success('Tarefa atualizada com sucesso!')
      onSave?.(updated)
      onClose()
    } else {
      toast.error('Erro ao atualizar tarefa')
    }
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay">
      <div className="modal-content max-w-md">
        <h3 className="text-lg font-semibold text-white mb-4">Editar Tarefa</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="input-dark w-full"
              placeholder="Digite o título da tarefa"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Descrição</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-dark w-full h-20 resize-none"
              placeholder="Descrição opcional"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Prioridade</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as (typeof priorities)[number])}
                className="input-dark w-full"
              >
                {priorities.map((p) => (
                  <option key={p} value={p}>
                    {priorityLabels[p]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/80 mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-dark w-full"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/80 mb-1">Data de Vencimento</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="input-dark w-full"
            />
          </div>
        </div>

        <div className="flex space-x-3 mt-6">
          <button onClick={onClose} className="flex-1 btn-ghost">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="flex-1 btn-primary"
            disabled={!title.trim()}
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
