import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { MultiSelect } from "primereact/multiselect";
import { Control, Controller, RegisterOptions } from "react-hook-form";

interface MultiSelectComponentProps {
  label?: string;
  placeholder?: string;
  name: string;
  control: Control<any>;
  rules: RegisterOptions | null;
  options: any[];
  optionLabel?: string;
  optionValue?: string;
  maxSelectedLabels?: number;
  display?: 'comma' | 'chip'
}

export default function MultiSelectComponent({
  name,
  control,
  label,
  placeholder,
  rules,
  options,
  optionLabel,
  optionValue,
  maxSelectedLabels,
  display
}: MultiSelectComponentProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules ? rules : undefined}
      render={({ field, fieldState }) => (
        <>
          <MultiSelect 
            id={field.name} 
            placeholder={placeholder} 
            {...field} 
            options={options}
            optionLabel={optionLabel}
            optionValue={optionValue}
            maxSelectedLabels={maxSelectedLabels}
            display={display}
          />
          {fieldState.error && <small>{fieldState.error.message}</small>}
        </>
      )}
    />
  );
}
