import { UsuarioService } from "@/service/UsuarioService";
import { UsuarioRequest } from "@/types/request/UsuarioRequest";
import { UsuarioResponse } from "@/types/response/UsuarioResponse";
import { useState } from "react";

export const useUsuarios = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getUsuarios = async (): Promise<UsuarioResponse[]> => {
        setLoading(true);
        setError("");
        try {
            const response = await UsuarioService.getUsuarios();
            return response;
        } catch (error) {
            setError("Error al obtener los usuarios");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const getUsuarioById = async (id: number): Promise<UsuarioResponse> => {
        setLoading(true);
        setError("");
        try {
            const response = await UsuarioService.getUsuarioById(id);
            return response;
        } catch (error) {
            setError("Error al obtener el usuario");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const findUsuarioById = async (id: number): Promise<UsuarioResponse> => {
        return getUsuarioById(id);
    };

    const createUsuario = async (usuario: UsuarioRequest): Promise<UsuarioResponse> => {
        setLoading(true);
        setError("");
        try {
            const response = await UsuarioService.createUsuario(usuario);
            return response;
        } catch (error) {
            setError("Error al crear el usuario");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const updateUsuario = async (id: number, usuario: UsuarioRequest): Promise<UsuarioResponse> => {
        setLoading(true);
        setError("");
        try {
            const response = await UsuarioService.updateUsuario(id, usuario);
            return response;
        } catch (error) {
            setError("Error al actualizar el usuario");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const deleteUsuario = async (id: number): Promise<void> => {
        setLoading(true);
        setError("");
        try {
            await UsuarioService.deleteUsuario(id);
        } catch (error) {
            setError("Error al eliminar el usuario");
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return {
        getUsuarios,
        getUsuarioById,
        findUsuarioById,
        createUsuario,
        updateUsuario,
        deleteUsuario,
        loading,
        error
    };
};
