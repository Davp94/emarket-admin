export interface UsuarioResponse {
  id: number;
  username: string;
  correo: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: string;
  telefono: string | null;
  direccion: string;
}