/* eslint-disable @typescript-eslint/no-empty-object-type */
import * as React from "react";
import { cn } from "@/lib/utils";
import { Label } from "@radix-ui/react-dropdown-menu";

export interface IInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  required?: boolean;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, IInputProps>(
  (
    { className, placeholder, type, onClick, required = false, label, ...rest },
    ref,
  ) => {
    return (
      <div className="flex flex-col gap-2">
        <Label>
          <div className="flex items-center gap-2">
            {label}
            {required && <span className="text-red-500">*</span>}
          </div>
        </Label>
        <input
          type={type}
          placeholder={placeholder || "Search"}
          className={cn(
            `flex  border-b-2 border-grey-300 bg-transparent
            p-2 px-3 text-sm text-grey-800 file:font-medium placeholder:text-grey-400
             hover:border-primary-400 focus:border-primary-400 focus:bg-transparent
            focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`,
            className,
          )}
          ref={ref}
          onClick={onClick}
          {...rest}
        />
      </div>
    );
  },
);
Input.displayName = "Input";

export default Input;
