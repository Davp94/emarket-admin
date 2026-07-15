import { ActionTypeEnum } from "@/constant/action.enum";
import { RolResponse } from "@/types/response/RolResponse";
import { UsuarioResponse } from "@/types/response/UsuarioResponse";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { RefObject, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputTextComponent from "../common/InputTextComponent";
import { Button } from "primereact/button";
import InputPasswordComponent from "../common/InputPasswordComponent";
import CalendarComponent from "../common/CalendarComponent";
import DropdownComponent from "../common/DropdownComponent";
import MultiSelectComponent from "../common/MultiSelectComponent";

interface UsuariosFormProps {
  usuario: UsuarioResponse | null;
  hideDialog: (updateData?: boolean) => void;
  toast: RefObject<Toast | null>;
  flagAction: number;
}
export default function UsuariosForm({
  usuario,
  hideDialog,
  toast,
  flagAction,
}: UsuariosFormProps) {
  const [roles, setRoles] = useState<RolResponse[]>([]);
  const [nacionalidad, setNacionalidad] = useState<any[]>([
    { id: 1, label: "Boliviana" },
    { id: 2, label: "Ecuatoriana" },
    { id: 3, label: "Mexicana" },
  ]);

  const [generos, setGeneros] = useState<any[]>([
    { id: 1, label: "Masculino" },
    { id: 2, label: "Femenino" },
    { id: 3, label: "Otro" },
  ]);

  const {
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm({
    defaultValues: {
      id: 0,
      username: "",
      correo: "",
      password: "",
      nombres: "",
      apellidos: "",
      fechaNacimiento: "",
      genero: "",
      telefono: "",
      direccion: "",
      nacionalidad: "",
      roles: [0],
      documentos: [],
    },
  });

  const initForm = async () => {
    //TODO call service
    const rolesResponse: RolResponse[] = [];
    setRoles(rolesResponse);
    if (usuario != null && flagAction == ActionTypeEnum.UPDATE) {
      setValue("id", usuario.id);
      setValue("correo", usuario.correo);
      setValue("nombres", usuario.nombres);
      setValue("apellidos", usuario.apellidos);
      setValue("fechaNacimiento", usuario.fechaNacimiento);
      setValue("telefono", usuario.telefono);
      setValue("direccion", usuario.direccion);
      setValue("nacionalidad", usuario.nacionalidad);
      setValue("roles", usuario.roles);
    }
  };

  const onSubmit = async () => {
    console.log(getValues());
    if (flagAction == ActionTypeEnum.CREATE) {
      //TODO call service create usuario
    } else if (flagAction == ActionTypeEnum.UPDATE) {
      //TODO call service update usuario
    }
    // reset();
  };

  const closeForm = (updateData?: boolean) => {
    hideDialog(updateData ? updateData : false);
  };

  useEffect(() => {
    initForm();
  }, []);
  return (
    <>
      <form className="w-full mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Controller
              name="username"
              control={control}
              rules={{
                required: "Username requerido",
                maxLength: {
                  value: 50,
                  message: "Username debe tener maximo 50 caracteres",
                },
              }}
              render={({ field, fieldState }) => (
                <>
                  <InputText
                    id={field.name}
                    placeholder="Ingrese el nombre de usuario"
                    {...field}
                  />
                  {fieldState.error && (
                    <small>{fieldState.error.message}</small>
                  )}
                </>
              )}
            />
          </div>
          <div>
            <InputTextComponent
              control={control}
              name="correo"
              rules={{
                required: "Correo requerido",
                pattern: { value: /^\S+@\S+$/i, message: "Correo no valido" },
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
                pattern: {
                  value:
                    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^a-zA-Z0-9]).{8,16}$/,
                  message:
                    "La contraseña debe tener entre 8 y 16 caracteres, e incluir al menos una letra mayúscula, una minúscula, un número y un carácter especial.",
                },
              }}
            />
          </div>
          <div>
            <InputTextComponent
              control={control}
              name="nombres"
              rules={{
                required: "Nombres requerido",
                maxLength: {
                  value: 100,
                  message: "Nombres debe tener maximo 100 caracteres",
                },
              }}
            />
          </div>
          <div>
            <InputTextComponent
              control={control}
              name="apellidos"
              rules={{
                required: "Apellidos requerido",
                maxLength: {
                  value: 100,
                  message: "Apellidos debe tener maximo 100 caracteres",
                },
              }}
            />
          </div>
          <div>
            <CalendarComponent
              control={control}
              name="fechaNacimiento"
              rules={{
                required: "Fecha de nacimiento requerido"
              }}
              dateFormat="dd/mm/yy"
            />
          </div>
           <div>
            <DropdownComponent
              control={control}
              name="nacionalidad"
              rules={{
                maxLength: {
                  value: 50,
                  message: "Nacionalidad debe tener maximo 50 caracteres",
                },
              }}
              options={nacionalidad}
              optionLabel="label"
              optionValue="label"    
            />
          </div>
          <div>
            <DropdownComponent
              control={control}
              name="genero"
              options={generos}
              optionLabel="label"
              optionValue="label"    
            />
          </div>
          <div>
            <MultiSelectComponent
              control={control}
              name="roles"
              options={roles}
              optionLabel="nombre"
              optionValue="id"    
            />
          </div>
          <div>
            <Button
              type="button"
              label="Cancelar"
              severity="danger"
              className="w-full"
              onClick={() => closeForm()}
            />
            <Button
              type="button"
              label="Guardar"
              className="w-full"
              onClick={() => onSubmit()}
            />
          </div>
        </div>
      </form>
    </>
  );
}
