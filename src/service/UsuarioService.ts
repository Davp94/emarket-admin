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
        console.log("🚀 ~ UsuarioService ~ createUsuario ~ usuario:", usuario)
        try {
            const formData = this.formatUsuariosToFormData(usuario);
            const response = await apiClient.post<UsuarioResponse>('/usuarios', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        } catch (error) {
            console.error('Error al crear el usuario:', error);
            throw new Error('Error creando el usuario');
        }
    }

    public static async updateUsuario(id: number, usuario: UsuarioRequest): Promise<UsuarioResponse> {
        try {
            const formData = this.formatUsuariosToFormData(usuario);
            const response = await apiClient.put<UsuarioResponse>(`/usuarios/${id}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
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

    private static formatUsuariosToFormData(usuarios: UsuarioRequest): FormData {
        const formData = new FormData();

        formData.set('username', usuarios.username ?? '');
        formData.set('correo', usuarios.correo ?? '');
        formData.set('password', usuarios.password ?? '');
        formData.set('nombres', usuarios.nombres ?? '');
        formData.set('apellidos', usuarios.apellidos ?? '');
        formData.set('fechaNacimiento', usuarios.fechaNacimiento ?? '');
        formData.set('genero', usuarios.genero ?? '');
        formData.set('telefono', usuarios.telefono ?? '');
        formData.set('direccion', usuarios.direccion ?? '');
        formData.set('nacionalidad', usuarios.nacionalidad ?? '');

        formData.set('roles', JSON.stringify(usuarios.roles ?? []));
        (usuarios.roles ?? []).forEach((role, index) => {
            formData.append(`roles[${index}]`, String(role)); //roles[0]=1, roles[1]=5, roles[2]=5 documentos[0].tipo documentos[0].detalle documentos[1] ...
        });

        (usuarios.documentos ?? []).forEach((documento, index) => {
            formData.append(`documentos[${index}][tipo]`, documento.tipo ?? 'documento');
            formData.append(`documentos[${index}][detalle]`, documento.detalle ?? '');
            formData.append(`documentos[${index}][archivo]`, documento.archivo);
            formData.append(`documentos[${index}]`, documento.archivo, documento.archivo.name);
        });

        return formData;
    }
}
