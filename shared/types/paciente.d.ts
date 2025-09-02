declare type Sexo = 'MASCULINO' | 'FEMENINO';

declare interface PacientePageResponse {
  id: number
  nombre: string
  sexo: string
  edad: number
  nacimiento: string
  telefono: string
  createdAt: string | null
  deletedAt: string | null
}

declare interface PacienteResponse {
  id: string
  nombres: string
  apellidos: string
  edad: number
  nacimiento: string
  sexo: Sexo
  telefono: string
  direccion: string
  createdAt: string | null
  deletedAt: string | null
}

declare interface PacienteCreateRequest {
  nombres: string
  apellidos: string
  nacimiento: string | null
  sexo: string | null
  telefono: string
  direccion: string
}
