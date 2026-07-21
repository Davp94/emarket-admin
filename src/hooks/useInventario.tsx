import { InventarioService } from "@/service/InventarioService";
import { RolService } from "@/service/RolService";
import { PaginationResponse } from "@/types/common/PaginationResponse";
import { AlmacenResponse } from "@/types/response/AlmacenResponse";
import { ProductoResponse } from "@/types/response/ProductoResponse";
import { RolResponse } from "@/types/response/RolResponse";
import { SucursalResponse } from "@/types/response/SucursalResponse";
import { useState } from "react";

export const useInventario = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const getProductosPaginacion = async (params: {
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
    }): Promise<PaginationResponse<ProductoResponse>> => {
        setLoading(true);
        setError("");
        try {
            const response = await InventarioService.getProductosPaginacion(params);
            return response;
        } catch (error) {
            setError("Error al obtener los roles");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const getAlmacenesBySucursal = async (sucursalId: number): Promise<AlmacenResponse[]> => {
        setLoading(true);
        setError("");
        try {
            const response = await InventarioService.getAlmacenes(sucursalId);
            return response;
        } catch (error) {
            setError("Error al obtener el rol");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const getSucursales = async (): Promise<SucursalResponse[]> => {
        setLoading(true);
        setError("");
        try {
            const response = await InventarioService.getSucursales();
            return response;
        } catch (error) {
            setError("Error al crear el rol");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return {
        getProductosPaginacion,
        getAlmacenesBySucursal,
        getSucursales,
        loading,
        error
    };
};