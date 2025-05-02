import { cn } from '@/lib/utils';
import React, { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export interface ModalDialogProps
  extends React.DialogHTMLAttributes<HTMLDialogElement> {
  onModalClosing?: Function;
}

const ModalDialog = React.forwardRef<HTMLDivElement, ModalDialogProps>(
  ({ className, children, open, ...props }, ref) => {
    const dialogRef = useRef<HTMLDialogElement | null>();

    useEffect(() => {
      if (!dialogRef) return;

      if (open) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }

      dialogRef.current?.addEventListener('close', closeModal);
      return () => {
        dialogRef.current?.removeEventListener('close', closeModal);
      };
    }, [open]);

    const closeModal = () => {
      if (props.onModalClosing !== undefined) {
        props.onModalClosing();
      }

      if (dialogRef === null) return;
      dialogRef.current?.close();
    };

    return (
      <dialog
        ref={dialogRef}
        open={open}
        className={cn(
          'p-3 fixed top-0 left-0 w-full h-full z-[9999] bg-background/80',
          className
        )}
      >
        <div className="flex justify-center items-center size-full">
          <div
            ref={ref}
            className="shadow-md p-3 rounded-xl border bg-background w-[min(800px,_100%)]"
          >
            <div className="flex justify-end w-full">
              <Button
                variant={'ghost'}
                onClick={closeModal}
                size={'icon'}
                className="rounded-[calc(theme(borderRadius.xl)_-_1px)]"
              >
                <X />
              </Button>
            </div>
            {children}
          </div>
        </div>
      </dialog>
    );
  }
);

export default ModalDialog;
