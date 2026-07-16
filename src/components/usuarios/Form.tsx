import { ActionTypeEnum } from "@/constant/action.enum";
import { RolResponse } from "@/types/response/RolResponse";
import { UsuarioResponse } from "@/types/response/UsuarioResponse";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { RefObject, useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import InputTextComponent from "../common/InputTextComponent";
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
  fechaNacimiento: string;
  genero: string;
  telefono: string;
  direccion: string;
  nacionalidad: string;
  roles: number[];
  documentos: any[];
}

export default function UsuariosForm({
  usuario,
  hideDialog,
  toast,
  flagAction,
}: UsuariosFormProps) {
  const [roles, setRoles] = useState<RolResponse[]>([]);
  const [totalSize, setTotalSize] = useState(0);
  const [filesSelected, setFilesSelected] = useState([]);
  const fileUploadRef = useRef<FileUpload>(null);
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

  const{ getAllRoles} = useRoles();

  const {
    control,
    formState: { errors },
    reset,
    setValue,
    getValues,
    watch,
  } = useForm<UsuarioFormValues>({
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
    const rolesResponse: RolResponse[] = await getAllRoles();
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

  //FILE MANAGEMENT

  const onTemplateSelect = (e: FileUploadSelectEvent) => {
    let _totalSize = totalSize;
    let files = e.files;
    setFilesSelected(files);
    for (let i = 0; i < files.length; i++) {
      _totalSize += files[i].size || 0;
    }

    setTotalSize(_totalSize);
  };

  const onTemplateUpload = (e: FileUploadUploadEvent) => {
    let _totalSize = 0;

    e.files.forEach((file) => {
      _totalSize += file.size || 0;
    });

    setTotalSize(_totalSize);
    toast.current?.show({
      severity: "info",
      summary: "Success",
      detail: "File Uploaded",
    });
  };

  const onTemplateRemove = (file: File, callback: Function) => {
    setTotalSize(totalSize - file.size);
    const filesCurrent = filesSelected.filter(f=>f==file);
    setFilesSelected(filesCurrent);
    callback();
  };

  const onTemplateClear = () => {
    setTotalSize(0);
    setFilesSelected([]);
  };

  const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue =
      fileUploadRef && fileUploadRef.current
        ? fileUploadRef.current.formatSize(totalSize)
        : "0 B";

    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {cancelButton}
        <div className="flex align-items-center gap-3 ml-auto">
          <span>{formatedValue} / 1 MB</span>
          <ProgressBar
            value={value}
            showValue={false}
            style={{ width: "10rem", height: "12px" }}
          ></ProgressBar>
        </div>
      </div>
    );
  };

  const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
    const file = inFile as File;
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: "40%" }}>
          // @ts-ignore
          <img
            alt={file.name}
            role="presentation"
            src={file.objectURL}
            width={100}
          />
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag
          value={props.formatSize}
          severity="warning"
          className="px-3 py-2"
        />
        <Button
          type="button"
          icon="pi pi-times"
          className="p-button-outlined p-button-rounded p-button-danger ml-auto"
          onClick={() => onTemplateRemove(file, props.onRemove)}
        />
      </div>
    );
  };

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i
          className="pi pi-image mt-3 p-5"
          style={{
            fontSize: "5em",
            borderRadius: "50%",
            backgroundColor: "var(--surface-b)",
            color: "var(--surface-d)",
          }}
        ></i>
        <span
          style={{ fontSize: "1.2em", color: "var(--text-color-secondary)" }}
          className="my-5"
        >
          Drag and Drop Image Here
        </span>
      </div>
    );
  };

  const chooseOptions = {
    icon: "pi pi-fw pi-images",
    iconOnly: true,
    className: "custom-choose-btn p-button-rounded p-button-outlined",
  };
  const uploadOptions = {
    icon: "pi pi-fw pi-cloud-upload",
    iconOnly: true,
    className:
      "custom-upload-btn p-button-success p-button-rounded p-button-outlined",
  };
  const cancelOptions = {
    icon: "pi pi-fw pi-times",
    iconOnly: true,
    className:
      "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined",
  };

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
                required: "Fecha de nacimiento requerido",
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
        </div>
        <div className="grid grid-cols-1">
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
              name="demo[]"
              url="/api/upload"
              multiple
              accept="image/*"
              maxFileSize={1000000}
              onUpload={onTemplateUpload}
              onSelect={onTemplateSelect}
              onError={onTemplateClear}
              onClear={onTemplateClear}
              headerTemplate={headerTemplate}
              itemTemplate={itemTemplate}
              emptyTemplate={emptyTemplate}
              chooseOptions={chooseOptions}
              uploadOptions={uploadOptions}
              cancelOptions={cancelOptions}
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
      </form>
    </>
  );
}
