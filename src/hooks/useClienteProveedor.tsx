import { ClienteProveedorService } from "@/service/ClienteProveedorService";
import { ClienteProveedorResponse } from "@/types/response/ClienteProveedorResponse";
import { useState } from "react";

export const useClienteProveedor = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const getClientesProveedores = async (): Promise<ClienteProveedorResponse[]> => {
        setLoading(true);
        setError("");
        try {
            const response = await ClienteProveedorService.getClientesProveedores();
            return response;
        } catch (error) {
            setError("Error al obtener los clientes proveedores");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return {
        getClientesProveedores,
        loading,
        error
    };
};