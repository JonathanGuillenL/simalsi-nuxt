declare interface MonedaResponse {
  id: number
  descripcion: string
  tipoCambio: number
  signoMonetario: string
  createdAt: string | null
  deletedAt: string | null
}

declare interface MonedaRequest {
  descripcion: string
  tipoCambio: number | null
  signoMonetario: string
}
