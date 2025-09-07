declare interface SolicitudPageResponse {
  id: number
  fechaSolicitud: string
  paciente: string
  medicoTratante: string
  servicio: string
  solicitudEstado: string
  createdAt: string | null
  deletedAt: string | null
}

declare interface SolicitudCreateRequest {
  clienteId: number | null,
  pacienteId: number | null,
  medicoTratanteId: number | null,
  servicioLaboratorioId: number | null,
  fechaTomaMuestra: string | null,
  observaciones: string | null,
}
