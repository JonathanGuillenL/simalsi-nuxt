declare interface ServicioPageResponse {
  id: number
  descripcion: string
  precio: number
  procedimientoQuirurgico: {
    id: number
    descripcion: string
    regionAnatomica: {
      id: number
      descripcion: string
      createdAt: string | null
      deletedAt: string | null
    } | null
    createdAt: string | null
    deletedAt: string | null
  } | null
  createdAt: string | null
  deletedAt: string | null
}

declare interface ServicioCreateRequest {
  descripcion: string
  precio: number | null
  regionAnatomicaId: number | null
  procedimientoId: number | null
}
