import { ActionTypeEnum } from "@/constant/action.enum";
import { useAlmacen } from "@/hooks/useAlmacen";
import { SucursalService } from "@/service/SucursalService";
import { AlmacenRequest } from "@/types/request/AlamcenRequest";
import { AlmacenResponse } from "@/types/response/AlmacenResponse";
import { SucursalResponse } from "@/types/response/SucursalResponse";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { RefObject, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputTextComponent from "../common/InputTextComponent";
import DropdownComponent from "../common/DropdownComponent";

interface AlmacenFormProps {
  almacen: AlmacenResponse | null;
  hideDialog: (updateData?: boolean) => void;
  toast: RefObject<Toast | null>;
  flagAction: number;
}

interface AlmacenFormValues {
  id: number;
  nombre: string;
  codigo: string;
  descripcion: string;
  direccion: string;
  telefono: string;
  ciudad: string;
  sucursalId: number;
}

export default function AlmacenForm({
  almacen,
  hideDialog,
  toast,
  flagAction,
}: AlmacenFormProps) {
  const [sucursales, setSucursales] = useState<SucursalResponse[]>([]);
  const { createAlmacen, updateAlmacen } = useAlmacen();

  const {
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
  } = useForm<AlmacenFormValues>({
    defaultValues: {
      id: 0,
      nombre: "",
      codigo: "",
      descripcion: "",
      direccion: "",
      telefono: "",
      ciudad: "",
      sucursalId: 0,
    },
  });

  const initForm = async () => {
    try {
      const data = await SucursalService.getSucursales();
      setSucursales(data);
    } catch (error) {
      console.error("Error al cargar las sucursales", error);
    }

    if (flagAction == ActionTypeEnum.UPDATE && almacen != null) {
      setValue("id", almacen.id);
      setValue("nombre", almacen.nombre);
      setValue("codigo", almacen.codigo);
      setValue("descripcion", almacen.descripcion);
      setValue("direccion", almacen.direccion);
      setValue("telefono", almacen.telefono);
      setValue("ciudad", almacen.ciudad);
      setValue("sucursalId", almacen.sucursalId);
    }
  };

  const onSubmit = async () => {
    const values = getValues();
    const request: AlmacenRequest = {
      nombre: values.nombre,
      codigo: values.codigo,
      descripcion: values.descripcion,
      direccion: values.direccion,
      telefono: values.telefono,
      ciudad: values.ciudad,
      sucursalId: values.sucursalId,
    };

    try {
      if (flagAction == ActionTypeEnum.CREATE) {
        await createAlmacen(request);
        toast.current?.show({ severity: 'success', summary: 'Exitoso', detail: 'Almacen creado', life: 3000 });
      } else if (flagAction == ActionTypeEnum.UPDATE) {
        await updateAlmacen(values.id, request);
        toast.current?.show({ severity: 'success', summary: 'Exitoso', detail: 'Almacen actualizado', life: 3000 });
      }
      hideDialog(true);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el almacen', life: 3000 });
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
              name="codigo"
              placeholder="Ingrese el codigo"
              rules={{
                required: "Codigo requerido",
                maxLength: {
                  value: 50,
                  message: "Codigo debe tener maximo 50 caracteres",
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
          <div>
            <DropdownComponent
              control={control}
              name="sucursalId"
              options={sucursales}
              optionLabel="nombre"
              optionValue="id"
              placeholder="Seleccione una sucursal"
              rules={{
                required: "Sucursal requerida",
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
