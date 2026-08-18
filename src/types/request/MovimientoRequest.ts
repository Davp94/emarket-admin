export interface MovimientoRequest {
    productoId: number;
    almacenId: number;
    cantidad: number;
    tipoMovimiento: string;
    precioUnitarioCompra: number;
    precioUnitarioVenta: number;
    observaciones?: string;
}
