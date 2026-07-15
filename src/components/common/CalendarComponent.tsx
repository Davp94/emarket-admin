import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Control, Controller, RegisterOptions } from "react-hook-form";

interface CalendarComponentProps {
  label?: string;
  placeholder?: string;
  name: string;
  control: Control<any>;
  rules: RegisterOptions | null;
  dateFormat?: string;
  minDate?: Date;
  maxDate?: Date;
}

export default function CalendarComponent({
  name,
  control,
  label,
  placeholder,
  rules,
  dateFormat,
  minDate,
  maxDate
}: CalendarComponentProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules ? rules : undefined}
      render={({ field, fieldState }) => (
        <>
          <Calendar 
          id={field.name} 
          placeholder={placeholder} 
          {...field} 
          dateFormat={dateFormat}
          minDate={minDate}
          maxDate={maxDate}
          />
          {fieldState.error && <small>{fieldState.error.message}</small>}
        </>
      )}
    />
  );
}
