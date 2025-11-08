// Minimal toast hook fallback
// If you already use shadcn/ui toast, replace this with the generated use-toast from shadcn.

export type ToastVariant = "default" | "destructive" | undefined;
export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

export function useToast() {
  function toast({ title, description, variant }: ToastOptions = {}) {
    if (typeof window === "undefined") return;
    const prefix = variant === "destructive" ? "[Error] " : "[Info] ";
    const msg = [title, description].filter(Boolean).join(" — ");
    if (variant === "destructive") {
      // eslint-disable-next-line no-console
      console.error(prefix + msg);
      try {
        // Non-blocking notification fallback
        // eslint-disable-next-line no-alert
        setTimeout(() => alert(msg || "An error occurred"), 0);
      } catch {}
    } else {
      // eslint-disable-next-line no-console
      console.log(prefix + msg);
      try {
        // eslint-disable-next-line no-alert
        setTimeout(() => alert(msg || "Done"), 0);
      } catch {}
    }
  }

  return { toast };
}
