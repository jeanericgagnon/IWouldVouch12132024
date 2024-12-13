import { useState, useCallback } from 'react';

interface UseDisclosureOptions {
  defaultIsOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
}

export function useDisclosure(options: UseDisclosureOptions = {}) {
  const [isOpen, setIsOpen] = useState(options.defaultIsOpen || false);

  const onOpen = useCallback(() => {
    setIsOpen(true);
    options.onOpen?.();
  }, [options]);

  const onClose = useCallback(() => {
    setIsOpen(false);
    options.onClose?.();
  }, [options]);

  const onToggle = useCallback(() => {
    const action = isOpen ? onClose : onOpen;
    action();
  }, [isOpen, onOpen, onClose]);

  return {
    isOpen,
    onOpen,
    onClose,
    onToggle
  };
}