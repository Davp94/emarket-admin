import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Control, Controller, RegisterOptions } from "react-hook-form";

interface InputTextAreaComponentProps {
  label?: string;
  placeholder?: string;
  name: string;
  control: any;
  rules?: RegisterOptions | null;
}

export default function InputTextAreaComponent({
  name,
  control,
  label,
  placeholder,
  rules
}: InputTextAreaComponentProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules ? rules : undefined}
      render={({ field, fieldState }) => (
        <>
          <InputTextarea id={field.name} placeholder={placeholder} {...field} />
          {fieldState.error && <small>{fieldState.error.message}</small>}
        </>
      )}
    />
  );
}
