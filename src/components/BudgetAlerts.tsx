import { useState, useEffect } from 'react'
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XMarkIcon,
  BellIcon,
  ChartBarIcon,
} from '@heroicons/react/24/outline'

interface BudgetAlert {
  id: string
  categoryName: string
  categoryIcon: string
  budgetAmount: number
  spentAmount: number
  percentage: number
  severity: 'success' | 'warning' | 'danger' | 'info'
  message: string
}

interface BudgetAlertsProps {
  transactions: any[]
  categories: any[]
  budgets: any[]
  userId: string
}

export default function BudgetAlerts({
  transactions,
  categories,
  budgets,
  userId,
}: BudgetAlertsProps) {
  const [alerts, setAlerts] = useState<BudgetAlert[]>([])
  const [showAlerts, setShowAlerts] = useState(true)
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([])

  useEffect(() => {
    generateBudgetAlerts()
  }, [transactions, categories, budgets])

  const generateBudgetAlerts = () => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()
    const newAlerts: BudgetAlert[] = []

    // Filtrar transações do mês atual
    const currentMonthTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date)
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear &&
        transaction.type === 'EXPENSE'
      )
    })

    // Verificar cada orçamento
    budgets.forEach((budget) => {
      // Calcular gastos da categoria no mês
      const categorySpent = currentMonthTransactions
        .filter((t) => t.categoryId === budget.categoryId)
        .reduce((sum, t) => sum + t.amount, 0)

      const percentage = (categorySpent / budget.budgetAmount) * 100
      const category = categories.find((c) => c.id === budget.categoryId)

      let severity: BudgetAlert['severity'] = 'success'
      let message = ''

      if (percentage >= 100) {
        severity = 'danger'
        message = `Orçamento estourado! Você gastou R$ ${(
          categorySpent - budget.budgetAmount
        ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })} a mais.`
      } else if (percentage >= 80) {
        severity = 'warning'
        message = `Atenção! Você já gastou ${percentage.toFixed(
          1
        )}% do orçamento.`
      } else if (percentage >= 50) {
        severity = 'info'
        message = `Você gastou ${percentage.toFixed(1)}% do orçamento este mês.`
      } else {
        severity = 'success'
        message = `Orçamento sob controle. ${percentage.toFixed(1)}% utilizado.`
      }

      const alert: BudgetAlert = {
        id: `${budget.id}-${currentMonth}-${currentYear}`,
        categoryName: category?.name || 'Categoria',
        categoryIcon: category?.icon || '💸',
        budgetAmount: budget.budgetAmount,
        spentAmount: categorySpent,
        percentage,
        severity,
        message,
      }

      newAlerts.push(alert)
    })

    // Ordenar por severidade (danger > warning > info > success)
    const severityOrder = { danger: 4, warning: 3, info: 2, success: 1 }
    newAlerts.sort(
      (a, b) => severityOrder[b.severity] - severityOrder[a.severity]
    )

    setAlerts(newAlerts)
  }

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts([...dismissedAlerts, alertId])
  }

  const getAlertColor = (severity: BudgetAlert['severity']) => {
    switch (severity) {
      case 'danger':
        return 'border-red-500/30 bg-red-500/10'
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10'
      case 'info':
        return 'border-blue-500/30 bg-blue-500/10'
      case 'success':
        return 'border-green-500/30 bg-green-500/10'
      default:
        return 'border-white/10 bg-white/5'
    }
  }

  const getAlertIcon = (severity: BudgetAlert['severity']) => {
    switch (severity) {
      case 'danger':
        return <ExclamationTriangleIcon className="w-5 h-5 text-red-400" />
      case 'warning':
        return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
      case 'info':
        return <BellIcon className="w-5 h-5 text-blue-400" />
      case 'success':
        return <CheckCircleIcon className="w-5 h-5 text-green-400" />
      default:
        return <ChartBarIcon className="w-5 h-5 text-white/60" />
    }
  }

  const getTextColor = (severity: BudgetAlert['severity']) => {
    switch (severity) {
      case 'danger':
        return 'text-red-300'
      case 'warning':
        return 'text-yellow-300'
      case 'info':
        return 'text-blue-300'
      case 'success':
        return 'text-green-300'
      default:
        return 'text-white'
    }
  }

  // Filtrar alertas não dispensados
  const visibleAlerts = alerts.filter(
    (alert) => !dismissedAlerts.includes(alert.id)
  )

  // Mostrar apenas alertas importantes (warning e danger) por padrão
  const importantAlerts = visibleAlerts.filter(
    (alert) => alert.severity === 'danger' || alert.severity === 'warning'
  )

  if (!showAlerts || visibleAlerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {/* Alertas Importantes */}
      {importantAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-semibold text-white flex items-center space-x-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />
              <span>Alertas de Orçamento</span>
            </h4>
            <button
              onClick={() => setShowAlerts(false)}
              className="text-white/60 hover:text-white/80 transition-colors"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>

          {importantAlerts.map((alert) => (
            <div
              key={alert.id}
              className={`border rounded-2xl p-4 ${getAlertColor(
                alert.severity
              )} transition-all duration-300`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                    <span className="text-lg">{alert.categoryIcon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      {getAlertIcon(alert.severity)}
                      <h5 className="text-white font-medium">
                        {alert.categoryName}
                      </h5>
                    </div>
                    <p className={`text-sm ${getTextColor(alert.severity)}`}>
                      {alert.message}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => dismissAlert(alert.id)}
                  className="ml-3 text-white/40 hover:text-white/80 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4" />
                </button>
              </div>

              {/* Barra de progresso */}
              <div className="mt-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-white/60">
                    R${' '}
                    {alert.spentAmount.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                  <span className="text-white/60">
                    R${' '}
                    {alert.budgetAmount.toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      alert.severity === 'danger'
                        ? 'bg-red-500'
                        : alert.severity === 'warning'
                        ? 'bg-yellow-500'
                        : alert.severity === 'info'
                        ? 'bg-blue-500'
                        : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(alert.percentage, 100)}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className={getTextColor(alert.severity)}>
                    {alert.percentage.toFixed(1)}% utilizado
                  </span>
                  {alert.percentage > 100 && (
                    <span className="text-red-400 font-medium">
                      {(alert.percentage - 100).toFixed(1)}% acima do orçamento
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Resumo geral se não houver alertas importantes */}
      {importantAlerts.length === 0 && visibleAlerts.length > 0 && (
        <div className="dark-card rounded-2xl p-4 border border-green-500/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
              <CheckCircleIcon className="w-6 h-6 text-green-400" />
            </div>
            <div>
              <h5 className="text-white font-medium">
                Orçamentos sob controle! 🎉
              </h5>
              <p className="text-green-300 text-sm">
                Todos os seus orçamentos estão dentro do limite planejado.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
