import { apiClient } from "@/config/ServiceConfig";
import { NotaRequest } from "@/types/request/NotaRequest";
import { NotaResponse } from "@/types/response/NotaResponse";

export class NotaService {
    public static async getNotas(): Promise<NotaResponse[]> {
        try {
            const response = await apiClient.get<NotaResponse[]>('/notas');
            return response.data;
        } catch (error) {
            console.error('Error al obtener las notas:', error);
            throw new Error('Error obteniendo las notas');
        }
    }

    public static async getNotaById(id: number): Promise<NotaResponse> {
        try {
            const response = await apiClient.get<NotaResponse>(`/notas/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener la nota:', error);
            throw new Error('Error obteniendo la nota');
        }
    }

    public static async createNota(nota: NotaRequest): Promise<NotaResponse> {
        try {
            const response = await apiClient.post<NotaResponse>('/notas', nota);
            return response.data;
        } catch (error) {
            console.error('Error al crear la nota:', error);
            throw new Error('Error creando la nota');
        }
    }

    public static async updateNota(id: number, nota: NotaRequest): Promise<NotaResponse> {
        try {
            const response = await apiClient.put<NotaResponse>(`/notas/${id}`, nota);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar la nota:', error);
            throw new Error('Error actualizando la nota');
        }
    }

    public static async deleteNota(id: number): Promise<void> {
        try {
            await apiClient.delete(`/notas/${id}`);
        } catch (error) {
            console.error('Error al eliminar la nota:', error);
            throw new Error('Error eliminando la nota');
        }
    }
}
