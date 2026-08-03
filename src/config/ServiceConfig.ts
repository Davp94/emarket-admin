import { AuthService } from "@/service/AuthService";
import { rejects } from "assert";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

let isRefreshing = false;
let failedQueue: any[] = [];
const processQueue = (error: Error | null, token: string) => {
    failedQueue.forEach(({resolve, reject}) => {
        if(error){
            reject(error);
        }else {
            resolve(token);
        }
    });
    failedQueue = [];
}
export const apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
    },
})

apiClient.interceptors.request.use(
    async (config: any) => {
        let token = Cookies.get('token');
        if (token && AuthService.isTokenExpired()) {
            try {
                token = (await apiClient.post('/auth/refresh-token')).data.token;
            } catch (error) {
                throw new Error('Error refrescando el token')
            }
        } else {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    }
)

apiClient.interceptors.response.use(
    async (response: any) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig;
        if(error.response?.status === 401&&!originalRequest?.url?.includes("/auth/refresh-token")
        &&!originalRequest?.url?.includes("/auth/login"))
        {
            if(isRefreshing){
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve: (token:string) => {
                            originalRequest!.headers.Authorization = `Bearer ${token}`;
                            resolve(apiClient(originalRequest))
                        }
                    })
                });
            }
            isRefreshing = true;

            try {
                const refreshToken = await AuthService.refreshToken();
                const newToken = refreshToken.accessToken;
                processQueue(null, newToken);
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return apiClient(originalRequest);
            } catch (error) {
                await AuthService.logout();
                if(typeof window != 'undefined'){
                    window.location.href = '/login'
                }
                return Promise.reject(error);
            } finally {
                isRefreshing = false;
            }
        }
        return Promise.reject(error);
    }
);
