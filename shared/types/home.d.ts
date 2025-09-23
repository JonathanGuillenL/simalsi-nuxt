declare interface HomeData {
  count: {
    solicitudCount: {
      year: number;
      month: number;
      count: number;
    }[]
    servicioRank: {
      servicio: string;
      cantidad: number;
    }[]
    departamentoClinica: {
      departamento: string;
      count: number;
    }[]
    totalClientes: number
    totalFacturas: number
    totalServicios: number
    totalSolicitudes: number
  }
}
