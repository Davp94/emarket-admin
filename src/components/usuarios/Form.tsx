import { ActionTypeEnum } from "@/constant/action.enum";
import { RolResponse } from "@/types/response/RolResponse";
import { UsuarioResponse } from "@/types/response/UsuarioResponse";
import { Toast } from "primereact/toast";
import { RefObject, useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import InputTextComponent from "../common/InputTextComponent";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import InputPasswordComponent from "../common/InputPasswordComponent";
import CalendarComponent from "../common/CalendarComponent";
import DropdownComponent from "../common/DropdownComponent";
import MultiSelectComponent from "../common/MultiSelectComponent";
import { Tooltip } from "primereact/tooltip";
import { FileUpload, FileUploadHeaderTemplateOptions, FileUploadSelectEvent, FileUploadUploadEvent, ItemTemplateOptions } from "primereact/fileupload";
import { ProgressBar } from "primereact/progressbar";
import { Tag } from "primereact/tag";
import { useRoles } from "@/hooks/useRoles";
import { useUsuarios } from "@/hooks/useUsuarios";
import { UsuarioRequest } from "@/types/request/UsuarioRequest";
import { DocumentoRequest } from "@/types/request/DocumentoRequest";

interface UsuariosFormProps {
  usuario: UsuarioResponse | null;
  hideDialog: (updateData?: boolean) => void;
  toast: RefObject<Toast | null>;
  flagAction: number;
}

interface UsuarioFormValues {
  id: number;
  username: string;
  correo: string;
  password: string;
  nombres: string;
  apellidos: string;
  fechaNacimiento: Date | string | null;
  genero: string;
  telefono: string;
  direccion: string;
  nacionalidad: string;
  roles: number[];
}

interface FileDocumentItem {
  file: File;
  detalle: string;
  tipo: string;
}

export default function UsuariosForm({
  usuario,
  hideDialog,
  toast,
  flagAction,
}: UsuariosFormProps) {
  const [roles, setRoles] = useState<RolResponse[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [fileDocuments, setFileDocuments] = useState<FileDocumentItem[]>([]);
  const fileUploadRef = useRef<FileUpload>(null);

  const [nacionalidad] = useState<any[]>([
    { id: 1, label: "Boliviana" },
    { id: 2, label: "Ecuatoriana" },
    { id: 3, label: "Mexicana" },
  ]);

  const [generos] = useState<any[]>([
    { id: 1, label: "Masculino" },
    { id: 2, label: "Femenino" },
    { id: 3, label: "Otro" },
  ]);

  const { getAllRoles } = useRoles();
  const { createUsuario, updateUsuario } = useUsuarios();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
  } = useForm<UsuarioFormValues>({
    defaultValues: {
      id: 0,
      username: "",
      correo: "",
      password: "",
      nombres: "",
      apellidos: "",
      fechaNacimiento: null,
      genero: "",
      telefono: "",
      direccion: "",
      nacionalidad: "",
      roles: [],
    },
  });

  const initForm = async () => {
    try {
      const rolesResponse: RolResponse[] = await getAllRoles();
      setRoles(rolesResponse || []);
    } catch (err) {
      console.error("Error loading roles:", err);
    }

    if (usuario != null && flagAction === ActionTypeEnum.UPDATE) {
      setValue("id", usuario.id);
      setValue("username", usuario.username || "");
      setValue("correo", usuario.correo || "");
      setValue("nombres", usuario.nombres || "");
      setValue("apellidos", usuario.apellidos || "");
      setValue("fechaNacimiento", usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento) : null);
      setValue("genero", usuario.genero || "");
      setValue("telefono", usuario.telefono || "");
      setValue("direccion", usuario.direccion || "");
      setValue("nacionalidad", usuario.nacionalidad || "");
      setValue("roles", usuario.roles || []);
      setValue("password", "");
    } else {
      setFileDocuments([]);
      setTotalSize(0);
      reset({
        id: 0,
        username: "",
        correo: "",
        password: "",
        nombres: "",
        apellidos: "",
        fechaNacimiento: null,
        genero: "",
        telefono: "",
        direccion: "",
        nacionalidad: "",
        roles: [],
      });
    }
  };

  const onSubmit = async (values: UsuarioFormValues) => {
    let formattedFecha = "";
    if (values.fechaNacimiento) {
      if (values.fechaNacimiento instanceof Date) {
        formattedFecha = values.fechaNacimiento.toISOString().split("T")[0];
      } else {
        formattedFecha = String(values.fechaNacimiento);
      }
    }

    const documentos: DocumentoRequest[] = fileDocuments.map((item) => ({
      tipo: item.tipo || item.file.type || "documento",
      archivo: item.file,
      detalle: item.detalle,
    }));

    const request: UsuarioRequest = {
      username: values.username,
      correo: values.correo,
      password: values.password,
      nombres: values.nombres,
      apellidos: values.apellidos,
      fechaNacimiento: formattedFecha,
      genero: values.genero,
      telefono: values.telefono || null,
      direccion: values.direccion,
      nacionalidad: values.nacionalidad,
      roles: values.roles || [],
      documentos: documentos,
    };

    try {
      if (flagAction === ActionTypeEnum.CREATE) {
        await createUsuario(request);
        toast.current?.show({ severity: 'success', summary: 'Exitoso', detail: 'Usuario creado', life: 3000 });
      } else if (flagAction === ActionTypeEnum.UPDATE) {
        await updateUsuario(values.id, request);
        toast.current?.show({ severity: 'success', summary: 'Exitoso', detail: 'Usuario actualizado', life: 3000 });
      }
      hideDialog(true);
    } catch (error) {
      toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Error al guardar el usuario', life: 3000 });
    }
  };

  const closeForm = (updateData?: boolean) => {
    hideDialog(updateData ? updateData : false);
  };

  useEffect(() => {
    initForm();
  }, [usuario, flagAction]);

  // FILE MANAGEMENT

  const onTemplateSelect = (e: FileUploadSelectEvent) => {
    let _totalSize = 0;
    const selectedFiles = Array.from(e.files);

    const updatedDocItems: FileDocumentItem[] = selectedFiles.map((file) => {
      const existing = fileDocuments.find(
        (doc) => doc.file === file || (doc.file.name === file.name && doc.file.size === file.size)
      );
      return (
        existing || {
          file: file,
          detalle: file.name,
          tipo: file.type || "documento",
        }
      );
    });

    setFileDocuments(updatedDocItems);
    _totalSize = selectedFiles.reduce((acc, file) => acc + (file.size || 0), 0);
    setTotalSize(_totalSize);
  };

  const handleDetalleChange = (file: File, newDetalle: string) => {
    setFileDocuments((prev) =>
      prev.map((item) =>
        item.file === file || (item.file.name === file.name && item.file.size === file.size)
          ? { ...item, detalle: newDetalle }
          : item
      )
    );
  };

  const onTemplateRemove = (file: File, callback: Function) => {
    setTotalSize((prev) => Math.max(0, prev - (file.size || 0)));
    setFileDocuments((prev) =>
      prev.filter((item) => item.file !== file && (item.file.name !== file.name || item.file.size !== file.size))
    );
    if (typeof callback === "function") {
      callback();
    }
  };

  const onTemplateClear = () => {
    setTotalSize(0);
    setFileDocuments([]);
  };

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const { className, chooseButton, cancelButton } = options;
    const value = Math.min(100, (totalSize / 1000000) * 100);
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

    return (
      <div
        className={`${className} flex items-center justify-between gap-3 p-3 bg-transparent`}
      >
        <div className="flex items-center gap-2">
          {chooseButton}
          {cancelButton}
        </div>
        <div className="flex items-center gap-3 ml-auto">
          <span className="text-sm font-medium">{formatedValue} / 1 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "8rem", height: "10px" }}
          ></ProgressBar>
        </div>
      </div>
    );
  };

  const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
    const file = inFile as any;
    const objectURL =
      file.objectURL ||
      (file instanceof File ? URL.createObjectURL(file) : file.archivo || "");

    const docItem = fileDocuments.find(
      (item) => item.file === file || (item.file.name === file.name && item.file.size === file.size)
    );
    const detalleValue = docItem ? docItem.detalle : file.name || "";

    return (
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 border-b border-gray-200 gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1 w-full">
          {objectURL ? (
            <img
              alt={file.name || "imagen"}
              role="presentation"
              src={objectURL}
              className="w-14 h-14 object-cover rounded border flex-shrink-0"
            />
          ) : (
            <div className="w-14 h-14 bg-gray-100 rounded border flex items-center justify-center flex-shrink-0">
              <i className="pi pi-file text-xl text-gray-400" />
            </div>
          )}
          <div className="flex flex-col flex-1 min-w-0 gap-1">
            <span className="font-medium text-gray-800 text-sm truncate">
              {file.name}
            </span>
            <div className="flex items-center gap-2 w-full mt-1">
              <span className="text-xs text-gray-600 font-semibold flex-shrink-0">
                Detalle:
              </span>
              <InputText
                value={detalleValue}
                onChange={(e) => handleDetalleChange(file, e.target.value)}
                placeholder="Ingrese detalle del documento"
                className="p-inputtext-sm text-xs py-1 px-2 w-full max-w-sm"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 self-end sm:self-center">
          <Tag
            value={props.formatSize}
            severity="warning"
            className="px-2 py-1 text-xs"
          />
          <Button
            type="button"
            icon="pi pi-times"
            severity="danger"
            rounded
            outlined
            onClick={() => onTemplateRemove(file, props.onRemove)}
          />
        </div>
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <i className="pi pi-image p-4 mb-2 text-4xl rounded-full bg-gray-100 text-gray-400"></i>
        <span className="text-sm text-gray-600 font-medium">
          Arrastra y suelta imágenes aquí
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <InputTextComponent
              control={control}
              name="username"
              placeholder="Ingrese el nombre de usuario"
              rules={{
                required: "Username requerido",
                maxLength: {
                  value: 50,
                  message: "Username debe tener máximo 50 caracteres",
                },
              }}
            />
          </div>
          <div>
            <InputTextComponent
              control={control}
              name="correo"
              placeholder="Ingrese el correo"
              rules={{
                required: "Correo requerido",
                pattern: { value: /^\S+@\S+$/i, message: "Correo no válido" },
              }}
            />
          </div>
          <div>
            <InputPasswordComponent
              control={control}
              name="password"
              placeholder="Ingrese la contraseña"
              toggleMask={true}
              feedback={false}
              rules={
                flagAction === ActionTypeEnum.CREATE
                  ? {
                      required: "Password requerido",
                      pattern: {
                        value:
                          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z0-9]).{8,16}$/,
                        message:
                          "La contraseña debe tener entre 8 y 16 caracteres, e incluir al menos una letra mayúscula, una minúscula, un número y un carácter especial.",
                      },
                    }
                  : undefined
              }
            />
          </div>
          <div>
            <InputTextComponent
              control={control}
              name="nombres"
              placeholder="Ingrese los nombres"
              rules={{
                required: "Nombres requerido",
                maxLength: {
                  value: 100,
                  message: "Nombres debe tener máximo 100 caracteres",
                },
              }}
            />
          </div>
          <div>
            <InputTextComponent
              control={control}
              name="apellidos"
              placeholder="Ingrese los apellidos"
              rules={{
                required: "Apellidos requerido",
                maxLength: {
                  value: 100,
                  message: "Apellidos debe tener máximo 100 caracteres",
                },
              }}
            />
          </div>
          <div>
            <InputTextComponent
              control={control}
              name="telefono"
              placeholder="Ingrese el teléfono"
              rules={{
                maxLength: {
                  value: 20,
                  message: "Teléfono debe tener máximo 20 caracteres",
                },
              }}
            />
          </div>
          <div>
            <InputTextComponent
              control={control}
              name="direccion"
              placeholder="Ingrese la dirección"
              rules={{
                maxLength: {
                  value: 200,
                  message: "Dirección debe tener máximo 200 caracteres",
                },
              }}
            />
          </div>
          <div>
            <CalendarComponent
              control={control}
              name="fechaNacimiento"
              placeholder="Fecha de nacimiento"
              rules={{
                required: "Fecha de nacimiento requerida",
              }}
              dateFormat="yy-mm-dd"
            />
          </div>
          <div>
            <DropdownComponent
              control={control}
              name="nacionalidad"
              placeholder="Seleccione nacionalidad"
              rules={{
                maxLength: {
                  value: 50,
                  message: "Nacionalidad debe tener máximo 50 caracteres",
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
              placeholder="Seleccione género"
              options={generos}
              optionLabel="label"
              optionValue="label"
            />
          </div>
          <div>
            <MultiSelectComponent
              control={control}
              name="roles"
              placeholder="Seleccione roles"
              options={roles}
              optionLabel="nombre"
              optionValue="id"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 mb-4">
          <Tooltip
            target=".custom-choose-btn"
            content="Choose"
            position="bottom"
          />
          <Tooltip
            target=".custom-cancel-btn"
            content="Clear"
            position="bottom"
          />

          <FileUpload
            ref={fileUploadRef}
            name="documentos[]"
            multiple
            accept="image/*"
            maxFileSize={1000000}
            customUpload
            onSelect={onTemplateSelect}
            onError={onTemplateClear}
            onClear={onTemplateClear}
            headerTemplate={headerTemplate}
            itemTemplate={itemTemplate}
            emptyTemplate={emptyTemplate}
            chooseOptions={chooseOptions}
            cancelOptions={cancelOptions}
          />
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            label="Cancelar"
            severity="danger"
            className="w-full"
            onClick={() => closeForm()}
          />
          <Button
            type="submit"
            label="Guardar"
            className="w-full"
          />
        </div>
      </form>
    </>
  );
}
