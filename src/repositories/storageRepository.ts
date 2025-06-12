export interface StorageRepository {
  getItem<T>(key: string): T | null
  setItem<T>(key: string, value: T): void
}

export class LocalStorageRepository implements StorageRepository {
  getItem<T>(key: string): T | null {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : null
  }

  setItem<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return
    localStorage.setItem(key, JSON.stringify(value))
  }
}
