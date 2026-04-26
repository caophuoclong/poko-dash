import { Controller } from "react-hook-form";
import type { Control } from "react-hook-form";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps<
  T extends Record<string, any> = Record<string, any>,
> {
  control: Control<T>;
  name: keyof T;
  label: string;
  options: SelectOption[];
}

export default function SelectField<
  T extends Record<string, any> = Record<string, any>,
>({ control, name, label, options }: SelectFieldProps<T>) {
  return (
    <div>
      <label
        htmlFor={name as string}
        className="block text-sm text-near-white mb-2 font-medium"
      >
        {label}
      </label>
      <Controller
        name={name as any}
        control={control}
        render={({ field }) => (
          <select
            id={name as string}
            {...field}
            className="w-full bg-surface-2 border border-frost rounded-lg px-4 py-2.5 text-sm text-near-white focus:outline-none focus:ring-2 focus:ring-accent-blue appearance-none"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      />
    </div>
  );
}
