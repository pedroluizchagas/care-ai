import { useEffect, useRef } from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
)

interface FinancialChartsProps {
  transactions: any[]
  categories: any[]
  monthlyData?: any[]
}

export default function FinancialCharts({
  transactions,
  categories,
  monthlyData = [],
}: FinancialChartsProps) {
  // Configurações gerais dos gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: '#E5E7EB',
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#E5E7EB',
        borderColor: 'rgba(59, 130, 246, 0.5)',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        bodyFont: {
          size: 13,
        },
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        callbacks: {
          label: function (context: any) {
            return `${context.label}: R$ ${context.parsed.toLocaleString(
              'pt-BR',
              {
                minimumFractionDigits: 2,
              }
            )}`
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11,
          },
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
      y: {
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 11,
          },
          callback: function (value: any) {
            return `R$ ${value.toLocaleString('pt-BR')}`
          },
        },
        grid: {
          color: 'rgba(75, 85, 99, 0.3)',
        },
      },
    },
  }

  // Processar dados para gráfico de categorias (Despesas)
  const expenseCategories = categories.filter((cat) => cat.type === 'EXPENSE')
  const expenseData = expenseCategories
    .map((category) => {
      const categoryTotal = transactions
        .filter((t) => t.categoryId === category.id && t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0)
      return {
        category: category.name,
        amount: categoryTotal,
        color: category.color,
        icon: category.icon,
      }
    })
    .filter((item) => item.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  // Gráfico de Despesas por Categoria (Doughnut)
  const expensesByCategory = {
    labels: expenseData.map((item) => `${item.icon} ${item.category}`),
    datasets: [
      {
        data: expenseData.map((item) => item.amount),
        backgroundColor: expenseData.map((item) => item.color + '80'),
        borderColor: expenseData.map((item) => item.color),
        borderWidth: 2,
        hoverBorderWidth: 3,
      },
    ],
  }

  // Processar dados mensais (últimos 6 meses)
  const getMonthlyData = () => {
    const months = []
    const income = []
    const expenses = []
    const currentDate = new Date()

    for (let i = 5; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1
      )
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' })
      const year = date.getFullYear()
      const month = date.getMonth()

      const monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date)
        return (
          transactionDate.getFullYear() === year &&
          transactionDate.getMonth() === month
        )
      })

      const monthIncome = monthTransactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + t.amount, 0)

      const monthExpenses = monthTransactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + t.amount, 0)

      months.push(monthName)
      income.push(monthIncome)
      expenses.push(monthExpenses)
    }

    return { months, income, expenses }
  }

  const monthlyFinancialData = getMonthlyData()

  // Gráfico de Receitas vs Despesas (Barras)
  const incomeVsExpenses = {
    labels: monthlyFinancialData.months,
    datasets: [
      {
        label: 'Receitas',
        data: monthlyFinancialData.income,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderColor: 'rgba(16, 185, 129, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'Despesas',
        data: monthlyFinancialData.expenses,
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 2,
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  // Gráfico de Tendência (Linha)
  const netIncomeData = monthlyFinancialData.months.map(
    (month, index) =>
      monthlyFinancialData.income[index] - monthlyFinancialData.expenses[index]
  )

  const trendData = {
    labels: monthlyFinancialData.months,
    datasets: [
      {
        label: 'Saldo Líquido',
        data: netIncomeData,
        borderColor: 'rgba(59, 130, 246, 1)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 3,
        pointBackgroundColor: 'rgba(59, 130, 246, 1)',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
        pointHoverRadius: 8,
        fill: true,
        tension: 0.4,
      },
    ],
  }

  const trendOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      tooltip: {
        ...chartOptions.plugins.tooltip,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y
            const isPositive = value >= 0
            return `${context.dataset.label}: ${
              isPositive ? '+' : ''
            }R$ ${value.toLocaleString('pt-BR', {
              minimumFractionDigits: 2,
            })}`
          },
        },
      },
    },
    scales: {
      x: chartOptions.scales.x,
      y: {
        ...chartOptions.scales.y,
        ticks: {
          ...chartOptions.scales.y.ticks,
          callback: function (value: any) {
            const isPositive = value >= 0
            return `${isPositive ? '+' : ''}R$ ${value.toLocaleString('pt-BR')}`
          },
        },
      },
    },
  }

  // Gráfico de Top Gastos (Barras horizontais)
  const topExpenses = expenseData.slice(0, 5)
  const topExpensesChart = {
    labels: topExpenses.map((item) => `${item.icon} ${item.category}`),
    datasets: [
      {
        label: 'Gastos',
        data: topExpenses.map((item) => item.amount),
        backgroundColor: topExpenses.map((item) => item.color + '80'),
        borderColor: topExpenses.map((item) => item.color),
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  }

  const topExpensesOptions = {
    ...chartOptions,
    indexAxis: 'y' as const,
    plugins: {
      ...chartOptions.plugins,
      legend: {
        display: false,
      },
    },
  }

  return (
    <div className="space-y-6">
      {/* Gráficos principais em grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Despesas por Categoria */}
        <div className="dark-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Despesas por Categoria
            </h3>
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse"></div>
          </div>
          {expenseData.length > 0 ? (
            <div className="h-64">
              <Doughnut data={expensesByCategory} options={chartOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📊</span>
                </div>
                <p className="text-white/60">Nenhuma despesa encontrada</p>
              </div>
            </div>
          )}
        </div>

        {/* Receitas vs Despesas */}
        <div className="dark-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Receitas vs Despesas
            </h3>
            <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
          </div>
          <div className="h-64">
            <Bar data={incomeVsExpenses} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Gráficos secundários */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tendência do Saldo */}
        <div className="dark-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">
              Tendência do Saldo
            </h3>
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          </div>
          <div className="h-64">
            <Line data={trendData} options={trendOptions} />
          </div>
        </div>

        {/* Top 5 Gastos */}
        <div className="dark-card rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-white">Maiores Gastos</h3>
            <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
          </div>
          {topExpenses.length > 0 ? (
            <div className="h-64">
              <Bar data={topExpensesChart} options={topExpensesOptions} />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💸</span>
                </div>
                <p className="text-white/60">Nenhum gasto encontrado</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Resumo dos gráficos */}
      <div className="dark-card rounded-3xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Insights Financeiros
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center">
                <span className="text-green-400 text-lg">📈</span>
              </div>
              <div>
                <p className="text-white/60 text-sm">Maior Receita</p>
                <p className="text-white font-semibold">
                  R${' '}
                  {Math.max(...monthlyFinancialData.income).toLocaleString(
                    'pt-BR',
                    { minimumFractionDigits: 2 }
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
                <span className="text-red-400 text-lg">📉</span>
              </div>
              <div>
                <p className="text-white/60 text-sm">Maior Despesa</p>
                <p className="text-white font-semibold">
                  R${' '}
                  {Math.max(...monthlyFinancialData.expenses).toLocaleString(
                    'pt-BR',
                    { minimumFractionDigits: 2 }
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
                <span className="text-blue-400 text-lg">💰</span>
              </div>
              <div>
                <p className="text-white/60 text-sm">Saldo Médio</p>
                <p className="text-white font-semibold">
                  R${' '}
                  {(
                    netIncomeData.reduce((a, b) => a + b, 0) /
                    netIncomeData.length
                  ).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
