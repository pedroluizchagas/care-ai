'use client'

import { useState, useEffect } from 'react'
import {
  CalendarDaysIcon,
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
import {
  CalendarDaysIcon as CalendarSolidIcon,
  ClockIcon as ClockSolidIcon,
} from '@heroicons/react/24/solid'

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

interface EventFormData {
  title: string
  description: string
  location: string
  category: string
  startDate: string
  endDate: string
  allDay: boolean
  priority: string
  reminder: string
  attendees: string
}

const categories = [
  'Reunião',
  'Consulta',
  'Evento',
  'Pessoal',
  'Trabalho',
  'Saúde',
  'Educação',
]

const mockEvents: Event[] = [
  // Eventos para o mês atual (janeiro 2025)
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
  {
    id: '3',
    title: 'Jantar de Trabalho',
    description: 'Reunião com cliente importante',
    location: 'Restaurante Fino',
    category: 'Trabalho',
    startDate: '2025-01-25T19:00:00',
    endDate: '2025-01-25T22:00:00',
    allDay: false,
    priority: 'HIGH',
    status: 'SCHEDULED',
    reminder: '1hour',
    attendees: 'Cliente VIP',
    createdAt: '2025-01-20T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z',
  },
  {
    id: '4',
    title: 'Treino Academia',
    description: 'Treino de pernas',
    location: 'Smart Fit',
    category: 'Pessoal',
    startDate: '2025-01-22T07:00:00',
    endDate: '2025-01-22T08:30:00',
    allDay: false,
    priority: 'MEDIUM',
    status: 'SCHEDULED',
    reminder: '30min',
    attendees: null,
    createdAt: '2025-01-18T00:00:00Z',
    updatedAt: '2025-01-18T00:00:00Z',
  },
  {
    id: '5',
    title: 'Apresentação Projeto',
    description: 'Apresentação para a diretoria',
    location: 'Auditório Principal',
    category: 'Trabalho',
    startDate: '2025-01-30T10:00:00',
    endDate: '2025-01-30T11:00:00',
    allDay: false,
    priority: 'CRITICAL',
    status: 'SCHEDULED',
    reminder: '15min',
    attendees: 'Diretoria, Equipe',
    createdAt: '2025-01-25T00:00:00Z',
    updatedAt: '2025-01-25T00:00:00Z',
  },
  {
    id: '6',
    title: 'Café com Amigos',
    description: 'Encontro semanal no café',
    location: 'Café Central',
    category: 'Pessoal',
    startDate: '2025-01-18T15:00:00',
    endDate: '2025-01-18T17:00:00',
    allDay: false,
    priority: 'LOW',
    status: 'SCHEDULED',
    reminder: '30min',
    attendees: 'Ana, Carlos',
    createdAt: '2025-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z',
  },
  {
    id: '7',
    title: 'Exame Laboratorial',
    description: 'Exames de sangue periódicos',
    location: 'Lab Saúde Total',
    category: 'Saúde',
    startDate: '2025-01-12T08:00:00',
    endDate: '2025-01-12T09:00:00',
    allDay: false,
    priority: 'HIGH',
    status: 'SCHEDULED',
    reminder: '1hour',
    attendees: null,
    createdAt: '2025-01-10T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z',
  },
  {
    id: '8',
    title: 'Workshop JavaScript',
    description: 'Curso de JavaScript avançado',
    location: 'Tech Hub',
    category: 'Educação',
    startDate: '2025-01-28T09:00:00',
    endDate: '2025-01-28T17:00:00',
    allDay: false,
    priority: 'MEDIUM',
    status: 'SCHEDULED',
    reminder: '1hour',
    attendees: 'Turma Dev',
    createdAt: '2025-01-20T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z',
  },
  {
    id: '9',
    title: 'Cinema com a Família',
    description: 'Sessão do novo filme',
    location: 'Shopping Center',
    category: 'Pessoal',
    startDate: '2025-01-26T20:00:00',
    endDate: '2025-01-26T22:30:00',
    allDay: false,
    priority: 'LOW',
    status: 'SCHEDULED',
    reminder: '1hour',
    attendees: 'Família',
    createdAt: '2025-01-24T00:00:00Z',
    updatedAt: '2025-01-24T00:00:00Z',
  },
  {
    id: '10',
    title: 'Dentista',
    description: 'Limpeza e check-up dental',
    location: 'Clínica OdontoVida',
    category: 'Saúde',
    startDate: '2025-01-14T14:30:00',
    endDate: '2025-01-14T15:30:00',
    allDay: false,
    priority: 'MEDIUM',
    status: 'SCHEDULED',
    reminder: '1hour',
    attendees: null,
    createdAt: '2025-01-12T00:00:00Z',
    updatedAt: '2025-01-12T00:00:00Z',
  },
]

export default function Events() {
  const [events, setEvents] = useState<Event[]>([])
  const [viewMode, setViewMode] = useState<'month' | 'list'>('month')
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPriority, setSelectedPriority] = useState<string>('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    location: '',
    category: 'Reunião',
    startDate: '',
    endDate: '',
    allDay: false,
    priority: 'MEDIUM',
    reminder: '15min',
    attendees: '',
  })

  useEffect(() => {
    console.log('🚀 Componente Events montado, carregando eventos...')
    // Carregar mock events imediatamente
    console.log(
      '📋 Carregando eventos mock primeiro...',
      mockEvents.length,
      'eventos'
    )
    setEvents(mockEvents)
    console.log('✅ Eventos mock carregados no state')

    // Depois tentar carregar da API (opcional)
    loadEvents()
  }, [])

  // Debug: monitorar mudanças no estado dos eventos
  useEffect(() => {
    console.log('📊 Estado dos eventos atualizado:', events.length, 'eventos')
    if (events.length > 0) {
      console.log(
        '📅 Datas dos eventos:',
        events.map((e) => ({ title: e.title, date: e.startDate.split('T')[0] }))
      )
    }
  }, [events])

  const loadEvents = async () => {
    try {
      console.log('📡 Tentando carregar da API (opcional)...')
      const response = await fetch('/api/events?userId=user_1')
      if (response.ok) {
        const data = await response.json()
        console.log('📊 Resposta da API:', data.events?.length || 0, 'eventos')

        // Só substitui os mock events se a API tiver dados válidos
        if (data.events && data.events.length > 0) {
          console.log('🔄 Substituindo mock events por dados da API')
          setEvents(data.events)
          localStorage.setItem('care-ai-events', JSON.stringify(data.events))
        } else {
          console.log('📋 API vazia, mantendo eventos mock')
        }
      } else {
        console.log(
          '⚠️ API falhou, mantendo eventos mock:',
          response.statusText
        )
      }
    } catch (error) {
      console.log('⚠️ Erro na API, mantendo eventos mock:', error)
    }
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory =
      selectedCategory === 'all' || event.category === selectedCategory
    const matchesPriority =
      selectedPriority === 'all' || event.priority === selectedPriority

    return matchesSearch && matchesCategory && matchesPriority
  })

  const formatDateTime = (dateString: string, allDay: boolean = false) => {
    const date = new Date(dateString)
    if (allDay) {
      return date.toLocaleDateString('pt-BR')
    }
    return date.toLocaleString('pt-BR')
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-red-500/20 text-red-300 border-red-500/30'
      case 'HIGH':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
      case 'LOW':
        return 'bg-green-500/20 text-green-300 border-green-500/30'
      default:
        return 'bg-white/10 text-white/60 border-white/20'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Reunião':
        return '👥'
      case 'Consulta':
        return '🏥'
      case 'Evento':
        return '🎉'
      case 'Pessoal':
        return '👤'
      case 'Trabalho':
        return '💼'
      case 'Saúde':
        return '❤️'
      case 'Educação':
        return '📚'
      default:
        return '📅'
    }
  }

  const todayEvents = events.filter((event) => {
    const today = new Date().toDateString()
    const eventDate = new Date(event.startDate).toDateString()
    return eventDate === today
  })

  const upcomingEvents = events.filter((event) => {
    const today = new Date()
    const eventDate = new Date(event.startDate)
    return eventDate > today
  })

  // Funções do calendário
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const formatDate = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  const getEventsForDate = (dateStr: string) => {
    console.log(`🔍 Buscando eventos para ${dateStr}:`)
    console.log(`📊 Total de eventos no state: ${events.length}`)

    const eventsForDay = events.filter((event) => {
      const eventDate = event.startDate.split('T')[0] // Extrai apenas a data (YYYY-MM-DD)
      const match = eventDate === dateStr
      if (match) {
        console.log(`✅ Evento encontrado: ${event.title} em ${eventDate}`)
      }
      return match
    })

    console.log(
      `📅 Total de eventos encontrados para ${dateStr}: ${eventsForDay.length}`
    )

    if (eventsForDay.length > 0) {
      console.log(
        '✅ Eventos do dia:',
        eventsForDay.map((e) => ({
          title: e.title,
          date: e.startDate,
          time: e.startDate.split('T')[1],
        }))
      )
    } else {
      console.log('❌ Nenhum evento encontrado para este dia')
    }

    return eventsForDay.sort((a, b) => {
      // Ordenar por horário de início
      return new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
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
    setSelectedDate(dateStr)
    setFormData({ ...formData, startDate: dateStr + 'T09:00:00' })
    setIsCreateModalOpen(true)
  }

  // Funções de manipulação dos eventos
  const handleCreateEvent = async () => {
    if (!formData.title.trim()) return

    const newEvent: Event = {
      id: crypto.randomUUID(),
      title: formData.title,
      description: formData.description,
      location: formData.location,
      category: formData.category,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      allDay: formData.allDay,
      priority: formData.priority,
      status: 'SCHEDULED',
      reminder: formData.reminder || null,
      attendees: formData.attendees || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    try {
      // Tentar salvar na API
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEvent, userId: 'user_1' }),
      })

      if (response.ok) {
        const data = await response.json()
        setEvents([...events, data.event])
      } else {
        // Fallback para localStorage se API falhar
        const updatedEvents = [...events, newEvent]
        setEvents(updatedEvents)
        localStorage.setItem('care-ai-events', JSON.stringify(updatedEvents))
      }
    } catch (error) {
      // Fallback para localStorage
      const updatedEvents = [...events, newEvent]
      setEvents(updatedEvents)
      localStorage.setItem('care-ai-events', JSON.stringify(updatedEvents))
    }

    setIsCreateModalOpen(false)
    resetForm()
  }

  const handleEditEvent = async () => {
    if (!selectedEvent || !formData.title.trim()) return

    const updatedEvent = {
      ...selectedEvent,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      category: formData.category,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      allDay: formData.allDay,
      priority: formData.priority,
      reminder: formData.reminder || null,
      attendees: formData.attendees || null,
      updatedAt: new Date().toISOString(),
    }

    try {
      // Tentar atualizar na API
      const response = await fetch('/api/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedEvent),
      })

      if (response.ok) {
        const data = await response.json()
        setEvents(
          events.map((event) =>
            event.id === selectedEvent.id ? data.event : event
          )
        )
      } else {
        // Fallback para localStorage se API falhar
        const updatedEvents = events.map((event) =>
          event.id === selectedEvent.id ? updatedEvent : event
        )
        setEvents(updatedEvents)
        localStorage.setItem('care-ai-events', JSON.stringify(updatedEvents))
      }
    } catch (error) {
      // Fallback para localStorage
      const updatedEvents = events.map((event) =>
        event.id === selectedEvent.id ? updatedEvent : event
      )
      setEvents(updatedEvents)
      localStorage.setItem('care-ai-events', JSON.stringify(updatedEvents))
    }

    setIsEditModalOpen(false)
    setSelectedEvent(null)
    resetForm()
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Tem certeza que deseja excluir este evento?')) return

    try {
      // Tentar deletar na API
      const response = await fetch(`/api/events?id=${eventId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        setEvents(events.filter((event) => event.id !== eventId))
      } else {
        // Fallback para localStorage se API falhar
        const updatedEvents = events.filter((event) => event.id !== eventId)
        setEvents(updatedEvents)
        localStorage.setItem('care-ai-events', JSON.stringify(updatedEvents))
      }
    } catch (error) {
      // Fallback para localStorage
      const updatedEvents = events.filter((event) => event.id !== eventId)
      setEvents(updatedEvents)
      localStorage.setItem('care-ai-events', JSON.stringify(updatedEvents))
    }
  }

  const openEditModal = (event: Event) => {
    setSelectedEvent(event)
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      category: event.category,
      startDate: event.startDate,
      endDate: event.endDate || '',
      allDay: event.allDay,
      priority: event.priority,
      reminder: event.reminder || '15min',
      attendees: event.attendees || '',
    })
    setIsEditModalOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      category: 'Reunião',
      startDate: '',
      endDate: '',
      allDay: false,
      priority: 'MEDIUM',
      reminder: '15min',
      attendees: '',
    })
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">📅 Agenda</h1>
          <p className="text-white/60">Gerencie seus compromissos e eventos</p>
        </div>
        <div className="flex items-center space-x-3">
          {/* Toggle View */}
          <div className="glass-card p-1 rounded-2xl">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                viewMode === 'month'
                  ? 'glass-active text-white shadow-glow-blue'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <ViewColumnsIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-xl transition-all duration-200 ${
                viewMode === 'list'
                  ? 'glass-active text-white shadow-glow-blue'
                  : 'text-white/70 hover:text-white'
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

      {/* Calendar Navigation - only in month view */}
      {viewMode === 'month' && (
        <div className="glass-card p-6 rounded-3xl">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => navigateMonth('prev')} className="icon-btn">
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold text-white">
              {currentDate.toLocaleDateString('pt-BR', {
                month: 'long',
                year: 'numeric',
              })}
            </h2>
            <button onClick={() => navigateMonth('next')} className="icon-btn">
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Headers */}
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
              <div
                key={day}
                className="p-2 text-center text-white/60 text-sm font-medium"
              >
                {day}
              </div>
            ))}

            {/* Days */}
            {Array.from({ length: getFirstDayOfMonth(currentDate) }).map(
              (_, index) => (
                <div key={`empty-${index}`} className="p-2" />
              )
            )}

            {Array.from({ length: getDaysInMonth(currentDate) }).map(
              (_, dayIndex) => {
                const day = dayIndex + 1
                const date = new Date(
                  currentDate.getFullYear(),
                  currentDate.getMonth(),
                  day
                )
                const dateStr = formatDate(date)
                const dayEvents = getEventsForDate(dateStr)
                const isToday = dateStr === formatDate(new Date())
                const isSelected = dateStr === selectedDate

                return (
                  <div
                    key={day}
                    className={`p-3 min-h-[140px] rounded-xl transition-all duration-200 border ${
                      isSelected
                        ? 'bg-blue-500/20 border-blue-400'
                        : isToday
                        ? 'bg-blue-500/10 border-blue-500/30'
                        : dayEvents.length > 0
                        ? 'bg-white/5 border-white/10 hover:bg-white/10'
                        : 'border-white/5 hover:bg-white/5'
                    }`}
                  >
                    {/* Número do dia */}
                    <div
                      className={`text-sm font-medium mb-2 ${
                        isToday ? 'text-blue-300' : 'text-white'
                      }`}
                    >
                      {day}
                    </div>

                    {/* Eventos do dia */}
                    <div className="space-y-1">
                      {dayEvents.slice(0, 3).map((event) => {
                        const eventTime = new Date(
                          event.startDate
                        ).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                        const categoryIcon = getCategoryIcon(event.category)

                        return (
                          <div
                            key={event.id}
                            onClick={(e) => {
                              e.stopPropagation()
                              openEditModal(event)
                            }}
                            className={`text-xs px-2 py-1 rounded-lg border transition-all hover:scale-105 cursor-pointer ${getPriorityColor(
                              event.priority
                            )}`}
                            title={`${event.title} - ${eventTime}${
                              event.location ? ` @ ${event.location}` : ''
                            } (Clique para editar)`}
                          >
                            <div className="flex items-center space-x-1">
                              <span className="text-xs">{categoryIcon}</span>
                              <span className="truncate font-medium">
                                {event.title}
                              </span>
                            </div>
                            <div className="text-xs opacity-75 mt-0.5">
                              {eventTime}
                            </div>
                          </div>
                        )
                      })}

                      {/* Indicador de mais eventos */}
                      {dayEvents.length > 3 && (
                        <div className="text-xs text-white/50 px-2 py-1 text-center bg-white/5 rounded-lg">
                          +{dayEvents.length - 3} mais
                        </div>
                      )}
                    </div>
                  </div>
                )
              }
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total</p>
              <p className="text-2xl font-bold text-white">{events.length}</p>
            </div>
            <CalendarDaysIcon className="w-8 h-8 text-blue-400" />
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
            <CalendarSolidIcon className="w-8 h-8 text-yellow-400" />
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
            <ClockSolidIcon className="w-8 h-8 text-green-400" />
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Esta Semana</p>
              <p className="text-2xl font-bold text-white">
                {
                  events.filter((event) => {
                    const eventDate = new Date(event.startDate)
                    const today = new Date()
                    const weekFromNow = new Date(
                      today.getTime() + 7 * 24 * 60 * 60 * 1000
                    )
                    return eventDate >= today && eventDate <= weekFromNow
                  }).length
                }
              </p>
            </div>
            <ClockIcon className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Search and Filters - only in list view */}
      {viewMode === 'list' && (
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
            <select
              value={selectedPriority}
              onChange={(e) => setSelectedPriority(e.target.value)}
              className="input-dark"
            >
              <option value="all">Todas as prioridades</option>
              <option value="CRITICAL">Crítica</option>
              <option value="HIGH">Alta</option>
              <option value="MEDIUM">Média</option>
              <option value="LOW">Baixa</option>
            </select>
          </div>
        </div>
      )}

      {/* Events Grid - only in list view */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="dark-card p-6 rounded-3xl group hover:scale-[1.02] transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-lg">
                      {getCategoryIcon(event.category)}
                    </span>
                    <h3 className="text-lg font-semibold text-white truncate">
                      {event.title}
                    </h3>
                  </div>
                  <p className="text-white/70 text-sm mb-3 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {event.category}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full border ${getPriorityColor(
                        event.priority
                      )}`}
                    >
                      {event.priority}
                    </span>
                  </div>
                </div>

                {/* Botões de ação */}
                <div className="flex items-center space-x-2 ml-3">
                  <button
                    onClick={() => openEditModal(event)}
                    className="icon-btn !w-8 !h-8 text-yellow-400 hover:text-yellow-300"
                    title="Editar evento"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="icon-btn !w-8 !h-8 text-red-400 hover:text-red-300"
                    title="Excluir evento"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Date and Time */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center space-x-2 text-sm text-white/70">
                  <CalendarDaysIcon className="w-4 h-4" />
                  <span>{formatDateTime(event.startDate, event.allDay)}</span>
                </div>
                {event.endDate && !event.allDay && (
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <ClockIcon className="w-4 h-4" />
                    <span>até {formatDateTime(event.endDate)}</span>
                  </div>
                )}
                {event.location && (
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <MapPinIcon className="w-4 h-4" />
                    <span className="truncate">{event.location}</span>
                  </div>
                )}
                {event.attendees && (
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <UserGroupIcon className="w-4 h-4" />
                    <span className="truncate">{event.attendees}</span>
                  </div>
                )}
                {event.reminder && (
                  <div className="flex items-center space-x-2 text-sm text-white/70">
                    <BellIcon className="w-4 h-4" />
                    <span>Lembrete: {event.reminder}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {viewMode === 'list' && filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <CalendarDaysIcon className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">
            {searchTerm ||
            selectedCategory !== 'all' ||
            selectedPriority !== 'all'
              ? 'Nenhum evento encontrado'
              : 'Nenhum evento agendado ainda'}
          </h3>
          <p className="text-white/60 mb-6">
            {searchTerm ||
            selectedCategory !== 'all' ||
            selectedPriority !== 'all'
              ? 'Tente ajustar seus filtros de busca'
              : 'Comece agendando seus primeiros eventos'}
          </p>
          {!searchTerm &&
            selectedCategory === 'all' &&
            selectedPriority === 'all' && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="btn-primary"
              >
                Agendar primeiro evento
              </button>
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
                  placeholder="Ex: Reunião com cliente"
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="input-dark w-full"
                  >
                    <option value="LOW">Baixa</option>
                    <option value="MEDIUM">Média</option>
                    <option value="HIGH">Alta</option>
                    <option value="CRITICAL">Crítica</option>
                  </select>
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
                  placeholder="Ex: Sala de reuniões, escritório, online..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Data e Hora de Início
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    className="input-dark w-full"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Data e Hora de Fim (opcional)
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    className="input-dark w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Lembrete
                  </label>
                  <select
                    value={formData.reminder}
                    onChange={(e) =>
                      setFormData({ ...formData, reminder: e.target.value })
                    }
                    className="input-dark w-full"
                  >
                    <option value="">Sem lembrete</option>
                    <option value="15min">15 minutos antes</option>
                    <option value="30min">30 minutos antes</option>
                    <option value="1hour">1 hora antes</option>
                    <option value="1day">1 dia antes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Participantes
                  </label>
                  <input
                    type="text"
                    value={formData.attendees}
                    onChange={(e) =>
                      setFormData({ ...formData, attendees: e.target.value })
                    }
                    className="input-dark w-full"
                    placeholder="Ex: João, Maria, Pedro"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="allDay"
                  checked={formData.allDay}
                  onChange={(e) =>
                    setFormData({ ...formData, allDay: e.target.checked })
                  }
                  className="rounded border-white/30 bg-white/10 text-blue-500"
                />
                <label htmlFor="allDay" className="text-white/80 text-sm">
                  Evento de dia inteiro
                </label>
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
                disabled={!formData.title.trim() || !formData.startDate}
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
