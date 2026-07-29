'use client'
import { useRouter } from "next/navigation";
import { Button } from "primereact/button";

export default function NotasMain() {
  const router = useRouter();
  return (
    <>
      <Button label="Crear Nota" severity="success" onClick={() => router.push('notas/nueva-nota')}/>
    </>
  );
}