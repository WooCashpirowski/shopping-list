import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    const baseStyles = 'font-medium rounded-lg transition focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variantStyles = {
      primary: 'bg-gradient-to-t from-sky-500 to-indigo-500 text-white hover:from-blue-600 hover:to-blue-700',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      danger: 'bg-linear-65 from-red-500 to-pink-500 text-white hover:bg-red-600',
    };
    
    const sizeStyles = {
      sm: 'px-3 py-1 text-sm',
      md: 'px-3 py-2',
      lg: 'px-4 py-3',
    };
    
    const widthStyle = fullWidth ? 'w-full' : '';
    
    const combinedClassName = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`.trim();
    
    return (
      <button ref={ref} className={combinedClassName} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
