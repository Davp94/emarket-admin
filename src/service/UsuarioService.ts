import { apiClient } from "@/config/ServiceConfig";
import { UsuarioRequest } from "@/types/request/UsuarioRequest";
import { UsuarioResponse } from "@/types/response/UsuarioResponse";

export class UsuarioService {
    public static async getUsuarios(): Promise<UsuarioResponse[]> {
        try {
            const response = await apiClient.get<UsuarioResponse[]>('/usuarios');
            return response.data;
        } catch (error) {
            console.error('Error al obtener los usuarios:', error);
            throw new Error('Error obteniendo los usuarios');
        }
    }

    public static async getUsuarioById(id: number): Promise<UsuarioResponse> {
        try {
            const response = await apiClient.get<UsuarioResponse>(`/usuarios/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
            throw new Error('Error obteniendo el usuario');
        }
    }

    public static async createUsuario(usuario: UsuarioRequest): Promise<UsuarioResponse> {
        try {
            const response = await apiClient.post<UsuarioResponse>('/usuarios', usuario);
            return response.data;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            throw new Error('Error creando el usuario');
        }
    }

    public static async updateUsuario(id: number, usuario: UsuarioRequest): Promise<UsuarioResponse> {
        try {
            const response = await apiClient.put<UsuarioResponse>(`/usuarios/${id}`, usuario);
            return response.data;
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            throw new Error('Error actualizando el usuario');
        }
    }

    public static async deleteUsuario(id: number): Promise<void> {
        try {
            await apiClient.delete(`/usuarios/${id}`);
        } catch (error) {
            console.error('Error al eliminar el usuario:', error);
            throw new Error('Error eliminando el usuario');
        }
    }
}
