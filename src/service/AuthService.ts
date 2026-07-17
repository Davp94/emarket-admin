import { apiClient } from "@/config/ServiceConfig";
import { AuthRequest } from "@/types/request/AuthRequest";
import { AuthResponse } from "@/types/response/AuthResponse";
import { RolResponse } from "@/types/response/RolResponse";
import Cookies from "js-cookie";

export class AuthService {
    public static async login(authRequest: AuthRequest): Promise<AuthResponse> {
        try {
            const response = await apiClient.post<AuthResponse>('/auth/login', authRequest);
            Cookies.set('token', response.data.accessToken);
            Cookies.set('refreshToken', response.data.refreshToken);
            Cookies.set('identifier', response.data.identifier+"");
            Cookies.set('expiration', response.data.expiration+"");
            return response.data;
        } catch (error) {
            console.error('Error de autenticacion:', error);
            throw new Error('Error oautenticando al usuario');
        }
    }

    public static async logout() : Promise<void>{
        try {
            Cookies.remove('token');
            Cookies.remove('refreshToken');
            Cookies.remove('identifier');
            Cookies.remove('expiration');
        } catch (error) {
            console.error('Error al cerrar sesion:', error);
            throw new Error('Error cerrando sesion');
        }
    }

    public static async refreshToken(): Promise<AuthResponse>{
        try {
            const response = await apiClient.post<AuthResponse>(`/auth/refresh-token`, {},
                {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("refresh.token")}`
                    }
                }
            );
            Cookies.set('token', response.data.accessToken);
            Cookies.set('refreshToken', response.data.refreshToken);
            Cookies.set('expiration', response.data.expiration+"")
            return response.data; 
        } catch (error) {
            console.error('Error de autenticacion:', error);
            throw new Error('Error de autenticacion');
        }
    }

    public static isTokenExpired() {
        const expiration = Cookies.get('expiration');
        if(!expiration) return true;
        const expirationDate = new Date(expiration);
        return expirationDate < new Date();
    }


}