import { useState, useCallback } from 'react';

/**
 * useModal — encapsulates open/close state for a single Modal instance.
 *
 * Returns:
 *  isOpen   boolean
 *  open()   () => void
 *  close()  () => void
 *  toggle() () => void
 *
 * Usage:
 *   const { isOpen, open, close } = useModal();
 *   <Button onClick={open}>Open</Button>
 *   <Modal isOpen={isOpen} onClose={close}>…</Modal>
 */
function useModal(initialOpen = false) {
  const [isOpen, setIsOpen] = useState(initialOpen);

  const open   = useCallback(() => setIsOpen(true),  []);
  const close  = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);

  return { isOpen, open, close, toggle };
}

export default useModal;
