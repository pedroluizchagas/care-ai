'use client'

import { useState, useEffect } from 'react'
import {
  CalendarIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  ClockIcon,
  MapPinIcon,
  UserGroupIcon,
  BellIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ViewColumnsIcon,
  ListBulletIcon,
} from '@heroicons/react/24/outline'
import { CalendarIcon as CalendarSolidIcon } from '@heroicons/react/24/solid'

interface Event {
  id: string
  title: string
  description: string
  location: string
  category: string
  startDate: string // Mudou de 'date' + 'startTime' para 'startDate' (ISO)
  endDate: string | null // Mudou de 'endTime' para 'endDate' (ISO)
  allDay: boolean
  priority: string // Mudou para 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL'
  status: string
  reminder: string | null // Mudou para string tipo '15min', '30min', etc
  attendees: string | null // Mudou para string separada por vírgula
  createdAt: string
  updatedAt: string
}

interface EventFormData {
  title: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  category: string
  priority: string // Mudou para string comum
  attendees: string[]
  reminder: boolean
  reminderTime: number
}

const categories = [
  'Trabalho',
  'Pessoal',
  'Saúde',
  'Estudos',
  'Reunião',
  'Lazer',
  'Família',
  'Esporte',
]

const priorityConfig = {
  LOW: {
    color: 'text-green-300',
    bg: 'bg-green-500/20',
    border: 'border-green-500/30',
  },
  MEDIUM: {
    color: 'text-yellow-300',
    bg: 'bg-yellow-500/20',
    border: 'border-yellow-500/30',
  },
  HIGH: {
    color: 'text-orange-300',
    bg: 'bg-orange-500/20',
    border: 'border-orange-500/30',
  },
  CRITICAL: {
    color: 'text-red-300',
    bg: 'bg-red-500/20',
    border: 'border-red-500/30',
  },
}

const categoryColors = {
  Trabalho: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  Pessoal: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  Saúde: 'bg-green-500/20 text-green-300 border-green-500/30',
  Estudos: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  Reunião: 'bg-red-500/20 text-red-300 border-red-500/30',
  Lazer: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
  Família: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30',
  Esporte: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
}

const mockEvents: Event[] = [
  {
    id: '1',
    title: 'Reunião de Planejamento',
    description: 'Reunião para definir metas do próximo trimestre',
    location: 'Sala de Reuniões A',
    category: 'Trabalho',
    startDate: '2024-01-25T09:00:00',
    endDate: '2024-01-25T10:30:00',
    allDay: false,
    priority: 'HIGH',
    status: 'CONFIRMED',
    reminder: '15min',
    attendees: 'João,Maria,Pedro',
    createdAt: '2024-01-20T00:00:00Z',
    updatedAt: '2024-01-20T00:00:00Z',
  },
  {
    id: '2',
    title: 'Consulta Médica',
    description: 'Check-up anual',
    location: 'Clínica São Lucas',
    category: 'Saúde',
    startDate: '2024-01-26T14:00:00',
    endDate: '2024-01-26T15:00:00',
    allDay: false,
    priority: 'MEDIUM',
    status: 'CONFIRMED',
    reminder: '30min',
    attendees: null,
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z',
  },
  {
    id: '3',
    title: 'Aula de TypeScript',
    description: 'Curso online de TypeScript avançado',
    location: 'Online',
    category: 'Estudos',
    startDate: '2024-01-27T19:00:00',
    endDate: '2024-01-27T21:00:00',
    allDay: false,
    priority: 'MEDIUM',
    status: 'CONFIRMED',
    reminder: '10min',
    attendees: null,
    createdAt: '2024-01-18T00:00:00Z',
    updatedAt: '2024-01-18T00:00:00Z',
  },
]

export default function Calendar() {
  const [events, setEvents] = useState<Event[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    category: 'Pessoal',
    priority: 'MEDIUM',
    attendees: [],
    reminder: true,
    reminderTime: 15,
  })
  const [attendeeInput, setAttendeeInput] = useState('')

  useEffect(() => {
    const savedEvents = localStorage.getItem('care-ai-events')
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents))
    } else {
      setEvents(mockEvents)
      localStorage.setItem('care-ai-events', JSON.stringify(mockEvents))
    }
  }, [])

  const saveEvents = (newEvents: Event[]) => {
    setEvents(newEvents)
    localStorage.setItem('care-ai-events', JSON.stringify(newEvents))
  }

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0]
  }

  const getEventsForDate = (dateStr: string) => {
    return events.filter((event) => event.startDate.startsWith(dateStr))
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === 'all' || event.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleCreateEvent = () => {
    if (!formData.title.trim() || !formData.date) return

    const newEvent: Event = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      location: formData.location,
      category: formData.category,
      startDate: formData.date + 'T' + formData.startTime,
      endDate: formData.date + 'T' + formData.endTime,
      allDay: false,
      priority: formData.priority,
      status: 'CONFIRMED',
      reminder: formData.reminder ? '15min' : null,
      attendees: formData.attendees.join(','),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    const updatedEvents = [...events, newEvent].sort((a, b) => {
      if (a.startDate === b.startDate) {
        return a.endDate?.localeCompare(b.endDate || '') || 0
      }
      return a.startDate.localeCompare(b.startDate)
    })

    saveEvents(updatedEvents)
    setIsCreateModalOpen(false)
    resetForm()
  }

  const handleEditEvent = () => {
    if (!selectedEvent || !formData.title.trim()) return

    const updatedEvents = events.map((event) =>
      event.id === selectedEvent.id
        ? {
            ...event,
            title: formData.title,
            description: formData.description,
            location: formData.location,
            category: formData.category,
            startDate: formData.date + 'T' + formData.startTime,
            endDate: formData.date + 'T' + formData.endTime,
            priority: formData.priority,
            status: 'CONFIRMED',
            reminder: formData.reminder ? '15min' : null,
            attendees: formData.attendees.join(','),
            updatedAt: new Date().toISOString(),
          }
        : event
    )

    saveEvents(updatedEvents)
    setIsEditModalOpen(false)
    setSelectedEvent(null)
    resetForm()
  }

  const handleDeleteEvent = (eventId: string) => {
    const updatedEvents = events.filter((event) => event.id !== eventId)
    saveEvents(updatedEvents)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      date: '',
      startTime: '',
      endTime: '',
      location: '',
      category: 'Pessoal',
      priority: 'MEDIUM',
      attendees: [],
      reminder: true,
      reminderTime: 15,
    })
    setAttendeeInput('')
  }

  const openEditModal = (event: Event) => {
    setSelectedEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      date: event.startDate.split('T')[0],
      startTime: event.startDate.split('T')[1]?.substring(0, 5) || '',
      endTime: event.endDate?.split('T')[1]?.substring(0, 5) || '',
      location: event.location,
      category: event.category,
      priority: event.priority,
      attendees: event.attendees?.split(',') || [],
      reminder: event.reminder !== null,
      reminderTime: 15,
    })
    setIsEditModalOpen(true)
  }

  const addAttendee = () => {
    if (
      attendeeInput.trim() &&
      !formData.attendees.includes(attendeeInput.trim())
    ) {
      setFormData({
        ...formData,
        attendees: [...formData.attendees, attendeeInput.trim()],
      })
      setAttendeeInput('')
    }
  }

  const removeAttendee = (attendeeToRemove: string) => {
    setFormData({
      ...formData,
      attendees: formData.attendees.filter(
        (attendee) => attendee !== attendeeToRemove
      ),
    })
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const openCreateModalForDate = (dateStr: string) => {
    setFormData({ ...formData, date: dateStr })
    setIsCreateModalOpen(true)
  }

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-4"></div>)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = formatDate(
        new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      )
      const dayEvents = getEventsForDate(dateStr)
      const isToday = dateStr === formatDate(new Date())
      const isSelected = dateStr === selectedDate

      days.push(
        <div
          key={day}
          className={`p-2 border border-white/5 min-h-[100px] cursor-pointer transition-all duration-200 hover:bg-white/5 ${
            isToday ? 'bg-blue-500/20' : ''
          } ${isSelected ? 'ring-2 ring-blue-400' : ''}`}
          onClick={() => setSelectedDate(isSelected ? '' : dateStr)}
          onDoubleClick={() => openCreateModalForDate(dateStr)}
        >
          <div
            className={`text-sm font-medium mb-1 ${
              isToday ? 'text-blue-300' : 'text-white'
            }`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs p-1 rounded truncate ${
                  categoryColors[event.category as keyof typeof categoryColors]
                }`}
                title={`${event.startTime} - ${event.title}`}
              >
                {event.startTime} {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-white/60">
                +{dayEvents.length - 2} mais
              </div>
            )}
          </div>
        </div>
      )
    }

    return days
  }

  const upcomingEvents = events
    .filter((event) => new Date(event.startDate) >= new Date())
    .sort((a, b) => {
      if (a.startDate === b.startDate) {
        return a.endDate?.localeCompare(b.endDate || '') || 0
      }
      return a.startDate.localeCompare(b.startDate)
    })
    .slice(0, 5)

  const todayEvents = events.filter(
    (event) => event.startDate.split('T')[0] === formatDate(new Date())
  )

  const loadEvents = async () => {
    try {
      const response = await fetch('/api/events?userId=user_1')
      if (response.ok) {
        const data = await response.json()
        setEvents(data.events || [])
      } else {
        console.error('Erro ao carregar eventos:', response.statusText)
        // Fallback para localStorage se API falhar
        const savedEvents = localStorage.getItem('care-ai-events')
        if (savedEvents) {
          setEvents(JSON.parse(savedEvents))
        } else {
          setEvents(mockEvents)
          localStorage.setItem('care-ai-events', JSON.stringify(mockEvents))
        }
      }
    } catch (error) {
      console.error('Erro ao carregar eventos:', error)
      // Fallback para localStorage
      const savedEvents = localStorage.getItem('care-ai-events')
      if (savedEvents) {
        setEvents(JSON.parse(savedEvents))
      } else {
        setEvents(mockEvents)
        localStorage.setItem('care-ai-events', JSON.stringify(mockEvents))
      }
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">📅 Agenda</h1>
          <p className="text-white/60">Gerencie seus eventos e compromissos</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex bg-white/10 rounded-2xl p-1">
            <button
              onClick={() => setViewMode('month')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <ViewColumnsIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-xl transition-all ${
                viewMode === 'list'
                  ? 'bg-blue-500 text-white'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <ListBulletIcon className="w-5 h-5" />
            </button>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>Novo Evento</span>
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total de Eventos</p>
              <p className="text-2xl font-bold text-white">{events.length}</p>
            </div>
            <CalendarIcon className="w-8 h-8 text-blue-400" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Hoje</p>
              <p className="text-2xl font-bold text-white">
                {todayEvents.length}
              </p>
            </div>
            <CalendarSolidIcon className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Próximos</p>
              <p className="text-2xl font-bold text-white">
                {upcomingEvents.length}
              </p>
            </div>
            <ClockIcon className="w-8 h-8 text-yellow-400" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Com Lembrete</p>
              <p className="text-2xl font-bold text-white">
                {events.filter((e) => e.reminder !== null).length}
              </p>
            </div>
            <BellIcon className="w-8 h-8 text-purple-400" />
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
              placeholder="Buscar eventos..."
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
        </div>
      </div>

      {viewMode === 'month' ? (
        <div className="space-y-6">
          {/* Calendar Header */}
          <div className="glass-card p-6 rounded-3xl">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => navigateMonth('prev')}
                className="icon-btn"
              >
                <ChevronLeftIcon className="w-5 h-5" />
              </button>
              <h2 className="text-xl font-bold text-white">
                {currentDate.toLocaleDateString('pt-BR', {
                  month: 'long',
                  year: 'numeric',
                })}
              </h2>
              <button
                onClick={() => navigateMonth('next')}
                className="icon-btn"
              >
                <ChevronRightIcon className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0 dark-card rounded-2xl overflow-hidden">
              {/* Week days header */}
              {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
                <div
                  key={day}
                  className="p-4 bg-white/5 text-center font-medium text-white/80 border-b border-white/10"
                >
                  {day}
                </div>
              ))}
              {/* Calendar days */}
              {renderCalendarGrid()}
            </div>
          </div>

          {/* Selected Date Events */}
          {selectedDate && (
            <div className="glass-card p-6 rounded-3xl">
              <h3 className="text-lg font-bold text-white mb-4">
                Eventos - {new Date(selectedDate).toLocaleDateString('pt-BR')}
              </h3>
              <div className="space-y-3">
                {getEventsForDate(selectedDate).map((event) => (
                  <div
                    key={event.id}
                    className="dark-card p-4 rounded-2xl flex items-center justify-between"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-medium text-white">
                          {event.title}
                        </h4>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            categoryColors[
                              event.category as keyof typeof categoryColors
                            ]
                          }`}
                        >
                          {event.category}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-white/70">
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>
                            {event.startTime} - {event.endTime}
                          </span>
                        </div>
                        {event.location && (
                          <div className="flex items-center space-x-1">
                            <MapPinIcon className="w-4 h-4" />
                            <span>{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => openEditModal(event)}
                        className="icon-btn !w-8 !h-8"
                      >
                        <PencilIcon className="w-4 h-4 text-white/60" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="icon-btn !w-8 !h-8"
                      >
                        <TrashIcon className="w-4 h-4 text-red-400" />
                      </button>
                    </div>
                  </div>
                ))}
                {getEventsForDate(selectedDate).length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-white/60 mb-4">
                      Nenhum evento nesta data
                    </p>
                    <button
                      onClick={() => openCreateModalForDate(selectedDate)}
                      className="btn-secondary"
                    >
                      Criar evento
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {filteredEvents.map((event) => {
            const config =
              priorityConfig[event.priority as keyof typeof priorityConfig]
            return (
              <div key={event.id} className="dark-card p-6 rounded-3xl">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {event.title}
                      </h3>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          categoryColors[
                            event.category as keyof typeof categoryColors
                          ]
                        }`}
                      >
                        {event.category}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${config.bg} ${config.color} border ${config.border}`}
                      >
                        {event.priority}
                      </span>
                    </div>
                    {event.description && (
                      <p className="text-white/70 text-sm mb-3">
                        {event.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <div className="flex items-center space-x-1">
                        <CalendarIcon className="w-4 h-4" />
                        <span>
                          {new Date(event.startDate).toLocaleDateString(
                            'pt-BR'
                          )}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <ClockIcon className="w-4 h-4" />
                        <span>
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center space-x-1">
                          <MapPinIcon className="w-4 h-4" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.attendees && event.attendees.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <UserGroupIcon className="w-4 h-4" />
                          <span>{event.attendees.length} participantes</span>
                        </div>
                      )}
                      {event.reminder && (
                        <div className="flex items-center space-x-1">
                          <BellIcon className="w-4 h-4" />
                          <span>{event.reminderTime}min antes</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => openEditModal(event)}
                      className="icon-btn !w-8 !h-8"
                    >
                      <PencilIcon className="w-4 h-4 text-white/60" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="icon-btn !w-8 !h-8"
                    >
                      <TrashIcon className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <CalendarIcon className="w-16 h-16 text-white/30 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white mb-2">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Nenhum evento encontrado'
                  : 'Nenhum evento criado ainda'}
              </h3>
              <p className="text-white/60 mb-6">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Tente ajustar seus filtros de busca'
                  : 'Comece criando seu primeiro evento'}
              </p>
              {!searchTerm && selectedCategory === 'all' && (
                <button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="btn-primary"
                >
                  Criar primeiro evento
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || isEditModalOpen) && (
        <div className="modal-overlay">
          <div className="modal-content max-w-2xl">
            <h2 className="text-xl font-bold text-white mb-6">
              {isCreateModalOpen ? 'Novo Evento' : 'Editar Evento'}
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
                  placeholder="Ex: Reunião de equipe"
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
                  placeholder="Descreva o evento..."
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Data
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="input-dark w-full"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Início
                  </label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) =>
                      setFormData({ ...formData, startTime: e.target.value })
                    }
                    className="input-dark w-full"
                  />
                </div>
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Fim
                  </label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) =>
                      setFormData({ ...formData, endTime: e.target.value })
                    }
                    className="input-dark w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Local
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                  className="input-dark w-full"
                  placeholder="Ex: Sala de reuniões, Online, etc."
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
                    Prioridade
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        priority: e.target.value as Event['priority'],
                      })
                    }
                    className="input-dark w-full"
                  >
                    <option value="baixa">Baixa</option>
                    <option value="média">Média</option>
                    <option value="alta">Alta</option>
                    <option value="crítica">Crítica</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Participantes
                </label>
                <div className="flex space-x-2 mb-2">
                  <input
                    type="text"
                    value={attendeeInput}
                    onChange={(e) => setAttendeeInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addAttendee()}
                    className="input-dark flex-1"
                    placeholder="Nome do participante..."
                  />
                  <button
                    type="button"
                    onClick={addAttendee}
                    className="btn-secondary px-4"
                  >
                    Adicionar
                  </button>
                </div>
                {formData.attendees.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.attendees.map((attendee, index) => (
                      <span
                        key={index}
                        className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center space-x-1"
                      >
                        <span>{attendee}</span>
                        <button
                          onClick={() => removeAttendee(attendee)}
                          className="text-blue-300 hover:text-red-300"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.reminder}
                    onChange={(e) =>
                      setFormData({ ...formData, reminder: e.target.checked })
                    }
                    className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500"
                  />
                  <span className="text-white/80 text-sm">Lembrete</span>
                </label>
                {formData.reminder && (
                  <div className="flex items-center space-x-2">
                    <select
                      value={formData.reminderTime}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          reminderTime: Number(e.target.value),
                        })
                      }
                      className="input-dark text-sm"
                    >
                      <option value={5}>5 minutos antes</option>
                      <option value={10}>10 minutos antes</option>
                      <option value={15}>15 minutos antes</option>
                      <option value={30}>30 minutos antes</option>
                      <option value={60}>1 hora antes</option>
                      <option value={1440}>1 dia antes</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setIsCreateModalOpen(false)
                  setIsEditModalOpen(false)
                  setSelectedEvent(null)
                  resetForm()
                }}
                className="btn-ghost"
              >
                Cancelar
              </button>
              <button
                onClick={
                  isCreateModalOpen ? handleCreateEvent : handleEditEvent
                }
                className="btn-primary"
                disabled={!formData.title.trim() || !formData.date}
              >
                {isCreateModalOpen ? 'Criar Evento' : 'Salvar Alterações'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
