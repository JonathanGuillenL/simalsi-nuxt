declare interface Page<T> {
  data: T[]
  currentPage: number
  size: number
  totalPages: number
}
