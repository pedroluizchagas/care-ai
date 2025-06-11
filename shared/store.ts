import { Task, Note, Goal, Event, ChatMessage, UserPreferences } from '@shared/types'
import { generateId } from './utils'

// Simulação de store global com localStorage
class CareAIStore {
  private tasks: Task[] = []
  private notes: Note[] = []
  private goals: Goal[] = []
  private events: Event[] = []
  private chatMessages: ChatMessage[] = []
  private preferences: UserPreferences

  constructor() {
    this.preferences = {
      theme: 'light',
      notifications: true,
      workingHours: {
        start: '09:00',
        end: '18:00',
      },
      categories: {
        tasks: ['Trabalho', 'Pessoal', 'Estudos', 'Saúde', 'Casa'],
        notes: ['Ideias', 'Reuniões', 'Pesquisas', 'Pessoal', 'Projetos'],
        goals: ['Carreira', 'Saúde', 'Financeiro', 'Pessoal', 'Estudos'],
        events: ['Trabalho', 'Pessoal', 'Saúde', 'Social', 'Família'],
      },
    }
    this.loadFromStorage()
    this.seedInitialData()
  }

  // Tasks
  getTasks(): Task[] {
    return this.tasks
  }

  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Task {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.tasks.push(newTask)
    this.saveToStorage()
    return newTask
  }

  updateTask(id: string, updates: Partial<Task>): Task | null {
    const index = this.tasks.findIndex((task) => task.id === id)
    if (index === -1) return null

    this.tasks[index] = {
      ...this.tasks[index],
      ...updates,
      updatedAt: new Date(),
    }
    this.saveToStorage()
    return this.tasks[index]
  }

  deleteTask(id: string): boolean {
    const index = this.tasks.findIndex((task) => task.id === id)
    if (index === -1) return false

    this.tasks.splice(index, 1)
    this.saveToStorage()
    return true
  }

  // Notes
  getNotes(): Note[] {
    return this.notes
  }

  addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const newNote: Note = {
      ...note,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.notes.push(newNote)
    this.saveToStorage()
    return newNote
  }

  updateNote(id: string, updates: Partial<Note>): Note | null {
    const index = this.notes.findIndex((note) => note.id === id)
    if (index === -1) return null

    this.notes[index] = {
      ...this.notes[index],
      ...updates,
      updatedAt: new Date(),
    }
    this.saveToStorage()
    return this.notes[index]
  }

  deleteNote(id: string): boolean {
    const index = this.notes.findIndex((note) => note.id === id)
    if (index === -1) return false

    this.notes.splice(index, 1)
    this.saveToStorage()
    return true
  }

  // Goals
  getGoals(): Goal[] {
    return this.goals
  }

  addGoal(goal: Omit<Goal, 'id' | 'createdAt' | 'updatedAt'>): Goal {
    const newGoal: Goal = {
      ...goal,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    this.goals.push(newGoal)
    this.saveToStorage()
    return newGoal
  }

  updateGoal(id: string, updates: Partial<Goal>): Goal | null {
    const index = this.goals.findIndex((goal) => goal.id === id)
    if (index === -1) return null

    this.goals[index] = {
      ...this.goals[index],
      ...updates,
      updatedAt: new Date(),
    }
    this.saveToStorage()
    return this.goals[index]
  }

  // Events
  getEvents(): Event[] {
    return this.events
  }

  addEvent(event: Omit<Event, 'id'>): Event {
    const newEvent: Event = {
      ...event,
      id: generateId(),
    }
    this.events.push(newEvent)
    this.saveToStorage()
    return newEvent
  }

  // Chat
  getChatMessages(): ChatMessage[] {
    return this.chatMessages
  }

  addChatMessage(message: Omit<ChatMessage, 'id' | 'timestamp'>): ChatMessage {
    const newMessage: ChatMessage = {
      ...message,
      id: generateId(),
      timestamp: new Date(),
    }
    this.chatMessages.push(newMessage)
    this.saveToStorage()
    return newMessage
  }

  // Preferences
  getPreferences(): UserPreferences {
    return this.preferences
  }

  updatePreferences(updates: Partial<UserPreferences>): UserPreferences {
    this.preferences = { ...this.preferences, ...updates }
    this.saveToStorage()
    return this.preferences
  }

  // Storage
  private saveToStorage() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(
        'careai-data',
        JSON.stringify({
          tasks: this.tasks,
          notes: this.notes,
          goals: this.goals,
          events: this.events,
          chatMessages: this.chatMessages,
          preferences: this.preferences,
        })
      )
    }
  }

  private loadFromStorage() {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('careai-data')
      if (data) {
        const parsed = JSON.parse(data)

        // Converter strings de data de volta para objetos Date
        this.tasks = (parsed.tasks || []).map((task: any) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          createdAt: new Date(task.createdAt),
          updatedAt: new Date(task.updatedAt),
        }))

        this.notes = (parsed.notes || []).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }))

        this.goals = (parsed.goals || []).map((goal: any) => ({
          ...goal,
          targetDate: new Date(goal.targetDate),
          createdAt: new Date(goal.createdAt),
          updatedAt: new Date(goal.updatedAt),
          milestones:
            goal.milestones?.map((milestone: any) => ({
              ...milestone,
              dueDate: milestone.dueDate
                ? new Date(milestone.dueDate)
                : undefined,
            })) || [],
        }))

        this.events = (parsed.events || []).map((event: any) => ({
          ...event,
          startDate: new Date(event.startDate),
          endDate: new Date(event.endDate),
        }))

        this.chatMessages = (parsed.chatMessages || []).map((message: any) => ({
          ...message,
          timestamp: new Date(message.timestamp),
        }))

        this.preferences = { ...this.preferences, ...parsed.preferences }
      }
    }
  }

  private seedInitialData() {
    if (this.tasks.length === 0) {
      // Adicionar dados iniciais para demonstração
      this.addTask({
        title: 'Revisar relatório mensal',
        description: 'Revisar e finalizar o relatório de vendas do mês',
        completed: false,
        priority: 'alta',
        category: 'Trabalho',
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      })

      this.addTask({
        title: 'Exercitar-se',
        description: 'Fazer 30 minutos de exercício',
        completed: true,
        priority: 'média',
        category: 'Saúde',
      })

      this.addNote({
        title: 'Ideias para novo projeto',
        content:
          'Desenvolver um aplicativo de gestão de tempo com IA integrada...',
        category: 'Ideias',
        tags: ['projeto', 'ia', 'produtividade'],
        pinned: true,
      })

      this.addGoal({
        title: 'Aprender Next.js',
        description: 'Dominar o framework Next.js para desenvolvimento web',
        category: 'Estudos',
        targetDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        progress: 45,
        milestones: [
          {
            id: generateId(),
            title: 'Completar tutorial básico',
            completed: true,
          },
          {
            id: generateId(),
            title: 'Construir primeiro projeto',
            completed: false,
          },
          {
            id: generateId(),
            title: 'Implementar funcionalidades avançadas',
            completed: false,
          },
        ],
        completed: false,
      })
    }
  }
}

export const store = new CareAIStore()
