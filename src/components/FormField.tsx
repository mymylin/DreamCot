interface FormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'email' | 'password' | 'search' | 'color';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  required?: boolean;
  hasError?: boolean;
  autoComplete?: string;
}

export function FormField({
  id, label, type = 'text', value, onChange,
  placeholder, hint, required = false, hasError = false, autoComplete,
}: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-[#733D26] mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
        aria-required={required}
        aria-invalid={hasError}
        aria-describedby={hint ? `${id}-hint` : undefined}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB6C1] focus:border-transparent min-h-[44px] bg-white"
      />
      {hint && (
        <p id={`${id}-hint`} className="text-sm text-gray-500 mt-1">
          {hint}
        </p>
      )}
    </div>
  );
}
