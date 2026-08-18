export interface MovimientoResponse {
    id: number;
    notaId: number;
    productoId: number;
    productoNombre: string;
    almacenId: number;
    cantidad: number;
    tipoMovimiento: string;
    observaciones: string;
    precioUnitarioCompra: number;
    precioUnitarioVenta: number;
}
