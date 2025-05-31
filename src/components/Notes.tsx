'use client'

import { useState, useEffect } from 'react'
import {
  DocumentTextIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  TagIcon,
  BookmarkIcon,
  EyeIcon,
  CalendarDaysIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline'
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid'

interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

interface NoteFormData {
  title: string
  content: string
  category: string
  tags: string[]
}

const categories = [
  'Pessoal',
  'Trabalho',
  'Ideias',
  'Projetos',
  'Estudos',
  'Lembretes',
]

const mockNotes: Note[] = [
  {
    id: '1',
    title: 'Planejamento do Projeto CareAI',
    content:
      'Definir as funcionalidades principais:\n- Sistema de tarefas\n- Chat inteligente\n- Dashboard analytics\n- Integração com calendário\n\nPróximos passos: criar wireframes e definir arquitetura.',
    category: 'Trabalho',
    tags: ['projeto', 'planejamento', 'ai'],
    isFavorite: true,
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T14:20:00Z',
  },
  {
    id: '2',
    title: 'Ideias para Melhorias',
    content:
      'Lista de melhorias para implementar:\n\n1. Sistema de notificações push\n2. Integração com Google Calendar\n3. Modo offline\n4. Temas personalizáveis\n5. Exportar dados para PDF',
    category: 'Ideias',
    tags: ['melhorias', 'features', 'roadmap'],
    isFavorite: false,
    createdAt: '2024-01-14T09:15:00Z',
    updatedAt: '2024-01-14T09:15:00Z',
  },
  {
    id: '3',
    title: 'Estudos sobre UI/UX',
    content:
      'Conceitos importantes aprendidos:\n\n- Design System consistency\n- Micro-interactions\n- Accessibility guidelines\n- Performance optimization\n\nReferências: Material Design, Apple HIG',
    category: 'Estudos',
    tags: ['design', 'ux', 'ui'],
    isFavorite: false,
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-13T16:45:00Z',
  },
]

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState<NoteFormData>({
    title: '',
    content: '',
    category: 'Pessoal',
    tags: [],
  })
  const [tagInput, setTagInput] = useState('')

  useEffect(() => {
    const savedNotes = localStorage.getItem('care-ai-notes')
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    } else {
      setNotes(mockNotes)
      localStorage.setItem('care-ai-notes', JSON.stringify(mockNotes))
    }
  }, [])

  const saveNotes = (newNotes: Note[]) => {
    setNotes(newNotes)
    localStorage.setItem('care-ai-notes', JSON.stringify(newNotes))
  }

  const filteredNotes = notes.filter((note) => {
    const matchesSearch =
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesCategory =
      selectedCategory === 'all' || note.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleCreateNote = () => {
    if (!formData.title.trim()) return

    const newNote: Note = {
      id: Date.now().toString(),
      title: formData.title,
      content: formData.content,
      category: formData.category,
      tags: formData.tags,
      isFavorite: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedNotes = [newNote, ...notes]
    saveNotes(updatedNotes)
    setIsCreateModalOpen(false)
    resetForm()
  }

  const handleEditNote = () => {
    if (!selectedNote || !formData.title.trim()) return

    const updatedNotes = notes.map((note) =>
      note.id === selectedNote.id
        ? {
            ...note,
            title: formData.title,
            content: formData.content,
            category: formData.category,
            tags: formData.tags,
            updatedAt: new Date().toISOString(),
          }
        : note
    )

    saveNotes(updatedNotes)
    setIsEditModalOpen(false)
    setSelectedNote(null)
    resetForm()
  }

  const handleDeleteNote = (noteId: string) => {
    const updatedNotes = notes.filter((note) => note.id !== noteId)
    saveNotes(updatedNotes)
  }

  const toggleFavorite = (noteId: string) => {
    const updatedNotes = notes.map((note) =>
      note.id === noteId ? { ...note, isFavorite: !note.isFavorite } : note
    )
    saveNotes(updatedNotes)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      category: 'Pessoal',
      tags: [],
    })
    setTagInput('')
  }

  const openEditModal = (note: Note) => {
    setSelectedNote(note)
    setFormData({
      title: note.title,
      content: note.content,
      category: note.category,
      tags: note.tags,
    })
    setIsEditModalOpen(true)
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      })
      setTagInput('')
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">📝 Notas</h1>
          <p className="text-white/60">Organize suas ideias e anotações</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-primary flex items-center space-x-2"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Nova Nota</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="glass-card p-6 rounded-3xl">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Buscar notas, tags ou conteúdo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-dark pl-10 w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FunnelIcon className="w-5 h-5 text-white/60" />
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
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total</p>
              <p className="text-2xl font-bold text-white">{notes.length}</p>
            </div>
            <DocumentTextIcon className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Favoritas</p>
              <p className="text-2xl font-bold text-white">
                {notes.filter((n) => n.isFavorite).length}
              </p>
            </div>
            <BookmarkSolidIcon className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Categorias</p>
              <p className="text-2xl font-bold text-white">
                {new Set(notes.map((n) => n.category)).size}
              </p>
            </div>
            <TagIcon className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Hoje</p>
              <p className="text-2xl font-bold text-white">
                {
                  notes.filter(
                    (n) =>
                      new Date(n.createdAt).toDateString() ===
                      new Date().toDateString()
                  ).length
                }
              </p>
            </div>
            <CalendarDaysIcon className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className="dark-card p-6 rounded-3xl group hover:scale-[1.02] transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white mb-2 line-clamp-2">
                  {note.title}
                </h3>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {note.category}
                </span>
              </div>
              <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => toggleFavorite(note.id)}
                  className="icon-btn !w-8 !h-8"
                >
                  {note.isFavorite ? (
                    <BookmarkSolidIcon className="w-4 h-4 text-yellow-400" />
                  ) : (
                    <BookmarkIcon className="w-4 h-4 text-white/60" />
                  )}
                </button>
                <button
                  onClick={() => openEditModal(note)}
                  className="icon-btn !w-8 !h-8"
                >
                  <PencilIcon className="w-4 h-4 text-white/60" />
                </button>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="icon-btn !w-8 !h-8"
                >
                  <TrashIcon className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>

            <p className="text-white/70 text-sm mb-4 line-clamp-3">
              {note.content}
            </p>

            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70 border border-white/20"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between text-xs text-white/50">
              <span>Criado: {formatDate(note.createdAt)}</span>
              {note.updatedAt !== note.createdAt && (
                <span>Editado: {formatDate(note.updatedAt)}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredNotes.length === 0 && (
        <div className="text-center py-12">
          <DocumentTextIcon className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {searchTerm || selectedCategory !== 'all'
              ? 'Nenhuma nota encontrada'
              : 'Nenhuma nota criada ainda'}
          </h3>
          <p className="text-white/60 mb-6">
            {searchTerm || selectedCategory !== 'all'
              ? 'Tente ajustar seus filtros de busca'
              : 'Comece criando sua primeira nota'}
          </p>
          {!searchTerm && selectedCategory === 'all' && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="btn-primary"
            >
              Criar primeira nota
            </button>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-6">
              {isCreateModalOpen ? 'Nova Nota' : 'Editar Nota'}
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
                  placeholder="Digite o título da nota..."
                />
              </div>

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
                  Tags
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTag()}
                    className="input-dark flex-1"
                    placeholder="Adicionar tag..."
                  />
                  <button
                    type="button"
                    onClick={addTag}
                    className="btn-secondary px-4"
                  >
                    Adicionar
                  </button>
                </div>
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1"
                      >
                        <span>#{tag}</span>
                        <button
                          onClick={() => removeTag(tag)}
                          className="text-blue-300 hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Conteúdo
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  className="input-dark w-full h-40 resize-none"
                  placeholder="Escreva sua nota aqui..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setIsEditModalOpen(false)
                  setSelectedNote(null)
                  resetForm()
                }}
                className="btn-ghost"
              >
                Cancelar
              </button>
              <button
                onClick={isCreateModalOpen ? handleCreateNote : handleEditNote}
                className="btn-primary"
                disabled={!formData.title.trim()}
              >
                {isCreateModalOpen ? 'Criar Nota' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
