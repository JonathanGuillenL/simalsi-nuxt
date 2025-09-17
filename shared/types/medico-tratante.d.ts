declare interface MedicoTratantePageResponse {
  id: number
  nombre: string
  codigoSanitario: string
  telefono: string
  createdAt: string | null
  deletedAt: string | null
}

declare interface MedicoTratanteResponse {
  id: number
  nombres: string
  apellidos: string
  codigoSanitario: string
  telefono: string
  direccion: string
  createdAt: string | null
  deletedAt: string | null
}

declare interface MedicoTratanteCreateRequest {
  nombres: string
  apellidos: string
  codigoSanitario: string
  telefono: string
  direccion: string
}
