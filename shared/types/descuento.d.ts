declare interface DescuentoPageResponse {
  id: number
  descripcion: string
  porcentaje: number
  fechaInicio: string
  fechaFin: string
  anual: boolean
  automatico: boolean
  createdAt: string | null
  deletedAt: string | null
}

declare interface DescuentoRequest {
  descripcion: string
  porcentaje: number | null
  fechaInicio: string | null
  fechaFin: string | null
  anual: boolean
  automatico: boolean
}
