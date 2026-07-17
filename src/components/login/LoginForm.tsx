"use client"
import { useAuth } from "@/hooks/useAuth";
import { AuthRequest } from "@/types/request/AuthRequest";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { Toast } from "primereact/toast";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import InputTextComponent from "../common/InputTextComponent";
import InputPasswordComponent from "../common/InputPasswordComponent";
import { Button } from "primereact/button";

export default function LoginForm() {
  const {
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const router = useRouter();
  const { login } = useAuth();
  const toast = useRef<Toast>(null);
  const onSubmit = async () => {
    try {
      const authRequest: AuthRequest = getValues();
      const response = await login(authRequest);
      toast.current?.show({
        severity: "success",
        summary: "Login Exitoso",
        detail: "Bienvenido a Emarket: " + authRequest.username,
        life: 3000,
      });
      router.push("/");
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Error Login",
        detail: "Error al ingresar al sistema",
        life: 3000,
      });
    }
  };
  return (
    <>
      <Toast ref={toast} />
      <div className="flex items-center justify-center w-[500px] p-4">
        <Card
          className="w-full"
          title={
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">EMARKET ADMIN</h2>
            </div>
          }
          subTitle="Ingrese sus datos para acceder al sistema"
        >
          <div className="flex flex-col gap-4 p-fluid">
            <div>
              <InputTextComponent
                control={control}
                name="username"
                rules={{
                  required: "Correo requerido",
                }}
              />
            </div>
            <div>
              <InputPasswordComponent
                control={control}
                name="password"
                toggleMask={true}
                feedback={false}
                rules={{
                  required: "Password requerido",
                }}
              />
            </div>
            <Button
              label="Iniciar Sesion"
              icon="pi pi-sign-in"
              className="w-full"
              onClick={() => onSubmit()}
            />
          </div>
        </Card>
      </div>
    </>
  );
}
