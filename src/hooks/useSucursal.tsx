import { SucursalService } from "@/service/SucursalService";
import { SucursalRequest } from "@/types/request/SucursalRequest";
import { SucursalResponse } from "@/types/response/SucursalResponse";
import { useState } from "react";

export const useSucursal = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getSucursales = async (): Promise<SucursalResponse[]> => {
        setLoading(true);
        setError("");
        try {
            const response = await SucursalService.getSucursales();
            return response;
        } catch (error) {
            setError("Error al obtener las sucursales");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getSucursalById = async (id: number): Promise<SucursalResponse> => {
        setLoading(true);
        setError("");
        try {
            const response = await SucursalService.getSucursalById(id);
            return response;
        } catch (error) {
            setError("Error al obtener la sucursal");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createSucursal = async (sucursal: SucursalRequest): Promise<SucursalResponse> => {
        setLoading(true);
        setError("");
        try {
            const response = await SucursalService.createSucursal(sucursal);
            return response;
        } catch (error) {
            setError("Error al crear la sucursal");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateSucursal = async (id: number, sucursal: SucursalRequest): Promise<SucursalResponse> => {
        setLoading(true);
        setError("");
        try {
            const response = await SucursalService.updateSucursal(id, sucursal);
            return response;
        } catch (error) {
            setError("Error al actualizar la sucursal");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteSucursal = async (id: number): Promise<void> => {
        setLoading(true);
        setError("");
        try {
            await SucursalService.deleteSucursal(id);
        } catch (error) {
            setError("Error al eliminar la sucursal");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        getSucursales,
        getSucursalById,
        createSucursal,
        updateSucursal,
        deleteSucursal,
        loading,
        error
    };
};
