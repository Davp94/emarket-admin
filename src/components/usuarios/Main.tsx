import { useState } from "react";

export function UsuariosMain() {

    const [usuarios, setUsuarios] = useState([]);
    return(
    <>
        <h1>Usuarios</h1>
        {usuarios.map((usuario: any) => (
            <div key={usuario.id}>
                <p>{usuario.name}</p>
                <p>{usuario.email}</p>
            </div>
        ))}
    </>)

}