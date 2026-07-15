import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Control, Controller, RegisterOptions } from "react-hook-form";

interface DropdownComponentProps {
  label?: string;
  placeholder?: string;
  name: string;
  control: Control<any>;
  rules: RegisterOptions | null;
  options: any[];
  optionLabel?: string;
  optionValue?: string;
}

export default function DropdownComponent({
  name,
  control,
  label,
  placeholder,
  rules,
  options,
  optionLabel,
  optionValue
}: DropdownComponentProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules ? rules : undefined}
      render={({ field, fieldState }) => (
        <>
          <Dropdown 
            id={field.name} 
            placeholder={placeholder} 
            {...field} 
            options={options}
            optionLabel={optionLabel}
            optionValue={optionValue}
          />
          {fieldState.error && <small>{fieldState.error.message}</small>}
        </>
      )}
    />
  );
}
