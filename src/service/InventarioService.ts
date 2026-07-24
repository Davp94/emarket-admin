import { apiClient } from "@/config/ServiceConfig";
import { PaginationResponse } from "@/types/common/PaginationResponse";
import { AlmacenResponse } from "@/types/response/AlmacenResponse";
import { ProductoResponse } from "@/types/response/ProductoResponse";
import { RolResponse } from "@/types/response/RolResponse";
import { SucursalResponse } from "@/types/response/SucursalResponse";

export class InventarioService {
    public static async getProductosPaginacion(params: {
        pageNumber?: number;
        pageSize?: number;
        sortField?: string;
        sortOrder?: 'ASC' | 'DESC';
        filterValue?: string;
        almacenId: number;
        nombre?: string;
        descripcion?: string;
        marca?: string;
        nombreCategoria?: string;
    }): Promise<PaginationResponse<ProductoResponse>> {
        try {
            const response = await apiClient.get<PaginationResponse<ProductoResponse>>('/productos/paginacion', 
                { params },
            );

            return response.data;
        } catch (error) {
            console.error('Error al obtener los roles:', error);
            throw new Error('Error obteniendo los roles');
        }
    }

    public static async getProductosAlmacen(almacenId: number): Promise<ProductoResponse[]>{
        try {
            const response = await apiClient.get<ProductoResponse[]>(`/productos/almacen/${almacenId}`);
            return response.data; 
        } catch (error) {
            console.error('Error al obtener los productos:', error);
            throw new Error('Error obteniendo los productos');
        }
    }

    public static async getAlmacenes(sucursalId: number): Promise<AlmacenResponse[]>{
        try {
            const response = await apiClient.get<AlmacenResponse[]>(`/almacenes/${sucursalId}`);
            return response.data; 
        } catch (error) {
            console.error('Error al crear el rol:', error);
            throw new Error('Error creando el rol');
        }
    }

    public static async getSucursales(): Promise<SucursalResponse[]>{
        try {
            const response = await apiClient.put<SucursalResponse[]>(`/sucursales`);
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