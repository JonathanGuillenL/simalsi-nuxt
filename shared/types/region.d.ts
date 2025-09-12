declare interface RegionAnatomicaResponse {
  id: number
  descripcion: string
  createdAt: string | null
  deletedAt: string | null
}

declare interface RegionAnatomicaRequest {
  descripcion: string
}
