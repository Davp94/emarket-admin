import { InputText } from "primereact/inputtext";
import { Control, Controller, RegisterOptions } from "react-hook-form";

interface InputTextComponentProps {
  label?: string;
  placeholder?: string;
  name: string;
  control: any;
  rules?: RegisterOptions | null;
}

export default function InputTextComponent({
  name,
  control,
  label,
  placeholder,
  rules
}: InputTextComponentProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules ? rules : undefined}
      render={({ field, fieldState }) => (
        <>
          <InputText id={field.name} placeholder={placeholder} {...field} />
          {fieldState.error && <small>{fieldState.error.message}</small>}
        </>
      )}
    />
  );
}
