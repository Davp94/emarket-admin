import { apiClient } from "@/config/ServiceConfig";
import { ClienteProveedorResponse } from "@/types/response/ClienteProveedorResponse";

export class ClienteProveedorService {
    public static async getClientesProveedores(): Promise<ClienteProveedorResponse[]> {
        try {
            const response = await apiClient.get<ClienteProveedorResponse[]>('/cliente-proveedor');
            return response.data;
        } catch (error) {
            console.error('Error al obtener los cliente proveedor:', error);
            throw new Error('Error obteniendo los cliente proveedor');
        }
    }

}