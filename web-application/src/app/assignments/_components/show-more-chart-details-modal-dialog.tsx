import ModalDialog from '@/components/modal-dialog';
import { useEffect, useRef, useState } from 'react';

export interface ShowMoreChartDetailsModalDialogProps {
  children?: React.ReactNode;
}
export default function ShowMoreChartDetailsModalDialog({
  children
}: ShowMoreChartDetailsModalDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useRef<HTMLDivElement>();

  const handleClickOutsideModal = (event: MouseEvent) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleClickOutsideModal);
    } else {
      document.removeEventListener('mousedown', handleClickOutsideModal);
    }
    return () =>
      document.removeEventListener('mousedown', handleClickOutsideModal);
  }, [open]);

  return (
    <>
      <button className="underline" onClick={() => setOpen(true)}>
        See more details about this graph
      </button>
      <ModalDialog
        ref={ref}
        open={open}
        onModalClosing={() => setOpen(false)}
      >
        {children}
      </ModalDialog>
    </>
  );
}
