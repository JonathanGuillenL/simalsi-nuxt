declare interface ProcedimientoQuirurgicoResponse {
  id: number
  descripcion: string
  regionAnatomica: RegionAnatomicaResponse
  createdAt: string | null
  deletedAt: string | null
}

declare interface ProcedimientoQuirurgicoRequest {
  descripcion: string
  regionAnatomicaId: number | null
}
