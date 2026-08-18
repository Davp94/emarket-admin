import { useState } from "react";
import { NotaService } from "@/service/NotaService";
import { NotaRequest } from "@/types/request/NotaRequest";
import { NotaResponse } from "@/types/response/NotaResponse";

export const useNotas = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getNotas = async (): Promise<NotaResponse[]> => {
        setLoading(true);
        setError(null);
        try {
            const response = await NotaService.getNotas();
            return response;
        } catch (err) {
            setError("Error al obtener las notas");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getNotaById = async (id: number): Promise<NotaResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response = await NotaService.getNotaById(id);
            return response;
        } catch (err) {
            setError("Error al obtener la nota");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const createNota = async (nota: NotaRequest): Promise<NotaResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response = await NotaService.createNota(nota);
            return response;
        } catch (err) {
            setError("Error al crear la nota");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateNota = async (id: number, nota: NotaRequest): Promise<NotaResponse> => {
        setLoading(true);
        setError(null);
        try {
            const response = await NotaService.updateNota(id, nota);
            return response;
        } catch (err) {
            setError("Error al actualizar la nota");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteNota = async (id: number): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            await NotaService.deleteNota(id);
        } catch (err) {
            setError("Error al eliminar la nota");
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        getNotas,
        getNotaById,
        createNota,
        updateNota,
        deleteNota,
        loading,
        error
    };
};
