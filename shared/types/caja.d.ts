declare interface LaminaCaja {
    id: number
    fila: number
    columna: number
    cajaId: number
}

declare interface Lamina {
    id: number
    fila: number
    columna: number
}

declare interface CajaResponse {
    id: number
    numeroFilas: number
    numeroColumnas: number
    laminas: Lamina[]
}
