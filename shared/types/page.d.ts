declare interface Page<T> {
  data: T[]
  currentPage: number
  size: number
  totalPages: number
}

declare interface MenuItem {
  name: string
  label: string
  icon: string
  group: string
}
