import { type ClassValue, clsx } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Função auxiliar para validar e converter datas
export function ensureValidDate(
  date: Date | string | number | null | undefined
): Date {
  if (!date) return new Date()

  try {
    const validDate = new Date(date)
    if (isNaN(validDate.getTime())) {
      return new Date()
    }
    return validDate
  } catch {
    return new Date()
  }
}

export function formatDate(date: Date | string | number): string {
  try {
    const validDate = ensureValidDate(date)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(validDate)
  } catch (error) {
    return new Date().toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }
}

export function formatTime(date: Date | string | number): string {
  try {
    const validDate = ensureValidDate(date)
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(validDate)
  } catch (error) {
    return new Date().toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }
}

export function formatDateTime(date: Date | string | number): string {
  try {
    const validDate = ensureValidDate(date)
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(validDate)
  } catch (error) {
    return new Date().toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }
}

export function getRelativeTime(date: Date | string | number): string {
  try {
    const validDate = ensureValidDate(date)
    const now = new Date()
    const diffInSeconds = Math.floor(
      (now.getTime() - validDate.getTime()) / 1000
    )

    if (diffInSeconds < 60) {
      return 'Agora mesmo'
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60)
      return `${minutes} ${minutes === 1 ? 'minuto' : 'minutos'} atrás`
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600)
      return `${hours} ${hours === 1 ? 'hora' : 'horas'} atrás`
    } else {
      const days = Math.floor(diffInSeconds / 86400)
      return `${days} ${days === 1 ? 'dia' : 'dias'} atrás`
    }
  } catch (error) {
    return 'Data inválida'
  }
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'crítica':
      return 'priority-critical'
    case 'alta':
      return 'priority-high'
    case 'média':
      return 'priority-medium'
    case 'baixa':
      return 'priority-low'
    default:
      return 'bg-white/10 text-white/60 border border-white/20'
  }
}

export function getProgressColor(progress: number): string {
  if (progress >= 80) return 'text-green-400'
  if (progress >= 50) return 'text-yellow-400'
  if (progress >= 20) return 'text-orange-400'
  return 'text-red-400'
}

export function getPriorityIcon(priority: string): string {
  switch (priority) {
    case 'crítica':
      return '🔴'
    case 'alta':
      return '🟠'
    case 'média':
      return '🟡'
    case 'baixa':
      return '🟢'
    default:
      return '⚪'
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export function calculateProductivityScore(
  tasksCompleted: number,
  tasksTotal: number,
  goalsProgress: number[]
): number {
  const taskScore = tasksTotal > 0 ? (tasksCompleted / tasksTotal) * 50 : 0
  const goalScore =
    goalsProgress.length > 0
      ? (goalsProgress.reduce((sum, progress) => sum + progress, 0) /
          goalsProgress.length) *
        0.5
      : 0

  return Math.round(taskScore + goalScore)
}

export function getStatusColor(
  status: 'completed' | 'pending' | 'overdue'
): string {
  switch (status) {
    case 'completed':
      return 'bg-green-500/20 text-green-300 border border-green-500/30'
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
    case 'overdue':
      return 'bg-red-500/20 text-red-300 border border-red-500/30'
    default:
      return 'bg-white/10 text-white/60 border border-white/20'
  }
}

// Função para verificar se uma string é uma data válida
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString)
  return !isNaN(date.getTime())
}

// Função para formatar data no formato ISO (YYYY-MM-DD)
export function formatDateISO(date: Date | string | number): string {
  try {
    const validDate = ensureValidDate(date)
    return validDate.toISOString().split('T')[0]
  } catch (error) {
    return new Date().toISOString().split('T')[0]
  }
}

// Função para calcular dias entre duas datas
export function daysBetween(
  date1: Date | string,
  date2: Date | string
): number {
  try {
    const d1 = ensureValidDate(date1)
    const d2 = ensureValidDate(date2)
    const diffTime = Math.abs(d2.getTime() - d1.getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  } catch (error) {
    return 0
  }
}
