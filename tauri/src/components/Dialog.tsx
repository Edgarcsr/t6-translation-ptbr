import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

function Dialog({ children, ...props }: DialogPrimitive.DialogProps) {
  return <DialogPrimitive.Root {...props}>{children}</DialogPrimitive.Root>;
}

function DialogTrigger({ children, ...props }: DialogPrimitive.DialogTriggerProps) {
  return <DialogPrimitive.Trigger asChild {...props}>{children}</DialogPrimitive.Trigger>;
}

function DialogPortal({ children, ...props }: DialogPrimitive.DialogPortalProps) {
  return <DialogPrimitive.Portal {...props}>{children}</DialogPrimitive.Portal>;
}

function DialogOverlay({ className, ...props }: DialogPrimitive.DialogOverlayProps) {
  return (
    <DialogPrimitive.Overlay
      className={`fixed inset-0 z-50 bg-black/60 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 ${className ?? ""}`}
      {...props}
    />
  );
}

function DialogContent({ children, className, ...props }: DialogPrimitive.DialogContentProps) {
  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        className={`fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 bg-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] ${className ?? ""}`}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 p-1 rounded-lg hover:bg-neutral-800 text-neutral-500 hover:text-neutral-300 transition-colors">
          <X className="w-4 h-4" />
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
}

function DialogTitle({ className, ...props }: DialogPrimitive.DialogTitleProps) {
  return <DialogPrimitive.Title className={`text-base font-semibold text-white ${className ?? ""}`} {...props} />;
}

function DialogDescription({ className, ...props }: DialogPrimitive.DialogDescriptionProps) {
  return <DialogPrimitive.Description className={`text-sm text-neutral-400 ${className ?? ""}`} {...props} />;
}

export { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription };