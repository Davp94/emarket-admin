import { apiClient } from "@/config/ServiceConfig";
import { RolResponse } from "@/types/response/RolResponse";

export class RolService {
    public static async getRoles(): Promise<RolResponse[]> {
        try {
            const response = await apiClient.get<RolResponse[]>('/roles');

            return response.data;
        } catch (error) {
            console.error('Error al obtener los roles:', error);
            throw new Error('Error obteniendo los roles');
        }
    }

    public static async getRolById(id: number){
        try {
            const response = await apiClient.get<RolResponse>(`/roles/${id}`);
            return response.data; 
        } catch (error) {
            console.error('Error al obtener el rol:', error);
            throw new Error('Error obteniendo el rol');
        }
    }

    public static async createRol(rol: RolResponse): Promise<RolResponse>{
        try {
            const response = await apiClient.post<RolResponse>(`/roles`, rol);
            return response.data; 
        } catch (error) {
            console.error('Error al crear el rol:', error);
            throw new Error('Error creando el rol');
        }
    }

    public static async updateRol(id: number, rol: RolResponse): Promise<RolResponse>{
        try {
            const response = await apiClient.put<RolResponse>(`/roles/${id}`, rol);
            return response.data; 
        } catch (error) {
            console.error('Error al crear el rol:', error);
            throw new Error('Error creando el rol');
        }
    }

    public static async deleteRol(id: number): Promise<void>{
        try {
            await apiClient.delete(`/roles/${id}`);
        } catch (error) {
            console.error('Error al eliminar el rol:', error);
            throw new Error('Error eliminando el rol');
        }
    }


}