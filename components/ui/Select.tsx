import { SelectHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: Array<{ value: string | number; label: string }>
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <select
          ref={ref}
          className={cn(
            'w-full px-4 py-2 border border-gray-300 rounded-lg',
            'focus:outline-none focus:ring-2 focus:ring-chefhub-orange focus:border-transparent',
            'transition-colors duration-200',
            'text-gray-900',
            'disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed',
            'appearance-none bg-white',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        {error && (
          <p className="text-red-500 text-sm mt-1 font-medium">{error}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'
