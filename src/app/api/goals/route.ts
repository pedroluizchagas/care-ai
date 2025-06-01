import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'

// GET - Listar metas do usuário
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const goals = await prisma.goal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ goals, success: true })
  } catch (error) {
    console.error('Goals GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Criar nova meta
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const { title, description, target, current, category, deadline, userId } =
      data

    if (!title || !userId || target === undefined) {
      return NextResponse.json(
        { error: 'Title, target and userId are required' },
        { status: 400 }
      )
    }

    const goal = await prisma.goal.create({
      data: {
        title,
        description: description || '',
        target,
        current: current || 0,
        category: category || 'Pessoal',
        deadline: deadline ? new Date(deadline) : null,
        userId,
      },
    })

    return NextResponse.json({ goal, success: true }, { status: 201 })
  } catch (error) {
    console.error('Goals POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar meta
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      )
    }

    // Converter deadline para Date se fornecido
    if (updateData.deadline) {
      updateData.deadline = new Date(updateData.deadline)
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ goal, success: true })
  } catch (error) {
    console.error('Goals PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir meta
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Goal ID is required' },
        { status: 400 }
      )
    }

    await prisma.goal.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Goals DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
