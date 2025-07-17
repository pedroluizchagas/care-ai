const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function createDefaultFinancialCategories() {
  console.log('🏦 Criando categorias financeiras padrão...')

  const userId = 'user_1' // ID padrão para testes

  // Criar usuário se não existir
  let user = await prisma.user.findUnique({
    where: { id: userId },
  })

  if (!user) {
    user = await prisma.user.create({
      data: {
        id: userId,
        email: 'user@test.com',
        name: 'Usuário Teste',
      },
    })
    console.log('✅ Usuário teste criado')
  }

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
      name: 'Lazer',
      icon: '🎬',
      color: '#EC4899',
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

  // Criar todas as categorias
  const allCategories = [...incomeCategories, ...expenseCategories]

  for (const category of allCategories) {
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

async function createSampleAccounts() {
  console.log('🏦 Criando contas de exemplo...')

  const userId = 'user_1'

  // Criar contas padrão
  const accounts = [
    {
      name: 'Conta Corrente',
      type: 'CHECKING',
      balance: 2500,
      currency: 'BRL',
      bankName: 'Banco do Brasil',
      isActive: true,
      userId,
    },
    {
      name: 'Poupança',
      type: 'SAVINGS',
      balance: 10000,
      currency: 'BRL',
      bankName: 'Banco do Brasil',
      isActive: true,
      userId,
    },
    {
      name: 'Carteira',
      type: 'CASH',
      balance: 150,
      currency: 'BRL',
      isActive: true,
      userId,
    },
  ]

  for (const account of accounts) {
    const existing = await prisma.financialAccount.findFirst({
      where: {
        name: account.name,
        userId: account.userId,
      },
    })

    if (!existing) {
      await prisma.financialAccount.create({
        data: account,
      })
      console.log(`✅ Conta criada: ${account.name}`)
    }
  }

  console.log('🎉 Contas de exemplo criadas!')
}

async function main() {
  try {
    await createDefaultFinancialCategories()
    await createSampleAccounts()
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
