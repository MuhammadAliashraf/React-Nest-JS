import { forwardRef } from 'react';

/**
 * Reusable Input component
 * Supports label, error message, helper text, and icons.
 */
const Input = forwardRef(
  ({ label, error, helper, leftIcon: LeftIcon, rightIcon: RightIcon, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-300">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {LeftIcon && (
            <LeftIcon
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          )}
          <input
            ref={ref}
            className={`
              w-full rounded-lg border bg-gray-800 text-gray-100 placeholder-gray-500
              text-sm py-2 transition-all duration-150
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
              disabled:opacity-50 disabled:cursor-not-allowed
              ${error ? 'border-red-500' : 'border-gray-700 hover:border-gray-600'}
              ${LeftIcon ? 'pl-10' : 'pl-3'}
              ${RightIcon ? 'pr-10' : 'pr-3'}
              ${className}
            `}
            {...props}
          />
          {RightIcon && (
            <RightIcon
              size={16}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
          )}
        </div>
        {error && <p className="text-xs text-red-400">{error}</p>}
        {helper && !error && <p className="text-xs text-gray-500">{helper}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
