import ModalDialog from '@/components/modal-dialog';
import { useState } from 'react';

export interface ShowMoreChartDetailsModalDialogProps {
  children?: React.ReactNode;
}
export default function ShowMoreChartDetailsModalDialog({
  children
}: ShowMoreChartDetailsModalDialogProps) {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <>
      <button className="underline" onClick={() => setOpen(true)}>
        See more details about this graph
      </button>
      <ModalDialog open={open} onModalClosing={() => setOpen(false)}>
        {children}
      </ModalDialog>
    </>
  );
}
