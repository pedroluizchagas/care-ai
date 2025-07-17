import prisma from './database'

// Definições das funções disponíveis para o agente
export const agentFunctions = [
  {
    name: 'create_task',
    description: 'Criar uma nova tarefa para o usuário',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Título da tarefa',
        },
        description: {
          type: 'string',
          description: 'Descrição detalhada da tarefa',
        },
        priority: {
          type: 'string',
          enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
          description: 'Prioridade da tarefa',
        },
        category: {
          type: 'string',
          description: 'Categoria da tarefa (ex: Trabalho, Pessoal, Estudos)',
        },
        dueDate: {
          type: 'string',
          description: 'Data de vencimento no formato ISO (opcional)',
        },
      },
      required: ['title'],
    },
  },
  {
    name: 'create_note',
    description: 'Criar uma nova nota para o usuário',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Título da nota',
        },
        content: {
          type: 'string',
          description: 'Conteúdo da nota',
        },
        category: {
          type: 'string',
          description: 'Categoria da nota (ex: Ideias, Receitas, Trabalho)',
        },
        tags: {
          type: 'string',
          description: 'Tags separadas por vírgula para organizar a nota',
        },
      },
      required: ['title', 'content'],
    },
  },
  {
    name: 'create_goal',
    description: 'Criar uma nova meta para o usuário',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Título da meta',
        },
        description: {
          type: 'string',
          description: 'Descrição da meta',
        },
        target: {
          type: 'number',
          description: 'Valor alvo da meta',
        },
        category: {
          type: 'string',
          description: 'Categoria da meta (ex: Saúde, Educação, Carreira)',
        },
        deadline: {
          type: 'string',
          description: 'Prazo para alcançar a meta no formato ISO (opcional)',
        },
      },
      required: ['title', 'target'],
    },
  },
  {
    name: 'list_tasks',
    description: 'Listar tarefas do usuário com filtros opcionais',
    parameters: {
      type: 'object',
      properties: {
        completed: {
          type: 'boolean',
          description: 'Filtrar por tarefas concluídas ou pendentes',
        },
        priority: {
          type: 'string',
          enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
          description: 'Filtrar por prioridade',
        },
        limit: {
          type: 'number',
          description: 'Limite de tarefas a retornar (padrão: 10)',
        },
      },
    },
  },
  {
    name: 'complete_task',
    description: 'Marcar uma tarefa como concluída',
    parameters: {
      type: 'object',
      properties: {
        taskId: {
          type: 'string',
          description: 'ID da tarefa a ser marcada como concluída',
        },
      },
      required: ['taskId'],
    },
  },
  {
    name: 'update_goal_progress',
    description: 'Atualizar o progresso de uma meta',
    parameters: {
      type: 'object',
      properties: {
        goalId: {
          type: 'string',
          description: 'ID da meta',
        },
        current: {
          type: 'number',
          description: 'Novo valor atual da meta',
        },
      },
      required: ['goalId', 'current'],
    },
  },
  {
    name: 'create_event',
    description: 'Agendar um novo evento/compromisso para o usuário',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Título do evento/compromisso',
        },
        description: {
          type: 'string',
          description: 'Descrição do evento',
        },
        location: {
          type: 'string',
          description: 'Local do evento (escritório, endereço, online, etc.)',
        },
        category: {
          type: 'string',
          description:
            'Categoria do evento (Reunião, Consulta, Evento, Pessoal)',
        },
        startDate: {
          type: 'string',
          description:
            'Data e hora de início no formato ISO (ex: 2024-01-20T14:30:00)',
        },
        endDate: {
          type: 'string',
          description: 'Data e hora de fim no formato ISO (opcional)',
        },
        allDay: {
          type: 'boolean',
          description: 'Se é um evento de dia inteiro',
        },
        priority: {
          type: 'string',
          enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
          description: 'Prioridade do evento',
        },
        reminder: {
          type: 'string',
          enum: ['15min', '30min', '1hour', '1day'],
          description: 'Lembrete antes do evento',
        },
        attendees: {
          type: 'string',
          description: 'Participantes separados por vírgula',
        },
      },
      required: ['title', 'startDate'],
    },
  },
  {
    name: 'create_financial_transaction',
    description: 'Registrar uma nova transação financeira (receita ou despesa)',
    parameters: {
      type: 'object',
      properties: {
        title: {
          type: 'string',
          description: 'Título da transação (ex: Supermercado, Salário)',
        },
        description: {
          type: 'string',
          description: 'Descrição detalhada da transação',
        },
        amount: {
          type: 'number',
          description: 'Valor da transação',
        },
        type: {
          type: 'string',
          enum: ['INCOME', 'EXPENSE'],
          description:
            'Tipo da transação - INCOME para receitas, EXPENSE para despesas',
        },
        categoryName: {
          type: 'string',
          description:
            'Nome da categoria (será criada automaticamente se não existir)',
        },
        paymentMethod: {
          type: 'string',
          enum: ['CASH', 'DEBIT', 'CREDIT', 'PIX', 'TRANSFER'],
          description: 'Método de pagamento',
        },
        date: {
          type: 'string',
          description:
            'Data da transação no formato ISO (opcional, usa hoje se não informado)',
        },
        tags: {
          type: 'array',
          items: { type: 'string' },
          description: 'Tags para organizar a transação',
        },
      },
      required: ['title', 'amount', 'type', 'categoryName'],
    },
  },
  {
    name: 'create_financial_category',
    description:
      'Criar uma nova categoria financeira para organizar receitas ou despesas',
    parameters: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description:
            'Nome da categoria (ex: Alimentação, Salário, Transporte)',
        },
        type: {
          type: 'string',
          enum: ['INCOME', 'EXPENSE'],
          description:
            'Tipo da categoria - INCOME para receitas, EXPENSE para despesas',
        },
        icon: {
          type: 'string',
          description: 'Emoji representativo da categoria (ex: 🍔, 💰, 🚗)',
        },
        color: {
          type: 'string',
          description: 'Cor hexadecimal da categoria (ex: #FF5733)',
        },
      },
      required: ['name', 'type'],
    },
  },
]

// Implementações das funções
export async function executeFunction(
  functionName: string,
  parameters: any,
  userId: string
) {
  console.log('🚀 Executando função:', functionName)
  console.log('📋 Parâmetros:', parameters)
  console.log('👤 User ID:', userId)

  try {
    switch (functionName) {
      case 'create_task':
        return await createTask(parameters, userId)

      case 'create_note':
        return await createNote(parameters, userId)

      case 'create_goal':
        return await createGoal(parameters, userId)

      case 'list_tasks':
        return await listTasks(parameters, userId)

      case 'complete_task':
        return await completeTask(parameters, userId)

      case 'update_goal_progress':
        return await updateGoalProgress(parameters, userId)

      case 'create_event':
        return await createEvent(parameters, userId)

      case 'create_financial_transaction':
        return await createFinancialTransaction(parameters, userId)

      case 'create_financial_category':
        return await createFinancialCategory(parameters, userId)

      default:
        throw new Error(`Função desconhecida: ${functionName}`)
    }
  } catch (error) {
    console.error(`❌ Erro ao executar função ${functionName}:`, error)
    throw error
  }
}

// Implementação: Criar tarefa
async function createTask(params: any, userId: string) {
  console.log('✅ Iniciando criação de tarefa...')
  console.log('📝 Dados da tarefa:', {
    title: params.title,
    description: params.description,
    priority: params.priority || 'MEDIUM',
    category: params.category || 'Geral',
    userId,
  })

  try {
    const task = await prisma.task.create({
      data: {
        title: params.title,
        description: params.description,
        priority: params.priority || 'MEDIUM',
        category: params.category || 'Geral',
        dueDate: params.dueDate ? new Date(params.dueDate) : null,
        userId,
      },
    })

    console.log('✅ Tarefa criada com sucesso!', task)

    return {
      success: true,
      message: `✅ Tarefa "${task.title}" criada com sucesso!`,
      data: task,
    }
  } catch (error) {
    console.error('❌ Erro ao criar tarefa:', error)
    throw error
  }
}

// Implementação: Criar nota
async function createNote(params: any, userId: string) {
  console.log('📝 Iniciando criação de nota...')

  try {
    const note = await prisma.note.create({
      data: {
        title: params.title,
        content: params.content,
        category: params.category || 'Geral',
        tags: params.tags || '',
        userId,
      },
    })

    console.log('✅ Nota criada com sucesso!', note)

    return {
      success: true,
      message: `📝 Nota "${note.title}" salva com sucesso!`,
      data: note,
    }
  } catch (error) {
    console.error('❌ Erro ao criar nota:', error)
    throw error
  }
}

// Implementação: Criar meta
async function createGoal(params: any, userId: string) {
  console.log('🎯 Iniciando criação de meta...')

  try {
    const goal = await prisma.goal.create({
      data: {
        title: params.title,
        description: params.description,
        target: params.target,
        current: 0,
        category: params.category || 'Pessoal',
        deadline: params.deadline ? new Date(params.deadline) : null,
        userId,
      },
    })

    console.log('✅ Meta criada com sucesso!', goal)

    return {
      success: true,
      message: `🎯 Meta "${goal.title}" criada! Progresso: 0/${goal.target}`,
      data: goal,
    }
  } catch (error) {
    console.error('❌ Erro ao criar meta:', error)
    throw error
  }
}

// Implementação: Listar tarefas
async function listTasks(params: any, userId: string) {
  console.log('📋 Listando tarefas...')

  try {
    const where: any = { userId }

    if (params.completed !== undefined) {
      where.completed = params.completed
    }

    if (params.priority) {
      where.priority = params.priority
    }

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: params.limit || 10,
    })

    console.log('✅ Tarefas encontradas:', tasks.length)

    return {
      success: true,
      message: `✅ Encontrei ${tasks.length} tarefa(s)`,
      data: tasks,
    }
  } catch (error) {
    console.error('❌ Erro ao listar tarefas:', error)
    throw error
  }
}

// Implementação: Concluir tarefa
async function completeTask(params: any, userId: string) {
  console.log('✔️ Marcando tarefa como concluída...')

  try {
    const task = await prisma.task.update({
      where: {
        id: params.taskId,
        userId, // Segurança: só permite alterar tarefas do próprio usuário
      },
      data: { completed: true },
    })

    console.log('✅ Tarefa concluída!', task)

    return {
      success: true,
      message: `✅ Tarefa "${task.title}" marcada como concluída!`,
      data: task,
    }
  } catch (error) {
    console.error('❌ Erro ao concluir tarefa:', error)
    throw error
  }
}

// Implementação: Atualizar progresso da meta
async function updateGoalProgress(params: any, userId: string) {
  console.log('📊 Atualizando progresso da meta...')

  try {
    const goal = await prisma.goal.update({
      where: {
        id: params.goalId,
        userId,
      },
      data: { current: params.current },
    })

    const percentage = Math.round((goal.current / goal.target) * 100)
    const status =
      goal.current >= goal.target
        ? '🎉 META ALCANÇADA!'
        : `📊 Progresso: ${percentage}%`

    console.log('✅ Meta atualizada!', goal)

    return {
      success: true,
      message: `🎯 Meta "${goal.title}" atualizada! ${status} (${goal.current}/${goal.target})`,
      data: goal,
    }
  } catch (error) {
    console.error('❌ Erro ao atualizar meta:', error)
    throw error
  }
}

// Implementação: Criar evento
async function createEvent(params: any, userId: string) {
  console.log('✅ Iniciando criação de evento...')
  console.log('📝 Dados do evento:', {
    title: params.title,
    description: params.description,
    location: params.location,
    category: params.category,
    startDate: params.startDate,
    endDate: params.endDate,
    allDay: params.allDay,
    priority: params.priority,
    reminder: params.reminder,
    attendees: params.attendees,
    userId,
  })

  try {
    const event = await prisma.event.create({
      data: {
        title: params.title,
        description: params.description,
        location: params.location,
        category: params.category,
        startDate: new Date(params.startDate),
        endDate: params.endDate ? new Date(params.endDate) : null,
        allDay: params.allDay,
        priority: params.priority,
        reminder: params.reminder,
        attendees: params.attendees,
        userId,
      },
    })

    console.log('✅ Evento criado com sucesso!', event)

    return {
      success: true,
      message: `✅ Evento "${event.title}" criado com sucesso!`,
      data: event,
    }
  } catch (error) {
    console.error('❌ Erro ao criar evento:', error)
    throw error
  }
}

// Implementação: Criar transação financeira
async function createFinancialTransaction(params: any, userId: string) {
  console.log('💰 Iniciando criação de transação financeira...')
  console.log('📝 Dados da transação:', params)

  try {
    // Determinar o tipo baseado no valor (negativo = despesa, positivo = receita)
    const amount = Math.abs(params.amount)
    const type = params.amount < 0 ? 'EXPENSE' : 'INCOME'

    // Extrair o nome da categoria dos parâmetros
    const categoryName =
      params.category ||
      params.categoryName ||
      (type === 'EXPENSE' ? 'Despesas Gerais' : 'Receitas')

    // Criar um título se não fornecido
    const title =
      params.title ||
      params.description ||
      `${type === 'EXPENSE' ? 'Despesa' : 'Receita'} de R$ ${amount.toFixed(2)}`

    // Primeiro, buscar ou criar a categoria
    let category = await prisma.financialCategory.findFirst({
      where: {
        name: categoryName,
        type: type,
        userId,
      },
    })

    if (!category) {
      // Criar categoria automaticamente se não existir
      category = await prisma.financialCategory.create({
        data: {
          name: categoryName,
          type: type,
          icon: type === 'INCOME' ? '💰' : '💸',
          color: type === 'INCOME' ? '#10B981' : '#EF4444',
          userId,
        },
      })
      console.log('📁 Categoria criada automaticamente:', category)
    }

    // Criar a transação
    const transaction = await prisma.financialTransaction.create({
      data: {
        title: title,
        description: params.description || '',
        amount: amount,
        type: type,
        categoryId: category.id,
        paymentMethod: params.paymentMethod || 'CASH',
        date: params.date ? new Date(params.date) : new Date(),
        tags: params.tags ? JSON.stringify(params.tags) : '',
        userId,
      },
      include: {
        category: true,
      },
    })

    console.log('✅ Transação criada com sucesso!', transaction)

    const typeText = type === 'INCOME' ? 'receita' : 'despesa'
    const amountText = `R$ ${amount.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
    })}`

    return {
      success: true,
      message: `💰 ${type === 'INCOME' ? '📈' : '📉'} ${
        typeText.charAt(0).toUpperCase() + typeText.slice(1)
      } "${title}" registrada com sucesso! Valor: ${amountText}, Categoria: ${categoryName}`,
      data: transaction,
    }
  } catch (error) {
    console.error('❌ Erro ao criar transação financeira:', error)
    throw error
  }
}

// Implementação: Criar categoria financeira
async function createFinancialCategory(params: any, userId: string) {
  console.log('🗂️ Iniciando criação de categoria financeira...')
  console.log('📝 Dados da categoria:', params)

  try {
    // Verificar se já existe uma categoria com o mesmo nome
    const existingCategory = await prisma.financialCategory.findFirst({
      where: {
        name: params.name,
        type: params.type,
        userId,
      },
    })

    if (existingCategory) {
      return {
        success: false,
        message: `❌ Já existe uma categoria "${params.name}" do tipo ${
          params.type === 'INCOME' ? 'receita' : 'despesa'
        }`,
        data: null,
      }
    }

    const category = await prisma.financialCategory.create({
      data: {
        name: params.name,
        type: params.type,
        icon: params.icon || (params.type === 'INCOME' ? '💰' : '💸'),
        color:
          params.color || (params.type === 'INCOME' ? '#10B981' : '#EF4444'),
        userId,
      },
    })

    console.log('✅ Categoria financeira criada com sucesso!', category)

    const typeText = params.type === 'INCOME' ? 'receitas' : 'despesas'

    return {
      success: true,
      message: `🗂️ Categoria "${params.name}" criada com sucesso para ${typeText}!`,
      data: category,
    }
  } catch (error) {
    console.error('❌ Erro ao criar categoria financeira:', error)
    throw error
  }
}
