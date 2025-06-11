import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/database'

// GET - Listar eventos do usuário
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

    const events = await prisma.event.findMany({
      where: { userId },
      orderBy: { startDate: 'asc' },
    })

    return NextResponse.json({ events, success: true })
  } catch (error) {
    console.error('Events GET error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Criar novo evento
export async function POST(request: NextRequest) {
  try {
    const data = await request.json()
    const {
      title,
      description,
      location,
      category,
      startDate,
      endDate,
      allDay,
      priority,
      reminder,
      attendees,
      userId,
    } = data

    if (!title || !startDate || !userId) {
      return NextResponse.json(
        { error: 'Title, startDate and userId are required' },
        { status: 400 }
      )
    }

    const event = await prisma.event.create({
      data: {
        title,
        description: description || '',
        location: location || '',
        category: category || 'Reunião',
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        allDay: allDay || false,
        priority: priority || 'MEDIUM',
        reminder: reminder || null,
        attendees: attendees || null,
        userId,
      },
    })

    return NextResponse.json({ event, success: true }, { status: 201 })
  } catch (error) {
    console.error('Events POST error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar evento
export async function PUT(request: NextRequest) {
  try {
    const data = await request.json()
    const { id, ...updateData } = data

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    // Converter datas se fornecidas
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate)
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate)
    }

    const event = await prisma.event.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({ event, success: true })
  } catch (error) {
    console.error('Events PUT error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Excluir evento
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Event ID is required' },
        { status: 400 }
      )
    }

    await prisma.event.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Events DELETE error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
