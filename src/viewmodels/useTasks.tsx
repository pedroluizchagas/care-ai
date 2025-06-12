'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Task } from '@/types'
import { generateId } from '@/lib/utils'
import { LocalStorageRepository } from '@/repositories/storageRepository'
import { TasksRepository } from '@/repositories/tasksRepository'

interface TaskContextValue {
  tasks: Task[]
  addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): void
  updateTask(id: string, updates: Partial<Task>): void
  deleteTask(id: string): void
}

const TasksContext = createContext<TaskContextValue | undefined>(undefined)

const repo = new TasksRepository(new LocalStorageRepository())

export function TasksProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {
    setTasks(repo.load())
  }, [])

  useEffect(() => {
    repo.save(tasks)
  }, [tasks])

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setTasks((prev) => [newTask, ...prev])
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates, updatedAt: new Date() } : t))
    )
  }

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <TasksContext.Provider value={{ tasks, addTask, updateTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const ctx = useContext(TasksContext)
  if (!ctx) throw new Error('useTasks must be used within TasksProvider')
  return ctx
}
