import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { X } from 'lucide-react';

export interface ModalDialogProps
  extends React.DialogHTMLAttributes<HTMLDialogElement> {
  onModalClosing?: Function;
}

export default function ModalDialog({
  className,
  children,
  open,
  ...props
}: ModalDialogProps) {
  const ref = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    }

    ref.current?.addEventListener('close', closeModal);
    return () => {
      ref.current?.removeEventListener('close', closeModal);
    };
  }, [open]);

  const closeModal = () => {
    if (props.onModalClosing !== undefined) {
      props.onModalClosing();
    }

    if (ref === null) return;
    document.body.style.overflow = '';
    ref.current?.close();
  };

  return (
    <dialog
      ref={ref}
      open={open}
      className={cn(
        'p-3 fixed top-0 left-0 w-full h-full z-[9999] bg-background/80',
        className
      )}
    >
      <div className="flex justify-center items-center size-full">
        <div className="shadow-md p-3 rounded-xl border bg-background w-[min(800px,_100%)]">
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
