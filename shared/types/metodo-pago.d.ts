declare interface MetodoPagoResponse {
  id: number
  descripcion: string
  createdAt: string | null
  deletedAt: string | null
}

declare interface MetodoPagoRequest {
  descripcion: string
}
