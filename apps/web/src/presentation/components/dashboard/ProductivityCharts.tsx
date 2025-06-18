'use client'

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  CartesianGrid,
  Legend,
} from 'recharts'
import { Task } from '@/types'
import { format } from 'date-fns'

interface LineDataItem {
  date: string
  created: number
  completed: number
}

interface PieDataItem {
  name: string
  value: number
}

interface BarDataItem {
  date: string
  completed: number
}

const COLORS = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444']

export default function ProductivityCharts() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/tasks?userId=user_1')
        if (res.ok) {
          const data = await res.json()
          setTasks(data.tasks || [])
        }
      } catch (error) {
        console.error('Erro ao carregar tarefas', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const totalTasks = tasks.length
  const completedTasks = tasks.filter((t) => t.completed).length
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

  const lineData: LineDataItem[] = []
  const lineMap: Record<string, LineDataItem> = {}
  const pieMap: Record<string, number> = {}
  const barMap: Record<string, number> = {}

  tasks.forEach((task) => {
    const createdDate = format(new Date(task.createdAt), 'dd/MM')
    const completedDate = task.completed
      ? format(new Date(task.updatedAt), 'dd/MM')
      : null

    if (!lineMap[createdDate]) {
      lineMap[createdDate] = { date: createdDate, created: 0, completed: 0 }
    }
    lineMap[createdDate].created += 1

    if (completedDate) {
      if (!lineMap[completedDate]) {
        lineMap[completedDate] = {
          date: completedDate,
          created: 0,
          completed: 0,
        }
      }
      lineMap[completedDate].completed += 1
      barMap[completedDate] = (barMap[completedDate] || 0) + 1
    }

    pieMap[task.category] = (pieMap[task.category] || 0) + 1
  })

  for (const key in lineMap) {
    lineData.push(lineMap[key])
  }
  lineData.sort((a, b) =>
    new Date(a.date.split('/').reverse().join('-')).getTime() -
    new Date(b.date.split('/').reverse().join('-')).getTime()
  )

  const pieData: PieDataItem[] = Object.keys(pieMap).map((cat) => ({
    name: cat,
    value: pieMap[cat],
  }))

  const barData: BarDataItem[] = Object.keys(barMap).map((date) => ({
    date,
    completed: barMap[date],
  }))
  barData.sort((a, b) =>
    new Date(a.date.split('/').reverse().join('-')).getTime() -
    new Date(b.date.split('/').reverse().join('-')).getTime()
  )

  if (loading) {
    return <p className="text-white">Carregando gráficos...</p>
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center text-white">
          <p className="text-sm">Total de Tarefas</p>
          <p className="text-2xl font-semibold">{totalTasks}</p>
        </div>
        <div className="glass-card p-4 rounded-2xl flex flex-col items-center justify-center text-white">
          <p className="text-sm">Taxa de Conclusão</p>
          <p className="text-2xl font-semibold">{completionRate.toFixed(0)}%</p>
        </div>
      </div>

      <div className="w-full h-60 glass-card p-4 rounded-2xl">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={lineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <XAxis dataKey="date" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="created" stroke="#3b82f6" name="Criadas" />
            <Line type="monotone" dataKey="completed" stroke="#10b981" name="Concluídas" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="w-full h-60 glass-card p-4 rounded-2xl">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="w-full h-60 glass-card p-4 rounded-2xl">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#555" />
              <XAxis dataKey="date" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Tooltip />
              <Bar dataKey="completed" fill="#8b5cf6" name="Concluídas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

