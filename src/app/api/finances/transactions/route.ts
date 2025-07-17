import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'

// GET - Listar transações financeiras
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // INCOME, EXPENSE ou ALL
    const categoryId = searchParams.get('categoryId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const limit = searchParams.get('limit')
    const page = searchParams.get('page')

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      )
    }

    // Construir filtros
    const whereClause: any = {
      userId,
    }

    if (type && type !== 'ALL') {
      whereClause.type = type
    }

    if (categoryId) {
      whereClause.categoryId = categoryId
    }

    if (startDate || endDate) {
      whereClause.date = {}
      if (startDate) {
        whereClause.date.gte = new Date(startDate)
      }
      if (endDate) {
        whereClause.date.lte = new Date(endDate)
      }
    }

    // Paginação
    const limitInt = limit ? parseInt(limit) : 50
    const pageInt = page ? parseInt(page) : 1
    const skip = (pageInt - 1) * limitInt

    const [transactions, totalCount] = await Promise.all([
      prisma.financialTransaction.findMany({
        where: whereClause,
        include: {
          category: true,
        },
        orderBy: { date: 'desc' },
        take: limitInt,
        skip: skip,
      }),
      prisma.financialTransaction.count({
        where: whereClause,
      }),
    ])

    return NextResponse.json({
      success: true,
      transactions,
      pagination: {
        page: pageInt,
        limit: limitInt,
        total: totalCount,
        pages: Math.ceil(totalCount / limitInt),
      },
    })
  } catch (error) {
    console.error('Erro ao buscar transações:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar nova transação
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      amount,
      type,
      categoryId,
      paymentMethod = 'CASH',
      date,
      recurrence = 'NONE',
      isRecurring = false,
      tags = [],
      userId,
    } = body

    // Validações obrigatórias
    if (!title || !amount || !type || !categoryId || !userId) {
      return NextResponse.json(
        {
          error: 'title, amount, type, categoryId e userId são obrigatórios',
        },
        { status: 400 }
      )
    }

    if (!['INCOME', 'EXPENSE'].includes(type)) {
      return NextResponse.json(
        { error: 'type deve ser INCOME ou EXPENSE' },
        { status: 400 }
      )
    }

    if (amount <= 0) {
      return NextResponse.json(
        { error: 'amount deve ser maior que zero' },
        { status: 400 }
      )
    }

    // Verificar se a categoria existe e pertence ao usuário
    const category = await prisma.financialCategory.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Categoria não encontrada ou não pertence ao usuário' },
        { status: 404 }
      )
    }

    // Verificar se o tipo da transação coincide com o tipo da categoria
    if (category.type !== type) {
      return NextResponse.json(
        {
          error: `Tipo da transação (${type}) não coincide com o tipo da categoria (${category.type})`,
        },
        { status: 400 }
      )
    }

    const transaction = await prisma.financialTransaction.create({
      data: {
        title,
        description,
        amount: parseFloat(amount.toString()),
        type,
        categoryId,
        paymentMethod,
        date: date ? new Date(date) : new Date(),
        recurrence,
        isRecurring,
        tags: JSON.stringify(tags),
        userId,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(
      {
        success: true,
        transaction,
        message: 'Transação criada com sucesso',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao criar transação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
