import { RolService } from "@/service/RolService";
import { RolResponse } from "@/types/response/RolResponse";
import { useState } from "react";

export const useRoles = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const getAllRoles = async (): Promise<RolResponse[]> => {
        setLoading(true);
        setError("");
        try {
            const response = await RolService.getRoles();
            return response;
        } catch (error) {
            setError("Error al obtener los roles");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const getRolById = async (id: number): Promise<RolResponse> => {
        setLoading(true);
        setError("");
        try {
            const response = await RolService.getRolById(id);
            return response;
        } catch (error) {
            setError("Error al obtener el rol");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const createRol = async (rol: RolResponse): Promise<RolResponse> => {
        setLoading(true);
        setError("");
        try {
            const response = await RolService.createRol(rol);
            return response;
        } catch (error) {
            setError("Error al crear el rol");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const updateRol = async (id: number,rol: RolResponse): Promise<RolResponse> => {
        setLoading(true);
        setError("");
        try {
            const response = await RolService.updateRol(id, rol);
            return response;
        } catch (error) {
            setError("Error al actualizar el rol");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const deleteRol = async (id: number): Promise<void> => {
        setLoading(true);
        setError("");
        try {
            await RolService.deleteRol(id);
        } catch (error) {
            setError("Error al eliminar el rol");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return {
        getAllRoles,
        getRolById,
        createRol,
        updateRol,
        deleteRol,
        loading,
        error
    };
};