declare interface ColaboradorRequest {
  nombres: string
  apellidos: string
  numeroIdentificacion: string
  codigoSanitario: string
  telefono: string
  username: string
  email: string
  user: boolean
  cargoId: number | null
}

declare interface ColaboradorResponse {
  id: number
  nombres: string
  apellidos: string
  numeroIdentificacion: string
  codigoSanitario: string
  telefono: string
  username: string
  email: string
  user: boolean
  cargo: { id: number, descripcion: string }
  createdAt: string | null
  deletedAt: string | null
}
