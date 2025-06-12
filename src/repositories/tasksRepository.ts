import { Task } from '@/types'
import { StorageRepository } from './storageRepository'

const TASKS_KEY = 'careai-tasks'

export class TasksRepository {
  constructor(private storage: StorageRepository) {}

  load(): Task[] {
    return this.storage.getItem<Task[]>(TASKS_KEY) || []
  }

  save(tasks: Task[]): void {
    this.storage.setItem(TASKS_KEY, tasks)
  }
}
