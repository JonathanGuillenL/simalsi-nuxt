declare type Sexo = 'MASCULINO' | 'FEMENINO';

declare interface PacientePageResponse {
  id: number
  nombre: string
  sexo: string
  edad: number
  nacimiento: string
  telefono: string
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
}
