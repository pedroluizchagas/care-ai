'use client'

import { useState, useEffect } from 'react'
import {
  FinancialTransaction,
  FinancialCategory,
  FinancialBudget,
  FinancialAccount,
  FinancialStats,
  TransactionType,
  PaymentMethod,
} from '@/types'
import {
  PlusIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  BanknotesIcon,
  ChartPieIcon,
  CalendarIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CurrencyDollarIcon,
  WalletIcon,
  BuildingLibraryIcon,
  BanknotesIcon as PiggyBankIcon,
  ChartBarIcon,
  EyeIcon,
  EyeSlashIcon,
  MinusIcon,
  DocumentArrowDownIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline'
import FinancialCharts from './FinancialCharts'
import BudgetAlerts from './BudgetAlerts'

// Categorias padrão para criar automaticamente se não existirem
const defaultCategories: Omit<
  FinancialCategory,
  'id' | 'userId' | 'createdAt' | 'updatedAt'
>[] = [
  {
    name: 'Salário',
    icon: '💼',
    color: '#10B981',
    type: 'INCOME',
    isDefault: true,
  },
  {
    name: 'Freelance',
    icon: '💻',
    color: '#3B82F6',
    type: 'INCOME',
    isDefault: true,
  },
  {
    name: 'Investimentos',
    icon: '📈',
    color: '#8B5CF6',
    type: 'INCOME',
    isDefault: true,
  },
  {
    name: 'Alimentação',
    icon: '🍽️',
    color: '#F59E0B',
    type: 'EXPENSE',
    isDefault: true,
  },
  {
    name: 'Moradia',
    icon: '🏠',
    color: '#EF4444',
    type: 'EXPENSE',
    isDefault: true,
  },
  {
    name: 'Transporte',
    icon: '🚗',
    color: '#8B5CF6',
    type: 'EXPENSE',
    isDefault: true,
  },
  {
    name: 'Saúde',
    icon: '🏥',
    color: '#10B981',
    type: 'EXPENSE',
    isDefault: true,
  },
  {
    name: 'Educação',
    icon: '📚',
    color: '#3B82F6',
    type: 'EXPENSE',
    isDefault: true,
  },
  {
    name: 'Lazer',
    icon: '🎮',
    color: '#F59E0B',
    type: 'EXPENSE',
    isDefault: true,
  },
]

// Função helper para formatar moeda
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export default function Finances() {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'transactions' | 'budgets' | 'accounts'
  >('dashboard')
  const [transactions, setTransactions] = useState<FinancialTransaction[]>([])
  const [categories, setCategories] = useState<FinancialCategory[]>([])
  const [accounts, setAccounts] = useState<FinancialAccount[]>([])
  const [budgets, setBudgets] = useState<FinancialBudget[]>([])
  const [stats, setStats] = useState<FinancialStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showBalances, setShowBalances] = useState(true)
  const [privacyMode, setPrivacyMode] = useState(false)

  // Modais e formulários
  const [showTransactionModal, setShowTransactionModal] = useState(false)
  const [showAccountModal, setShowAccountModal] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [showCategoriesModal, setShowCategoriesModal] = useState(false)
  const [editingTransaction, setEditingTransaction] =
    useState<FinancialTransaction | null>(null)
  const [editingAccount, setEditingAccount] = useState<FinancialAccount | null>(
    null
  )

  // Filtros
  const [filterType, setFilterType] = useState<'ALL' | TransactionType>('ALL')
  const [filterCategory, setFilterCategory] = useState<string>('ALL')
  const [filterDateRange, setFilterDateRange] = useState<string>('month')
  const [searchTerm, setSearchTerm] = useState('')

  // Estados para os formulários específicos
  const [transactionType, setTransactionType] =
    useState<TransactionType>('EXPENSE')

  useEffect(() => {
    loadFinancialData()
  }, [])

  const loadFinancialData = async () => {
    setIsLoading(true)
    try {
      const userId = 'user_1' // TODO: Pegar do contexto de autenticação

      // Carregar dados reais das APIs
      const [transactionsRes, categoriesRes] = await Promise.all([
        fetch(`/api/finances/transactions?userId=${userId}`),
        fetch(`/api/finances/categories?userId=${userId}`),
      ])

      const transactionsData = await transactionsRes.json()
      const categoriesData = await categoriesRes.json()

      // Usar dados reais ou arrays vazios se não houver dados
      const realTransactions = transactionsData.transactions || []
      let realCategories = categoriesData.categories || []

      // Se não houver categorias, criar as categorias padrão automaticamente
      if (realCategories.length === 0) {
        console.log('📁 Criando categorias padrão...')
        try {
          for (const defaultCat of defaultCategories) {
            const response = await fetch('/api/finances/categories', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ ...defaultCat, userId }),
            })
            if (response.ok) {
              const result = await response.json()
              if (result.category) {
                realCategories.push(result.category)
              }
            }
          }
        } catch (error) {
          console.error('Erro ao criar categorias padrão:', error)
        }
      }

      setTransactions(realTransactions)
      setCategories(realCategories)
      setAccounts([]) // Por enquanto vazio até implementar API de contas
      setBudgets([]) // Por enquanto vazio até implementar API de orçamentos

      // Calcular estatísticas com dados reais
      calculateStats(realTransactions, [])
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error)
      // Em caso de erro, usar dados vazios
      setTransactions([])
      setCategories([])
      setAccounts([])
      setBudgets([])
      setStats({
        totalIncome: 0,
        totalExpenses: 0,
        netIncome: 0,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        monthlyNet: 0,
        topExpenseCategories: [],
        savingsRate: 0,
        budgetCompliance: 0,
        totalAssets: 0,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (
    currentTransactions: FinancialTransaction[],
    currentAccounts: FinancialAccount[]
  ) => {
    const currentMonth = new Date().getMonth()
    const currentYear = new Date().getFullYear()

    const monthlyTransactions = currentTransactions.filter((t) => {
      const transactionDate = new Date(t.date)
      return (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      )
    })

    const income = currentTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)

    const expenses = currentTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthlyIncome = monthlyTransactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0)

    const monthlyExpenses = monthlyTransactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0)

    const totalAssets = currentAccounts
      .filter((a) => a.isActive)
      .reduce((sum, a) => sum + a.balance, 0)

    // Calcular top categorias de gastos
    const expensesByCategory = new Map<string, number>()
    monthlyTransactions
      .filter((t) => t.type === 'EXPENSE')
      .forEach((t) => {
        const current = expensesByCategory.get(t.categoryId) || 0
        expensesByCategory.set(t.categoryId, current + t.amount)
      })

    const topExpenseCategories = Array.from(expensesByCategory.entries())
      .map(([categoryId, amount]) => {
        const category = categories.find((c) => c.id === categoryId)
        return {
          categoryId,
          categoryName: category?.name || 'Desconhecido',
          amount,
          percentage:
            monthlyExpenses > 0 ? (amount / monthlyExpenses) * 100 : 0,
        }
      })
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5)

    const newStats: FinancialStats = {
      totalIncome: income,
      totalExpenses: expenses,
      netIncome: income - expenses,
      monthlyIncome,
      monthlyExpenses,
      monthlyNet: monthlyIncome - monthlyExpenses,
      topExpenseCategories,
      savingsRate:
        monthlyIncome > 0
          ? ((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100
          : 0,
      budgetCompliance: 85, // TODO: Calcular baseado nos orçamentos
      totalAssets,
    }

    setStats(newStats)
  }

  const getTransactionIcon = (type: TransactionType) => {
    return type === 'INCOME' ? (
      <ArrowUpIcon className="w-5 h-5 text-green-400" />
    ) : (
      <ArrowDownIcon className="w-5 h-5 text-red-400" />
    )
  }

  const getPaymentMethodIcon = (method: PaymentMethod) => {
    switch (method) {
      case 'CREDIT':
        return <CreditCardIcon className="w-4 h-4" />
      case 'DEBIT':
        return <CreditCardIcon className="w-4 h-4" />
      case 'CASH':
        return <BanknotesIcon className="w-4 h-4" />
      case 'PIX':
        return <CurrencyDollarIcon className="w-4 h-4" />
      case 'TRANSFER':
        return <BuildingLibraryIcon className="w-4 h-4" />
      default:
        return <CurrencyDollarIcon className="w-4 h-4" />
    }
  }

  const getAccountTypeIcon = (type: string) => {
    switch (type) {
      case 'CHECKING':
        return <BuildingLibraryIcon className="w-6 h-6" />
      case 'SAVINGS':
        return <PiggyBankIcon className="w-6 h-6" />
      case 'INVESTMENT':
        return <ChartBarIcon className="w-6 h-6" />
      case 'CASH':
        return <WalletIcon className="w-6 h-6" />
      default:
        return <CurrencyDollarIcon className="w-6 h-6" />
    }
  }

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesType = filterType === 'ALL' || transaction.type === filterType
    const matchesCategory =
      filterCategory === 'ALL' || transaction.categoryId === filterCategory
    const matchesSearch =
      searchTerm === '' ||
      transaction.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesType && matchesCategory && matchesSearch
  })

  const handleNewIncome = () => {
    setTransactionType('INCOME')
    setEditingTransaction(null)
    setShowTransactionModal(true)
  }

  const handleNewExpense = () => {
    setTransactionType('EXPENSE')
    setEditingTransaction(null)
    setShowTransactionModal(true)
  }

  const handleExportData = () => {
    try {
      // Criar dados para exportação
      const exportData = {
        generated_at: new Date().toISOString(),
        period: `${new Date().getFullYear()}-${(new Date().getMonth() + 1)
          .toString()
          .padStart(2, '0')}`,
        summary: {
          total_income: stats?.monthlyIncome || 0,
          total_expenses: stats?.monthlyExpenses || 0,
          net_income: stats?.monthlyNet || 0,
          savings_rate: stats?.savingsRate || 0,
          total_transactions: filteredTransactions.length,
        },
        transactions: filteredTransactions.map((t) => ({
          date: new Date(t.date).toLocaleDateString('pt-BR'),
          title: t.title,
          amount: t.amount,
          type: t.type === 'INCOME' ? 'Receita' : 'Despesa',
          category:
            categories.find((c) => c.id === t.categoryId)?.name ||
            'Sem categoria',
          payment_method: t.paymentMethod,
          description: t.description || '',
        })),
        categories: categories.map((c) => ({
          name: c.name,
          type: c.type === 'INCOME' ? 'Receita' : 'Despesa',
          icon: c.icon,
        })),
      }

      // Criar e baixar arquivo JSON
      const dataStr = JSON.stringify(exportData, null, 2)
      const dataBlob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `financas_${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)

      // Notificação de sucesso
      alert('✅ Dados exportados com sucesso!')
    } catch (error) {
      console.error('Erro ao exportar dados:', error)
      alert('❌ Erro ao exportar dados')
    }
  }

  const handleOpenCategories = () => {
    setShowCategoriesModal(true)
  }

  if (isLoading) {
    return (
      <div className="h-full bg-gradient-main flex items-center justify-center">
        <div className="text-center">
          <CurrencyDollarIcon className="w-16 h-16 text-green-400 mx-auto mb-4 animate-pulse" />
          <p className="text-white text-lg">Carregando finanças...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full bg-gradient-main overflow-auto">
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-glow-green">
              <CurrencyDollarIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Gestão Financeira
              </h1>
              <p className="text-white/60 text-sm">
                Controle suas receitas e despesas
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowBalances(!showBalances)}
              className="icon-btn"
              title={showBalances ? 'Ocultar valores' : 'Mostrar valores'}
            >
              {showBalances ? (
                <EyeIcon className="w-5 h-5 text-white" />
              ) : (
                <EyeSlashIcon className="w-5 h-5 text-white" />
              )}
            </button>
            <button
              onClick={() => setShowTransactionModal(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Nova Transação</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 glass-card rounded-2xl p-1 mb-6">
          {[
            { key: 'dashboard', label: 'Dashboard', icon: ChartPieIcon },
            {
              key: 'transactions',
              label: 'Transações',
              icon: CurrencyDollarIcon,
            },
            { key: 'budgets', label: 'Orçamentos', icon: ChartBarIcon },
            { key: 'accounts', label: 'Contas', icon: BuildingLibraryIcon },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white/10 text-white shadow-glow-blue'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && stats && (
          <div className="space-y-6">
            {/* Budget Alerts - só mostra se houver dados */}
            {transactions.length > 0 &&
              categories.length > 0 &&
              budgets.length > 0 && (
                <BudgetAlerts
                  transactions={transactions}
                  categories={categories}
                  budgets={budgets}
                  userId="user_1"
                />
              )}

            {/* Financial Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">
                      Patrimônio Total
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        !showBalances ? 'blur-sm' : ''
                      } text-white`}
                    >
                      R${' '}
                      {stats.totalAssets.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                    <ChartBarIcon className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-2">
                  {stats.totalAssets > 0 ? (
                    <>
                      <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">
                        Ativo
                      </span>
                    </>
                  ) : (
                    <span className="text-white/60 text-sm">Sem dados</span>
                  )}
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">
                      Receita Mensal
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        !showBalances ? 'blur-sm' : ''
                      } text-white`}
                    >
                      R${' '}
                      {stats.monthlyIncome.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-green-500/20 flex items-center justify-center">
                    <ArrowTrendingUpIcon className="w-6 h-6 text-green-400" />
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-2">
                  {stats.monthlyIncome > 0 ? (
                    <>
                      <ArrowTrendingUpIcon className="w-4 h-4 text-green-400" />
                      <span className="text-green-400 text-sm font-medium">
                        Este mês
                      </span>
                    </>
                  ) : (
                    <span className="text-white/60 text-sm">Sem receitas</span>
                  )}
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">
                      Gastos Mensais
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        !showBalances ? 'blur-sm' : ''
                      } text-white`}
                    >
                      R${' '}
                      {stats.monthlyExpenses.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center">
                    <ArrowTrendingDownIcon className="w-6 h-6 text-red-400" />
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-2">
                  {stats.monthlyExpenses > 0 ? (
                    <>
                      <ArrowTrendingDownIcon className="w-4 h-4 text-red-400" />
                      <span className="text-red-400 text-sm font-medium">
                        Este mês
                      </span>
                    </>
                  ) : (
                    <span className="text-white/60 text-sm">Sem gastos</span>
                  )}
                </div>
              </div>

              <div className="stat-card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/60 text-sm font-medium">
                      Saldo Líquido
                    </p>
                    <p
                      className={`text-2xl font-bold ${
                        !showBalances ? 'blur-sm' : ''
                      } ${
                        stats.monthlyNet >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    >
                      {stats.monthlyNet >= 0 ? '+' : ''}R${' '}
                      {stats.monthlyNet.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                  <div
                    className={`w-12 h-12 rounded-2xl ${
                      stats.monthlyNet >= 0
                        ? 'bg-green-500/20'
                        : 'bg-red-500/20'
                    } flex items-center justify-center`}
                  >
                    <CurrencyDollarIcon
                      className={`w-6 h-6 ${
                        stats.monthlyNet >= 0
                          ? 'text-green-400'
                          : 'text-red-400'
                      }`}
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center space-x-2">
                  <span className="text-white/60 text-sm">
                    Taxa de poupança:
                  </span>
                  <span className="text-blue-400 text-sm font-medium">
                    {stats.savingsRate.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Analytics Section with Charts */}
            <div className="dark-card rounded-3xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white">
                    Analytics Financeiros
                  </h3>
                  <p className="text-white/60 text-sm mt-1">
                    Análise detalhada dos seus dados financeiros
                  </p>
                </div>
                {transactions.length > 0 && (
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <span className="text-white/60 text-sm">
                      {transactions.length} transação(ões)
                    </span>
                  </div>
                )}
              </div>

              {transactions.length > 0 && categories.length > 0 ? (
                <FinancialCharts
                  transactions={transactions}
                  categories={categories}
                />
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <ChartBarIcon className="w-10 h-10 text-white/30" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Nenhum dado para análise
                  </h4>
                  <p className="text-white/60 max-w-md mx-auto">
                    Adicione algumas transações para ver gráficos e análises
                    detalhadas dos seus dados financeiros.
                  </p>
                  <button
                    onClick={() => setShowTransactionModal(true)}
                    className="btn-primary mt-4"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Adicionar Primeira Transação
                  </button>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button
                onClick={handleNewIncome}
                className="glass-card rounded-2xl p-4 hover:scale-105 transition-all duration-200 text-left"
              >
                <PlusIcon className="w-8 h-8 text-green-400 mb-2" />
                <h4 className="text-white font-medium mb-1">Nova Receita</h4>
                <p className="text-white/60 text-sm">Adicionar entrada</p>
              </button>

              <button
                onClick={handleNewExpense}
                className="glass-card rounded-2xl p-4 hover:scale-105 transition-all duration-200 text-left"
              >
                <MinusIcon className="w-8 h-8 text-red-400 mb-2" />
                <h4 className="text-white font-medium mb-1">Nova Despesa</h4>
                <p className="text-white/60 text-sm">Registrar gasto</p>
              </button>

              <button
                onClick={handleExportData}
                className="glass-card rounded-2xl p-4 hover:scale-105 transition-all duration-200 text-left"
              >
                <DocumentArrowDownIcon className="w-8 h-8 text-blue-400 mb-2" />
                <h4 className="text-white font-medium mb-1">Exportar</h4>
                <p className="text-white/60 text-sm">Relatório JSON</p>
              </button>

              <button
                onClick={handleOpenCategories}
                className="glass-card rounded-2xl p-4 hover:scale-105 transition-all duration-200 text-left"
              >
                <Cog6ToothIcon className="w-8 h-8 text-purple-400 mb-2" />
                <h4 className="text-white font-medium mb-1">Configurar</h4>
                <p className="text-white/60 text-sm">Categorias</p>
              </button>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="dark-card rounded-3xl p-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Buscar transações..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
                    />
                  </div>
                </div>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as any)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="ALL">Todas</option>
                  <option value="INCOME">Receitas</option>
                  <option value="EXPENSE">Despesas</option>
                </select>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400"
                >
                  <option value="ALL">Todas categorias</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.icon} {category.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Transactions List */}
            <div className="dark-card rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-semibold text-white">
                  Transações ({filteredTransactions.length})
                </h3>
              </div>
              <div className="divide-y divide-white/5">
                {filteredTransactions.length === 0 ? (
                  <div className="p-8 text-center">
                    <CurrencyDollarIcon className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/60">
                      Nenhuma transação encontrada
                    </p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="p-6 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            transaction.type === 'INCOME'
                              ? 'bg-green-500/20'
                              : 'bg-red-500/20'
                          }`}
                        >
                          <span className="text-xl">
                            {transaction.category?.icon || '💰'}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-white font-medium">
                              {transaction.title}
                            </h4>
                            <p
                              className={`text-lg font-semibold ${
                                transaction.type === 'INCOME'
                                  ? 'text-green-400'
                                  : 'text-red-400'
                              }`}
                            >
                              {transaction.type === 'INCOME' ? '+' : '-'}
                              {showBalances
                                ? formatCurrency(transaction.amount)
                                : '••••••'}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3 text-white/60 text-sm">
                              <span>{transaction.category?.name}</span>
                              <span>•</span>
                              <div className="flex items-center space-x-1">
                                {getPaymentMethodIcon(
                                  transaction.paymentMethod
                                )}
                                <span>{transaction.paymentMethod}</span>
                              </div>
                              <span>•</span>
                              <span>
                                {new Date(transaction.date).toLocaleDateString(
                                  'pt-BR'
                                )}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => {
                                  setEditingTransaction(transaction)
                                  setShowTransactionModal(true)
                                }}
                                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors">
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Accounts Tab */}
        {activeTab === 'accounts' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">
                Minhas Contas ({accounts.filter((a) => a.isActive).length})
              </h3>
              <button
                onClick={() => setShowAccountModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Nova Conta</span>
              </button>
            </div>

            {accounts.filter((account) => account.isActive).length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accounts
                  .filter((account) => account.isActive)
                  .map((account) => (
                    <div key={account.id} className="dark-card rounded-3xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                              account.type === 'CHECKING'
                                ? 'bg-blue-500/20'
                                : account.type === 'SAVINGS'
                                ? 'bg-green-500/20'
                                : account.type === 'INVESTMENT'
                                ? 'bg-purple-500/20'
                                : 'bg-yellow-500/20'
                            }`}
                          >
                            {getAccountTypeIcon(account.type)}
                          </div>
                          <div>
                            <h4 className="text-white font-medium">
                              {account.name}
                            </h4>
                            <p className="text-white/60 text-sm">
                              {account.bankName || account.type}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setEditingAccount(account)
                            setShowAccountModal(true)
                          }}
                          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="border-t border-white/10 pt-4">
                        <p className="text-white/60 text-sm mb-1">
                          Saldo Atual
                        </p>
                        <p className="text-2xl font-bold text-white">
                          {showBalances
                            ? formatCurrency(account.balance)
                            : '••••••'}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            ) : (
              <div className="dark-card rounded-3xl p-8">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 flex items-center justify-center mx-auto mb-6">
                    <BuildingLibraryIcon className="w-10 h-10 text-white/30" />
                  </div>
                  <h4 className="text-lg font-semibold text-white mb-2">
                    Nenhuma conta cadastrada
                  </h4>
                  <p className="text-white/60 max-w-md mx-auto mb-6">
                    Adicione suas contas bancárias, carteira e investimentos
                    para ter controle total do seu patrimônio.
                  </p>
                  <button
                    onClick={() => setShowAccountModal(true)}
                    className="btn-primary"
                  >
                    <PlusIcon className="w-4 h-4 mr-2" />
                    Adicionar Primeira Conta
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Budgets Tab */}
        {activeTab === 'budgets' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-white">
                Orçamentos Mensais
              </h3>
              <button
                onClick={() => setShowBudgetModal(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <PlusIcon className="w-4 h-4" />
                <span>Novo Orçamento</span>
              </button>
            </div>

            <div className="dark-card rounded-3xl p-6">
              <p className="text-center text-white/60 py-8">
                Funcionalidade de orçamentos em desenvolvimento...
              </p>
            </div>
          </div>
        )}

        {/* Modal Nova Transação */}
        {showTransactionModal && (
          <div className="modal-overlay">
            <div className="modal-content max-w-2xl">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white">
                  {editingTransaction ? 'Editar' : 'Nova'} Transação
                </h2>
                <button
                  onClick={() => {
                    setEditingTransaction(null)
                    setShowTransactionModal(false)
                  }}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <TransactionForm
                  editingTransaction={editingTransaction}
                  categories={categories}
                  defaultType={transactionType}
                  onSave={(data) => {
                    console.log('Salvando transação:', data)
                    // TODO: Implementar salvamento via API
                    setEditingTransaction(null)
                    setShowTransactionModal(false)
                  }}
                  onCancel={() => {
                    setEditingTransaction(null)
                    setShowTransactionModal(false)
                  }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Modal Nova Conta */}
        {showAccountModal && (
          <div className="modal-overlay">
            <div className="modal-content max-w-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">
                  {editingAccount ? 'Editar Conta' : 'Nova Conta'}
                </h2>
                <button
                  onClick={() => {
                    setShowAccountModal(false)
                    setEditingAccount(null)
                  }}
                  className="icon-btn"
                >
                  <XMarkIcon className="w-5 h-5 text-white" />
                </button>
              </div>

              <AccountForm
                editingAccount={editingAccount}
                onSave={(accountData) => {
                  // TODO: Implementar salvamento via API
                  console.log('Salvar conta:', accountData)
                  setShowAccountModal(false)
                  setEditingAccount(null)
                  // Recarregar dados
                  loadFinancialData()
                }}
                onCancel={() => {
                  setShowAccountModal(false)
                  setEditingAccount(null)
                }}
              />
            </div>
          </div>
        )}

        {/* Modal de Categorias */}
        {showCategoriesModal && (
          <div className="modal-overlay">
            <div className="modal-content max-w-4xl">
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <h2 className="text-xl font-semibold text-white flex items-center space-x-2">
                  <Cog6ToothIcon className="w-6 h-6 text-purple-400" />
                  <span>Gerenciar Categorias</span>
                </h2>
                <button
                  onClick={() => setShowCategoriesModal(false)}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Categorias de Receitas */}
                  <div>
                    <h3 className="text-lg font-medium text-green-400 mb-4 flex items-center space-x-2">
                      <ArrowUpIcon className="w-5 h-5" />
                      <span>Receitas</span>
                    </h3>
                    <div className="space-y-2">
                      {categories
                        .filter((c) => c.type === 'INCOME')
                        .map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-xl">{category.icon}</span>
                              <span className="text-white">
                                {category.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-1 rounded text-blue-400 hover:bg-blue-400/20">
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button className="p-1 rounded text-red-400 hover:bg-red-400/20">
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Categorias de Despesas */}
                  <div>
                    <h3 className="text-lg font-medium text-red-400 mb-4 flex items-center space-x-2">
                      <ArrowDownIcon className="w-5 h-5" />
                      <span>Despesas</span>
                    </h3>
                    <div className="space-y-2">
                      {categories
                        .filter((c) => c.type === 'EXPENSE')
                        .map((category) => (
                          <div
                            key={category.id}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <div className="flex items-center space-x-3">
                              <span className="text-xl">{category.icon}</span>
                              <span className="text-white">
                                {category.name}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <button className="p-1 rounded text-blue-400 hover:bg-blue-400/20">
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button className="p-1 rounded text-red-400 hover:bg-red-400/20">
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={() => setShowCategoriesModal(false)}
                    className="btn-primary"
                  >
                    Fechar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente do formulário de transação
interface TransactionFormProps {
  editingTransaction: FinancialTransaction | null
  categories: FinancialCategory[]
  onSave: (data: any) => void
  onCancel: () => void
  defaultType?: TransactionType
}

function TransactionForm({
  editingTransaction,
  categories,
  onSave,
  onCancel,
  defaultType = 'EXPENSE',
}: TransactionFormProps) {
  const [formData, setFormData] = useState({
    title: editingTransaction?.title || '',
    description: editingTransaction?.description || '',
    amount: editingTransaction?.amount || 0,
    type: editingTransaction?.type || defaultType,
    categoryId: editingTransaction?.categoryId || '',
    paymentMethod: editingTransaction?.paymentMethod || 'CASH',
    date: editingTransaction
      ? new Date(editingTransaction.date).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title || !formData.amount || !formData.categoryId) {
      alert('Por favor, preencha todos os campos obrigatórios')
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/finances/transactions', {
        method: editingTransaction ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount.toString()),
          userId: 'user_1', // TODO: Pegar do contexto de autenticação
          ...(editingTransaction && { id: editingTransaction.id }),
        }),
      })

      const result = await response.json()

      if (result.success) {
        onSave(result.transaction)
      } else {
        alert(`Erro ao salvar transação: ${result.error}`)
      }
    } catch (error) {
      console.error('Erro ao salvar transação:', error)
      alert('Erro interno do servidor')
    } finally {
      setIsLoading(false)
    }
  }

  const expenseCategories = categories.filter((c) => c.type === 'EXPENSE')
  const incomeCategories = categories.filter((c) => c.type === 'INCOME')
  const availableCategories =
    formData.type === 'EXPENSE' ? expenseCategories : incomeCategories

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de Transação */}
      <div>
        <label className="block text-white/80 text-sm font-medium mb-3">
          Tipo
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, type: 'EXPENSE', categoryId: '' })
            }
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              formData.type === 'EXPENSE'
                ? 'border-red-500/50 bg-red-500/20 text-red-400'
                : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
            }`}
          >
            <ArrowDownIcon className="w-6 h-6 mx-auto mb-2" />
            <span className="font-medium">Despesa</span>
          </button>
          <button
            type="button"
            onClick={() =>
              setFormData({ ...formData, type: 'INCOME', categoryId: '' })
            }
            className={`p-4 rounded-xl border-2 transition-all duration-200 ${
              formData.type === 'INCOME'
                ? 'border-green-500/50 bg-green-500/20 text-green-400'
                : 'border-white/10 bg-white/5 text-white/60 hover:border-white/20'
            }`}
          >
            <ArrowUpIcon className="w-6 h-6 mx-auto mb-2" />
            <span className="font-medium">Receita</span>
          </button>
        </div>
      </div>

      {/* Título */}
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Título *
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="input-dark w-full"
          placeholder="Ex: Supermercado, Salário, etc."
          required
        />
      </div>

      {/* Valor */}
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Valor (R$) *
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) =>
            setFormData({
              ...formData,
              amount: parseFloat(e.target.value) || 0,
            })
          }
          className="input-dark w-full"
          placeholder="0,00"
          required
        />
      </div>

      {/* Categoria */}
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Categoria *
        </label>
        <select
          value={formData.categoryId}
          onChange={(e) =>
            setFormData({ ...formData, categoryId: e.target.value })
          }
          className="input-dark w-full"
          required
        >
          <option value="">Selecione uma categoria</option>
          {availableCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.icon} {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Método de Pagamento */}
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Método de Pagamento
        </label>
        <select
          value={formData.paymentMethod}
          onChange={(e) =>
            setFormData({
              ...formData,
              paymentMethod: e.target.value as PaymentMethod,
            })
          }
          className="input-dark w-full"
        >
          <option value="CASH">💵 Dinheiro</option>
          <option value="DEBIT">💳 Cartão de Débito</option>
          <option value="CREDIT">💳 Cartão de Crédito</option>
          <option value="PIX">📱 PIX</option>
          <option value="TRANSFER">🏦 Transferência</option>
        </select>
      </div>

      {/* Data */}
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Data
        </label>
        <input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          className="input-dark w-full"
        />
      </div>

      {/* Descrição */}
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
          placeholder="Observações adicionais..."
        />
      </div>

      {/* Botões */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-ghost flex-1"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary flex-1 flex items-center justify-center space-x-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <CheckIcon className="w-4 h-4" />
              <span>
                {editingTransaction ? 'Atualizar' : 'Criar'} Transação
              </span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}

// Componente do formulário de conta
interface AccountFormProps {
  editingAccount: FinancialAccount | null
  onSave: (data: any) => void
  onCancel: () => void
}

function AccountForm({ editingAccount, onSave, onCancel }: AccountFormProps) {
  const [formData, setFormData] = useState({
    name: editingAccount?.name || '',
    type: editingAccount?.type || ('CHECKING' as const),
    balance: editingAccount?.balance || 0,
    bankName: editingAccount?.bankName || '',
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      alert('Por favor, preencha o nome da conta')
      return
    }

    setIsLoading(true)
    try {
      // TODO: Implementar API de contas
      console.log('Dados da conta:', formData)
      onSave(formData)
    } catch (error) {
      console.error('Erro ao salvar conta:', error)
      alert('Erro interno do servidor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Nome da Conta */}
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Nome da Conta *
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="input-dark w-full"
          placeholder="Ex: Conta Corrente, Poupança, etc."
          required
        />
      </div>

      {/* Tipo da Conta */}
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Tipo da Conta
        </label>
        <select
          value={formData.type}
          onChange={(e) =>
            setFormData({
              ...formData,
              type: e.target.value as
                | 'CHECKING'
                | 'SAVINGS'
                | 'INVESTMENT'
                | 'CASH',
            })
          }
          className="input-dark w-full"
        >
          <option value="CHECKING">🏦 Conta Corrente</option>
          <option value="SAVINGS">🐷 Poupança</option>
          <option value="INVESTMENT">📈 Investimentos</option>
          <option value="CASH">💵 Dinheiro</option>
        </select>
      </div>

      {/* Saldo Inicial */}
      <div>
        <label className="block text-white/80 text-sm font-medium mb-2">
          Saldo Inicial (R$)
        </label>
        <input
          type="number"
          step="0.01"
          value={formData.balance}
          onChange={(e) =>
            setFormData({
              ...formData,
              balance: parseFloat(e.target.value) || 0,
            })
          }
          className="input-dark w-full"
          placeholder="0,00"
        />
      </div>

      {/* Nome do Banco */}
      {formData.type !== 'CASH' && (
        <div>
          <label className="block text-white/80 text-sm font-medium mb-2">
            Nome do Banco
          </label>
          <input
            type="text"
            value={formData.bankName}
            onChange={(e) =>
              setFormData({ ...formData, bankName: e.target.value })
            }
            className="input-dark w-full"
            placeholder="Ex: Banco do Brasil, Nubank, etc."
          />
        </div>
      )}

      {/* Botões */}
      <div className="flex space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="btn-ghost flex-1"
          disabled={isLoading}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="btn-primary flex-1 flex items-center justify-center space-x-2"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Salvando...</span>
            </>
          ) : (
            <>
              <CheckIcon className="w-4 h-4" />
              <span>{editingAccount ? 'Atualizar' : 'Criar'} Conta</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
