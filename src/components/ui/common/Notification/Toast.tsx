import { toast } from 'react-hot-toast';
import { Check, X, AlertCircle, Info } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastOptions {
  duration?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

const icons = {
  success: <Check className="h-4 w-4 text-green-500" />,
  error: <X className="h-4 w-4 text-red-500" />,
  warning: <AlertCircle className="h-4 w-4 text-yellow-500" />,
  info: <Info className="h-4 w-4 text-blue-500" />
};

export const showToast = (
  message: string,
  type: ToastType = 'info',
  options: ToastOptions = {}
) => {
  const { duration = 3000, position = 'top-right' } = options;

  return toast(message, {
    duration,
    position,
    icon: icons[type],
    className: cn(
      'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100',
      'border border-gray-200 dark:border-gray-700',
      'shadow-lg rounded-lg p-4'
    )
  });
};