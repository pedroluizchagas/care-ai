import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'

// GET - Listar categorias financeiras
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const type = searchParams.get('type') // INCOME ou EXPENSE

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      )
    }

    const whereClause = {
      userId,
      ...(type && { type }),
    }

    const categories = await prisma.financialCategory.findMany({
      where: whereClause,
      orderBy: [{ isDefault: 'desc' }, { name: 'asc' }],
      include: {
        _count: {
          select: {
            transactions: true,
            budgets: true,
          },
        },
      },
    })

    return NextResponse.json({
      success: true,
      categories,
      count: categories.length,
    })
  } catch (error) {
    console.error('Erro ao buscar categorias financeiras:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST - Criar nova categoria financeira
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, icon, color, type, userId, isDefault = false } = body

    if (!name || !type || !userId) {
      return NextResponse.json(
        { error: 'name, type e userId são obrigatórios' },
        { status: 400 }
      )
    }

    if (!['INCOME', 'EXPENSE'].includes(type)) {
      return NextResponse.json(
        { error: 'type deve ser INCOME ou EXPENSE' },
        { status: 400 }
      )
    }

    // Verificar se já existe uma categoria com o mesmo nome para o usuário
    const existingCategory = await prisma.financialCategory.findFirst({
      where: {
        name,
        userId,
        type,
      },
    })

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Já existe uma categoria com este nome' },
        { status: 409 }
      )
    }

    const category = await prisma.financialCategory.create({
      data: {
        name,
        icon: icon || '💰',
        color: color || '#3B82F6',
        type,
        userId,
        isDefault,
      },
    })

    return NextResponse.json(
      {
        success: true,
        category,
        message: 'Categoria criada com sucesso',
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('Erro ao criar categoria financeira:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
