'use client';

import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { Card } from "primereact/card";
import { useUsuarios } from "@/hooks/useUsuarios";
import { UsuarioResponse } from "@/types/response/UsuarioResponse";

export default function UserProfile() {
    const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
    const { findUsuarioById, loading, error } = useUsuarios();

    useEffect(() => {
        const loadUserProfile = async () => {
            const identifier = Cookies.get("identifier");

            if (!identifier) {
                return;
            }

            const userId = Number(identifier);

            if (Number.isNaN(userId)) {
                return;
            }

            try {
                const response = await findUsuarioById(userId);
                setUsuario(response);
            } catch (err) {
                console.error("Error al cargar el perfil del usuario", err);
            }
        };

        loadUserProfile();
    }, []);

    const renderField = (label: string, value: string | number | undefined | null) => {
        const displayValue = value ?? "No disponible";

        return (
            <div className="flex flex-col gap-1 border-b border-gray-200 py-2">
                <span className="text-sm font-semibold text-gray-600">{label}</span>
                <span className="text-sm text-gray-800">{displayValue}</span>
            </div>
        );
    };

    return (
        <Card title="Mi perfil" subTitle="Información del usuario autenticado">
            {loading && <p className="text-sm text-gray-500">Cargando perfil...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}

            {usuario && (
                <div className="grid gap-3 md:grid-cols-2">
                    {renderField("Usuario", usuario.username)}
                    {renderField("Nombres", usuario.nombres)}
                    {renderField("Apellidos", usuario.apellidos)}
                    {renderField("Correo", usuario.correo)}
                    {renderField("Teléfono", usuario.telefono)}
                    {renderField("Dirección", usuario.direccion)}
                    {renderField("Nacionalidad", usuario.nacionalidad)}
                    {renderField("Fecha de nacimiento", usuario.fechaNacimiento)}
                    {renderField("Género", usuario.genero)}
                    {renderField("Roles", usuario.roles.join(", "))}
                    {renderField("Documentos", usuario.documentos?.length ? usuario.documentos.map((doc) => `${doc.tipoDocumento ?? "Documento"}: ${doc.nombre ?? "Sin nombre"}`).join(" | ") : "Sin documentos")}
                </div>
            )}

            {!loading && !usuario && !error && (
                <p className="text-sm text-gray-500">No se encontró información del usuario.</p>
            )}
        </Card>
    );
}