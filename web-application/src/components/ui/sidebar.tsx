import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { Button, ButtonProps } from './button';
import { cn } from '@/lib/utils';
import { MdClose } from 'react-icons/md';

const SidebarContext = createContext<{
  sidebarOpen: boolean;
  setSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}>({
  sidebarOpen: false,
  setSidebarOpen: (p) => {}
});

export interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <SidebarContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </SidebarContext.Provider>
  );
}

export interface SidebarTriggerProps extends ButtonProps {}

export function SidebarTrigger({ children, ...props }: SidebarTriggerProps) {
  const { setSidebarOpen } = useContext(SidebarContext);
  return (
    <Button {...props} onClick={() => setSidebarOpen(true)}>
      {children}
    </Button>
  );
}

export interface SidebarHeaderProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export function SidebarHeader({ children, ...props }: SidebarHeaderProps) {
  const { setSidebarOpen } = useContext(SidebarContext);
  return (
    <div {...props}>
      <Button
        className="min-w-9 min-h-9"
        variant={'outline'}
        size={'icon'}
        onClick={() => setSidebarOpen(false)}
      >
        <MdClose />
      </Button>
      {children}
    </div>
  );
}

export interface SidebarContentProps
  extends React.HTMLAttributes<HTMLDivElement> {
  overlayClassName?: string;
}

export function SidebarContent({
  children,
  className,
  overlayClassName,
  ...props
}: SidebarContentProps) {
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const sidebarContentRef = useRef<HTMLDivElement | null>(null);

  const handleClickOputsideSidebar = (event: MouseEvent) => {
    if (
      sidebarContentRef.current &&
      !sidebarContentRef.current.contains(event.target as Node)
    ) {
      setSidebarOpen(false);
    }
  };

  useEffect(() => {
    if (sidebarOpen) {
      document.addEventListener('mousedown', handleClickOputsideSidebar);
    } else {
      document.removeEventListener('mousedown', handleClickOputsideSidebar);
    }
    return () =>
      document.removeEventListener('mousedown', handleClickOputsideSidebar);
  }, [sidebarOpen]);

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-clip invisible transition-[visibility] delay-150',
        sidebarOpen && 'visible delay-0'
      )}
    >
      <div
        className={cn(
          'bg-black/20 flex w-full h-full justify-end transition-opacity opacity-0',
          sidebarOpen && 'opacity-100 pointer-events-auto',
          sidebarOpen ? 'delay-0' : 'delay-100',
          overlayClassName
        )}
      >
        <div
          ref={sidebarContentRef}
          className={cn(
            'relative bg-background w-[min(375px,_100%)] translate-x-[100%] h-full border sm:border-l sm:border-t-0 sm:border-b-0 shadow-xl p-2 transition-transform delay-100 overflow-y-auto',
            sidebarOpen && 'translate-x-0',
            className
          )}
          {...props}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
