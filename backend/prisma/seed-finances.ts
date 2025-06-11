import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function createDefaultFinancialCategories() {
  console.log('🏦 Criando categorias financeiras padrão...')

  const userId = 'user_1' // ID padrão para testes

  // Categorias de RECEITA
  const incomeCategories = [
    {
      name: 'Salário',
      icon: '💼',
      color: '#10B981',
      type: 'INCOME',
      userId,
      isDefault: true,
    },
    {
      name: 'Freelance',
      icon: '💻',
      color: '#3B82F6',
      type: 'INCOME',
      userId,
      isDefault: true,
    },
    {
      name: 'Investimentos',
      icon: '📈',
      color: '#8B5CF6',
      type: 'INCOME',
      userId,
      isDefault: true,
    },
    {
      name: 'Rendas',
      icon: '🏘️',
      color: '#F59E0B',
      type: 'INCOME',
      userId,
      isDefault: true,
    },
    {
      name: 'Outros',
      icon: '💰',
      color: '#6B7280',
      type: 'INCOME',
      userId,
      isDefault: true,
    },
  ]

  // Categorias de DESPESA
  const expenseCategories = [
    {
      name: 'Moradia',
      icon: '🏠',
      color: '#EF4444',
      type: 'EXPENSE',
      userId,
      isDefault: true,
    },
    {
      name: 'Alimentação',
      icon: '🍽️',
      color: '#F59E0B',
      type: 'EXPENSE',
      userId,
      isDefault: true,
    },
    {
      name: 'Transporte',
      icon: '🚗',
      color: '#8B5CF6',
      type: 'EXPENSE',
      userId,
      isDefault: true,
    },
    {
      name: 'Saúde',
      icon: '🏥',
      color: '#10B981',
      type: 'EXPENSE',
      userId,
      isDefault: true,
    },
    {
      name: 'Educação',
      icon: '📚',
      color: '#3B82F6',
      type: 'EXPENSE',
      userId,
      isDefault: true,
    },
    {
      name: 'Lazer',
      icon: '🎬',
      color: '#EC4899',
      type: 'EXPENSE',
      userId,
      isDefault: true,
    },
    {
      name: 'Vestuário',
      icon: '👕',
      color: '#06B6D4',
      type: 'EXPENSE',
      userId,
      isDefault: true,
    },
    {
      name: 'Tecnologia',
      icon: '📱',
      color: '#6366F1',
      type: 'EXPENSE',
      userId,
      isDefault: true,
    },
    {
      name: 'Impostos',
      icon: '🏛️',
      color: '#DC2626',
      type: 'EXPENSE',
      userId,
      isDefault: true,
    },
    {
      name: 'Outros',
      icon: '💸',
      color: '#6B7280',
      type: 'EXPENSE',
      userId,
      isDefault: true,
    },
  ]

  // Criar categorias de receita
  for (const category of incomeCategories) {
    const existing = await prisma.financialCategory.findFirst({
      where: {
        name: category.name,
        type: category.type,
        userId: category.userId,
      },
    })

    if (!existing) {
      await prisma.financialCategory.create({
        data: category,
      })
      console.log(`✅ Categoria criada: ${category.name} (${category.type})`)
    } else {
      console.log(
        `⚠️  Categoria já existe: ${category.name} (${category.type})`
      )
    }
  }

  // Criar categorias de despesa
  for (const category of expenseCategories) {
    const existing = await prisma.financialCategory.findFirst({
      where: {
        name: category.name,
        type: category.type,
        userId: category.userId,
      },
    })

    if (!existing) {
      await prisma.financialCategory.create({
        data: category,
      })
      console.log(`✅ Categoria criada: ${category.name} (${category.type})`)
    } else {
      console.log(
        `⚠️  Categoria já existe: ${category.name} (${category.type})`
      )
    }
  }

  console.log('🎉 Categorias financeiras padrão criadas com sucesso!')
}

// FUNÇÃO REMOVIDA - NÃO QUEREMOS DADOS MOCK/EXEMPLO
// async function createSampleAccountsAndTransactions() { ... }

async function main() {
  try {
    await createDefaultFinancialCategories()
    console.log(
      '✅ Seed financeiro concluído - apenas categorias padrão criadas, sem dados fictícios!'
    )
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
