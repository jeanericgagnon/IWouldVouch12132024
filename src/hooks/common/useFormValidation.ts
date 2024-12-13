import { useState, useCallback } from 'react';
import { z } from 'zod';

interface ValidationOptions<T> {
  schema: z.ZodSchema<T>;
  onSuccess?: (values: T) => void;
  onError?: (errors: z.ZodError) => void;
}

export function useFormValidation<T extends Record<string, any>>(
  options: ValidationOptions<T>
) {
  const { schema, onSuccess, onError } = options;
  const [errors, setErrors] = useState<Record<keyof T, string[]>>({} as Record<keyof T, string[]>);

  const validate = useCallback(
    (values: T) => {
      try {
        const validatedData = schema.parse(values);
        setErrors({} as Record<keyof T, string[]>);
        onSuccess?.(validatedData);
        return true;
      } catch (error) {
        if (error instanceof z.ZodError) {
          const formattedErrors = error.errors.reduce((acc, err) => {
            const path = err.path[0] as keyof T;
            if (!acc[path]) acc[path] = [];
            acc[path].push(err.message);
            return acc;
          }, {} as Record<keyof T, string[]>);
          
          setErrors(formattedErrors);
          onError?.(error);
        }
        return false;
      }
    },
    [schema, onSuccess, onError]
  );

  const getFieldError = useCallback(
    (field: keyof T) => errors[field]?.[0],
    [errors]
  );

  const clearErrors = useCallback(() => {
    setErrors({} as Record<keyof T, string[]>);
  }, []);

  return {
    errors,
    validate,
    getFieldError,
    clearErrors,
    hasErrors: Object.keys(errors).length > 0
  };
}