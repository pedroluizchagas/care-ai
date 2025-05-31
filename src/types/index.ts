export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: 'baixa' | 'média' | 'alta' | 'crítica'
  category: string
  dueDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  pinned: boolean
}

export interface Goal {
  id: string
  title: string
  description: string
  category: string
  targetDate: Date
  progress: number // 0-100
  milestones: Milestone[]
  createdAt: Date
  updatedAt: Date
  completed: boolean
}

export interface Milestone {
  id: string
  title: string
  description?: string
  completed: boolean
  dueDate?: Date
}

export interface Event {
  id: string
  title: string
  description?: string
  startDate: Date
  endDate: Date
  category: string
  location?: string
  isAllDay: boolean
  reminders: Reminder[]
}

export interface Reminder {
  id: string
  type: 'popup' | 'email' | 'notification'
  time: number // minutes before event
}

export interface ChatMessage {
  id: string
  content: string
  type: 'user' | 'assistant'
  timestamp: Date
  context?: {
    actionType?: 'create_task' | 'schedule_event' | 'add_note' | 'update_goal'
    data?: any
  }
}

export interface DashboardStats {
  tasksCompleted: number
  tasksTotal: number
  upcomingEvents: number
  activeGoals: number
  notesCount: number
  productivityScore: number
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  notifications: boolean
  workingHours: {
    start: string
    end: string
  }
  categories: {
    tasks: string[]
    notes: string[]
    goals: string[]
    events: string[]
  }
}
