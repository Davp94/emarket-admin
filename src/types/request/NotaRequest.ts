import { MovimientoRequest } from "./MovimientoRequest";

export interface NotaRequest {
    tipoNota: string;
    impuestos: number;
    descuentos: number;
    observaciones?: string;
    usuarioId: number;
    clienteProveedorId: number;
    movimientos: MovimientoRequest[];
}
