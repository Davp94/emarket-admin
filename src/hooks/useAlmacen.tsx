import { AlmacenService } from "@/service/AlmacenService";
import { AlmacenRequest } from "@/types/request/AlamcenRequest";
import { AlmacenResponse } from "@/types/response/AlmacenResponse";
import { useState } from "react";

export const useAlmacen = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getAlmacenes = async (): Promise<AlmacenResponse[]> => {
        setLoading(true);
        setError("");
        try {
            const response = await AlmacenService.getAlmacenes();
            return response;
        } catch (error) {
            setError("Error al obtener los almacenes");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getAlmacenById = async (id: number): Promise<AlmacenResponse> => {
        setLoading(true);
        setError("");
        try {
            const response = await AlmacenService.getAlmacenById(id);
            return response;
        } catch (error) {
            setError("Error al obtener el almacen");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getAlmacenesBySucursal = async (sucursalId: number): Promise<AlmacenResponse[]> => {
        setLoading(true);
        setError("");
        try {
            const response = await AlmacenService.getAlmacenesBySucursal(sucursalId);
            return response;
        } catch (error) {
            setError("Error al obtener los almacenes por sucursal");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const createAlmacen = async (almacen: AlmacenRequest): Promise<AlmacenResponse> => {
        setLoading(true);
        setError("");
        try {
            const response = await AlmacenService.createAlmacen(almacen);
            return response;
        } catch (error) {
            setError("Error al crear el almacen");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateAlmacen = async (id: number, almacen: AlmacenRequest): Promise<AlmacenResponse> => {
        setLoading(true);
        setError("");
        try {
            const response = await AlmacenService.updateAlmacen(id, almacen);
            return response;
        } catch (error) {
            setError("Error al actualizar el almacen");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteAlmacen = async (id: number): Promise<void> => {
        setLoading(true);
        setError("");
        try {
            await AlmacenService.deleteAlmacen(id);
        } catch (error) {
            setError("Error al eliminar el almacen");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        getAlmacenes,
        getAlmacenById,
        getAlmacenesBySucursal,
        createAlmacen,
        updateAlmacen,
        deleteAlmacen,
        loading,
        error
    };
};
