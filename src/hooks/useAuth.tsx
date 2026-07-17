import { AuthService } from "@/service/AuthService";
import { AuthRequest } from "@/types/request/AuthRequest";
import { useState } from "react";

export const useAuth = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const login = async (authRequest: AuthRequest) => {
        setLoading(true);
        setError("");
        try {
            const response = await AuthService.login(authRequest);
            return response;
        } catch (error) {
            setError("Error autenticando");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    const logout = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await AuthService.logout();
            return response;
        } catch (error) {
            setError("Error cerrando sesion");
            throw error;
        } finally {
            setLoading(false);
        }
    }

    return {
        login,
        logout,
        loading,
        error
    };
};