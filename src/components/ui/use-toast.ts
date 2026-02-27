// Minimal toast hook fallback
// If you already use shadcn/ui toast, replace this with the generated use-toast from shadcn.

export type ToastVariant = "default" | "destructive" | undefined;
export interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
}

function _toast({ title, description, variant }: ToastOptions = {}) {
  if (typeof window === "undefined") return;
  const msg = [title, description].filter(Boolean).join(" — ");
  if (variant === "destructive") {
    // eslint-disable-next-line no-console
    console.error("[Error] " + msg);
    try { setTimeout(() => alert(msg || "An error occurred"), 0); } catch {}
  } else {
    // eslint-disable-next-line no-console
    console.log("[Info] " + msg);
    try { setTimeout(() => alert(msg || "Done"), 0); } catch {}
  }
}

// Named export for direct usage: import { toast } from "@/components/ui/use-toast"
export const toast = _toast;

export function useToast() {
  return { toast: _toast };
}
