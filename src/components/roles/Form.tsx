import { ActionTypeEnum } from "@/constant/action.enum";
import { useRoles } from "@/hooks/useRoles";
import { RolResponse } from "@/types/response/RolResponse";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { RefObject, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import InputTextComponent from "../common/InputTextComponent";

interface RolFormProps {
  rol: RolResponse | null;
  hideDialog: (updateData?: boolean) => void;
  toast: RefObject<Toast | null>;
  flagAction: number;
}

interface RolFormValues {
  id: number;
  nombre: string;
  descripcion: string;
}

export default function RolForm({
  rol,
  hideDialog,
  toast,
  flagAction,
}: RolFormProps) {
  const { createRol, updateRol } = useRoles();

  const {
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<RolFormValues>({
    defaultValues: {
      id: 0,
      nombre: "",
      descripcion: "",
    },
  });

  const initForm = async () => {
    if (flagAction == ActionTypeEnum.UPDATE && rol != null) {
      setValue("id", rol.id);
      setValue("nombre", rol.nombre);
      setValue("descripcion", rol.descripcion);
    }
  };

  const onSubmit = async () => {
    const values = getValues();
    const request: RolResponse = {
      id: values.id,
      nombre: values.nombre,
      descripcion: values.descripcion,
      permisosIds: rol?.permisosIds || [],
    };

    try {
      if (flagAction == ActionTypeEnum.CREATE) {
        await createRol(request);
        toast.current?.show({ severity: 'success', summary: 'Exitoso', detail: 'Rol creado', life: 3000 });
      } else if (flagAction == ActionTypeEnum.UPDATE) {
        await updateRol(values.id, request);
        toast.current?.show({ severity: 'success', summary: 'Exitoso', detail: 'Rol actualizado', life: 3000 });
      }
      hideDialog(true);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el rol', life: 3000 });
    }
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
        <div className="grid grid-cols-1 gap-4 mb-4">
          <div>
            <InputTextComponent
              control={control}
              name="nombre"
              placeholder="Ingrese el nombre"
              rules={{
                required: "Nombre requerido",
                maxLength: {
                  value: 50,
                  message: "Nombre debe tener maximo 50 caracteres",
                },
              }}
            />
          </div>
          <div>
            <InputTextComponent
              control={control}
              name="descripcion"
              placeholder="Ingrese la descripcion"
              rules={{
                required: "Descripcion requerida",
                maxLength: {
                  value: 200,
                  message: "Descripcion debe tener maximo 200 caracteres",
                },
              }}
            />
          </div>
        </div>
        <div className="flex flex-column gap-2">
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
      </form>
    </>
  );
}
