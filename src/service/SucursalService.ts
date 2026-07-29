import { apiClient } from "@/config/ServiceConfig";
import { SucursalRequest } from "@/types/request/SucursalRequest";
import { SucursalResponse } from "@/types/response/SucursalResponse";

export class SucursalService {
    public static async getSucursales(): Promise<SucursalResponse[]> {
        try {
            const response = await apiClient.get<SucursalResponse[]>('/sucursales');
            return response.data;
        } catch (error) {
            console.error('Error al obtener las sucursales:', error);
            throw new Error('Error obteniendo las sucursales');
        }
    }

    public static async getSucursalById(id: number): Promise<SucursalResponse> {
        try {
            const response = await apiClient.get<SucursalResponse>(`/sucursales/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener la sucursal:', error);
            throw new Error('Error obteniendo la sucursal');
        }
    }

    public static async createSucursal(sucursal: SucursalRequest): Promise<SucursalResponse> {
        try {
            const response = await apiClient.post<SucursalResponse>('/sucursales', sucursal);
            return response.data;
        } catch (error) {
            console.error('Error al crear la sucursal:', error);
            throw new Error('Error creando la sucursal');
        }
    }

    public static async updateSucursal(id: number, sucursal: SucursalRequest): Promise<SucursalResponse> {
        try {
            const response = await apiClient.put<SucursalResponse>(`/sucursales/${id}`, sucursal);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la sucursal:', error);
            throw new Error('Error actualizando la sucursal');
        }
    }

    public static async deleteSucursal(id: number): Promise<void> {
        try {
            await apiClient.delete(`/sucursales/${id}`);
        } catch (error) {
            console.error('Error al eliminar la sucursal:', error);
            throw new Error('Error eliminando la sucursal');
        }
    }
}
