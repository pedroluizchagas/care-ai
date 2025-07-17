export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export interface Task {
  id: string
  title: string
  description?: string
  completed: boolean
  priority: Priority
  category: string
  userId: string
  createdAt: Date
  updatedAt: Date
  dueDate?: Date
}

export interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface Goal {
  id: string
  title: string
  description?: string
  target: number
  current: number
  category: string
  userId: string
  isCompleted: boolean
  deadline?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Event {
  id: string
  title: string
  description?: string
  location?: string
  category: string
  startDate: Date
  endDate?: Date
  allDay: boolean
  priority: Priority
  reminder?: string
  attendees?: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

// Financial types
export type TransactionType = 'INCOME' | 'EXPENSE'
export type PaymentMethod = 'CASH' | 'DEBIT' | 'CREDIT' | 'PIX' | 'TRANSFER'
export type RecurrenceType = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'

export interface FinancialCategory {
  id: string
  name: string
  icon: string
  color: string
  type: TransactionType
  userId: string
  isDefault: boolean
  createdAt: Date
  updatedAt: Date
}

export interface FinancialTransaction {
  id: string
  title: string
  description?: string
  amount: number
  type: TransactionType
  categoryId: string
  category?: FinancialCategory
  paymentMethod: PaymentMethod
  date: Date
  recurrence: RecurrenceType
  isRecurring: boolean
  tags: string[]
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface FinancialBudget {
  id: string
  categoryId: string
  category?: FinancialCategory
  month: number
  year: number
  budgetAmount: number
  spentAmount: number
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface FinancialAccount {
  id: string
  name: string
  type: 'CHECKING' | 'SAVINGS' | 'INVESTMENT' | 'CASH'
  balance: number
  currency: string
  bankName?: string
  isActive: boolean
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface FinancialStats {
  totalIncome: number
  totalExpenses: number
  netIncome: number
  monthlyIncome: number
  monthlyExpenses: number
  monthlyNet: number
  topExpenseCategories: Array<{
    categoryId: string
    categoryName: string
    amount: number
    percentage: number
  }>
  savingsRate: number
  budgetCompliance: number
  totalAssets: number
}

export interface DashboardStats {
  tasksCompleted: number
  tasksTotal: number
  upcomingEvents: number
  activeGoals: number
  notesCount: number
  productivityScore: number
  // Estatísticas financeiras opcionais
  financialData?: {
    totalAssets: number
    monthlyIncome: number
    monthlyExpenses: number
    monthlyNet: number
    savingsRate: number
  }
}

// Types for settings/preferences
export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  language: 'pt-BR' | 'en-US' | 'es-ES'
  notifications: boolean
  timezone: string
}

// View types for sidebar navigation
export type ViewType =
  | 'dashboard'
  | 'chat'
  | 'tasks'
  | 'notes'
  | 'goals'
  | 'calendar'
  | 'finances'
  | 'health'

// Chat types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
  functionCalls?: FunctionCall[]
}

export interface FunctionCall {
  name: string
  parameters: any
  result?: any
}
