import { ActionTypeEnum } from "@/constant/action.enum";
import { RolResponse } from "@/types/response/RolResponse";
import { UsuarioResponse } from "@/types/response/UsuarioResponse";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { RefObject, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";

interface UsuariosFormProps {
    usuario: UsuarioResponse | null;
    hideDialog: (updateData?: boolean) => void;
    toast: RefObject<Toast | null>;
    flagAction: number;
}
export default function UsuariosForm ({
    usuario,
    hideDialog,
    toast, 
    flagAction
}: UsuariosFormProps){

    const [roles, setRoles] = useState<RolResponse[]>([]);
    const [nacionalidad, setNacionalidad] = useState<any[]>([
        {id: 1, label: 'Boliviana'},
        {id: 2, label: 'Ecuatoriana'},
        {id: 3, label: 'Mexicana'},
    ]);

    const [generos, setGeneros] = useState<any[]>([
        {id: 1, label: 'Masculino'},
        {id: 2, label: 'Femenino'},
        {id: 3, label: 'Otro'},
    ]);


    const {
        control,
        formState: { errors },
        reset,
        setValue,
        getValues,
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
        }
    });

    const initForm = async () => {
        //TODO call service
        const rolesResponse: RolResponse[] = [];
        setRoles(rolesResponse);
        if(usuario != null && flagAction == ActionTypeEnum.UPDATE) {
            setValue('id', usuario.id);
            setValue('correo', usuario.correo);
            setValue('nombres', usuario.nombres);
            setValue('apellidos', usuario.apellidos);
            setValue('fechaNacimiento', usuario.fechaNacimiento);
            setValue('telefono', usuario.telefono);
            setValue('direccion', usuario.direccion);
            setValue('nacionalidad', usuario.nacionalidad);
            setValue('roles', usuario.roles);
        }
    }

    const onSubmit = async () => {
        if(flagAction == ActionTypeEnum.CREATE) {
            //TODO call service create usuario
        } else if(flagAction == ActionTypeEnum.UPDATE) {
            //TODO call service update usuario
        }
        reset();

    };

    const closeForm = (updateData?: boolean) => {
        hideDialog(updateData ? updateData: false);
    }

    useEffect(()=> {
        initForm();
    }, []);
    return (
        <>
            <form className = "w-full mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <Controller
                            name="username"
                            control={control}
                            rules={{ required: "Username requerido" }}
                            render={({ field, fieldState }) => (
                                <>
                                <InputText id={field.name} {...field}/>
                                {fieldState.error && <small>{fieldState.error.message}</small>}
                                </>
                            )
                            }
                        />
                    </div>
                </div>
            </form>
        </>
    );
}