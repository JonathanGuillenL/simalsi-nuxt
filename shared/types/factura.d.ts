declare interface FacturaPageResponse {
  id: number
  cliente: any
  recepcionista: any
  total: number
  subtotal: number
  saldoPendiente: number
  createdAt: string | null
  deletedAt: string | null
}

declare interface FacturaRequest {
  descuentos: number[]
  detalle: number[]
  clienteId: number | null
  pago: any | null
}
