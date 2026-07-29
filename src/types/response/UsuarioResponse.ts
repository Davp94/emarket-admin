  import { DocumentoResponse } from "./DocumentoResponse";

export interface UsuarioResponse {
  id: number;
  username: string;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono: string;
  direccion: string;
  nacionalidad: string;
  fechaNacimiento: string;
  genero: string;
  roles: number[];
  documentos: DocumentoResponse[];
}