import { AuthService } from "@/service/AuthService";
import axios from "axios";
import Cookies from "js-cookie";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

apiClient.interceptors.response.use();