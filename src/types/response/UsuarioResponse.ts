export interface UsuarioResponse {
  id: number;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  direccion: string;
  nacionalidad: string;
  fechaNacimiento: string;
  roles: number[];
  documentos: any[];
}