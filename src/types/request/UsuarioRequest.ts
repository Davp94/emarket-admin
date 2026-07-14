export interface UsuarioRequest {
    username: string;
    correo: string;
    password: string;
    nombres: string;
    apellidos: string;
    fechaNacimiento: string;
    genero: string;
    telefono: string | null;
    direccion: string;
    nacionalidad: string;
    roles: number[];
    documentos: any[];
}