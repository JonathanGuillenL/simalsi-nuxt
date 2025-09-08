declare interface ClientePageResponse {
  id: number
  username: string
  email: string
  persona: {
    id: number
    nombre: string
    apellido: string
    telefono: string
    direccion: string
    tipoPersona: {
      id: number
      descripcion: string
    }
  }
  tipoCliente: string
  createdAt: string | null
  deletedAt: string | null
}

declare interface ClienteResponse {
  id: number
  username: string
  email: string
  telefono: string
  direccion: string
  tipoCliente: string
  nombres: string
  apellidos: string
  nacimiento: string | null
  sexo: string | null
  cedula: string | null
  createdAt: string | null
  deletedAt: string | null

  // Clinica afiliada
  nombre: string
  razonSocial: string
  ruc: string

  // Cliente espontáneo
  hasPaciente: boolean
  personaId: number

  // Medico afiliado
  codigoSanitario: string | null
}

declare interface ClienteCreateRequest {
  // Persona jurídica
  nombre: string
  razonSocial: string
  ruc: string

  // Persona natural
  nombres: string
  apellidos: string
  cedula: string
  telefono: string
  direccion: string
  email: string

  // Cliente espontáneo
  hasPaciente: boolean
  nacimiento: string | null
  sexo: string | null
  pacienteId: number | null

  // Médico afiliado
  codigoSanitario: string

  tipoCliente: string | null
}
