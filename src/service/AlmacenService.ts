import { apiClient } from "@/config/ServiceConfig";
import { AlmacenRequest } from "@/types/request/AlamcenRequest";
import { AlmacenResponse } from "@/types/response/AlmacenResponse";

export class AlmacenService {
    public static async getAlmacenes(): Promise<AlmacenResponse[]> {
        try {
            const response = await apiClient.get<AlmacenResponse[]>('/almacenes');
            return response.data;
        } catch (error) {
            console.error('Error al obtener los almacenes:', error);
            throw new Error('Error obteniendo los almacenes');
        }
    }

    public static async getAlmacenById(id: number): Promise<AlmacenResponse> {
        try {
            const response = await apiClient.get<AlmacenResponse>(`/almacenes/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener el almacen:', error);
            throw new Error('Error obteniendo el almacen');
        }
    }

    public static async getAlmacenesBySucursal(sucursalId: number): Promise<AlmacenResponse[]> {
        try {
            const response = await apiClient.get<AlmacenResponse[]>(`/almacenes/sucursal/${sucursalId}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener los almacenes:', error);
            throw new Error('Error obteniendo los almacenes por sucursal');
        }
    }

    public static async createAlmacen(almacen: AlmacenRequest): Promise<AlmacenResponse> {
        try {
            const response = await apiClient.post<AlmacenResponse>('/almacenes', almacen);
            return response.data;
        } catch (error) {
            console.error('Error al crear el almacen:', error);
            throw new Error('Error creando el almacen');
        }
    }

    public static async updateAlmacen(id: number, almacen: AlmacenRequest): Promise<AlmacenResponse> {
        try {
            const response = await apiClient.put<AlmacenResponse>(`/almacenes/${id}`, almacen);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el almacen:', error);
            throw new Error('Error actualizando el almacen');
        }
    }

    public static async deleteAlmacen(id: number): Promise<void> {
        try {
            await apiClient.delete(`/almacenes/${id}`);
        } catch (error) {
            console.error('Error al eliminar el almacen:', error);
            throw new Error('Error eliminando el almacen');
        }
    }
}
