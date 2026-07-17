import { Password } from "primereact/password";
import { Control, Controller, RegisterOptions } from "react-hook-form";

interface InputPasswordComponentProps {
    label?: string;
    placeholder?: string;
    name: string;
    control: any;
    rules?: RegisterOptions | null;
    toggleMask?: boolean;
    feedback?: boolean;
}

export default function InputPasswordComponent({
    label,
    placeholder,
    name,
    control,
    rules,
    toggleMask,
    feedback
}: InputPasswordComponentProps) {
    return (
        <Controller
            name={name}
            control={control}
            rules={rules ? rules : undefined}
            render={({ field, fieldState }) => (
                <>
                    <Password 
                    id={field.name} 
                    placeholder={placeholder}
                    feedback={feedback}
                    toggleMask={toggleMask} 
                    {...field} />
                    {fieldState.error && <small>{fieldState.error.message}</small>}
                </>
            )}
        />
    );
}
