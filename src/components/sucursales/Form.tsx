import { ActionTypeEnum } from "@/constant/action.enum";
import { useSucursal } from "@/hooks/useSucursal";
import { useRoles } from "@/hooks/useRoles";
import { SucursalRequest } from "@/types/request/SucursalRequest";
import { SucursalResponse } from "@/types/response/SucursalResponse";
import { UsuarioResponse } from "@/types/response/UsuarioResponse";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { RefObject, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputTextComponent from "../common/InputTextComponent";
import MultiSelectComponent from "../common/MultiSelectComponent";

interface SucursalFormProps {
  sucursal: SucursalResponse | null;
  hideDialog: (updateData?: boolean) => void;
  toast: RefObject<Toast | null>;
  flagAction: number;
}

interface SucursalFormValues {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  ciudad: string;
  usuariosIds: number[];
}

export default function SucursalForm({
  sucursal,
  hideDialog,
  toast,
  flagAction,
}: SucursalFormProps) {
  const [usuarios, setUsuarios] = useState<UsuarioResponse[]>([]);
  const { createSucursal, updateSucursal } = useSucursal();
  const { getAllRoles } = useRoles();

  const {
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<SucursalFormValues>({
    defaultValues: {
      id: 0,
      nombre: "",
      direccion: "",
      telefono: "",
      ciudad: "",
      usuariosIds: [],
    },
  });

  const initForm = async () => {
    if (flagAction == ActionTypeEnum.UPDATE && sucursal != null) {
      setValue("id", sucursal.id);
      setValue("nombre", sucursal.nombre);
      setValue("direccion", sucursal.direccion);
      setValue("telefono", sucursal.telefono);
      setValue("ciudad", sucursal.ciudad);
      setValue("usuariosIds", sucursal.usuariosIds);
    }
  };

  const onSubmit = async () => {
    const values = getValues();
    const request: SucursalRequest = {
      nombre: values.nombre,
      direccion: values.direccion,
      telefono: values.telefono,
      ciudad: values.ciudad,
      usuariosIds: values.usuariosIds,
    };

    try {
      if (flagAction == ActionTypeEnum.CREATE) {
        await createSucursal(request);
        toast.current?.show({ severity: 'success', summary: 'Exitoso', detail: 'Sucursal creada', life: 3000 });
      } else if (flagAction == ActionTypeEnum.UPDATE) {
        await updateSucursal(values.id, request);
        toast.current?.show({ severity: 'success', summary: 'Exitoso', detail: 'Sucursal actualizada', life: 3000 });
      }
      hideDialog(true);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar la sucursal', life: 3000 });
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <InputTextComponent
              control={control}
              name="nombre"
              placeholder="Ingrese el nombre"
              rules={{
                required: "Nombre requerido",
                maxLength: {
                  value: 100,
                  message: "Nombre debe tener maximo 100 caracteres",
                },
              }}
            />
          </div>
          <div>
            <InputTextComponent
              control={control}
              name="ciudad"
              placeholder="Ingrese la ciudad"
              rules={{
                required: "Ciudad requerida",
                maxLength: {
                  value: 100,
                  message: "Ciudad debe tener maximo 100 caracteres",
                },
              }}
            />
          </div>
          <div>
            <InputTextComponent
              control={control}
              name="direccion"
              placeholder="Ingrese la direccion"
              rules={{
                required: "Direccion requerida",
                maxLength: {
                  value: 200,
                  message: "Direccion debe tener maximo 200 caracteres",
                },
              }}
            />
          </div>
          <div>
            <InputTextComponent
              control={control}
              name="telefono"
              placeholder="Ingrese el telefono"
              rules={{
                required: "Telefono requerido",
                maxLength: {
                  value: 20,
                  message: "Telefono debe tener maximo 20 caracteres",
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
