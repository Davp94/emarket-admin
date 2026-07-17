export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  identifier: number;
  expiration: number;
}
