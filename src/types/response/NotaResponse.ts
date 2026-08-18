import { MovimientoResponse } from "./MovimientoResponse";

export interface NotaResponse {
    id: number;
    fecha: string;
    tipoNota: string;
    impuestos: number;
    descuentos: number;
    estadoNota: string;
    observaciones: string;
    usuarioId: number;
    usuarioNombre: string;
    clienteProveedorId: number;
    clienteProveedorRazonSocial: string;
    movimientos: MovimientoResponse[];
}
