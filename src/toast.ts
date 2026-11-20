/**
 * Avisos de `sonner` con la marca. El paquete no depende de sonner: exporta
 * las opciones para pasarlas a su `<Toaster>`.
 *
 *   import { Toaster } from "sonner";
 *   import { toastOptions } from "@rymel/ui";
 *
 *   <Toaster position="top-right" toastOptions={toastOptions} />
 */
export const toastClassNames = {
  toast:
    "group flex w-[356px] max-w-[calc(100vw-32px)] items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 font-sans text-gray-900 shadow-menu",
  title: "text-sm font-bold text-gray-900",
  description: "mt-0.5 text-[13px] text-gray-600",
  content: "flex min-w-0 flex-1 flex-col",
  icon: "mt-px flex size-5 shrink-0 items-center justify-center text-rymel-indigo",
  actionButton:
    "ml-auto h-8 shrink-0 cursor-pointer rounded-[10px] border-0 bg-rymel-blue px-3 text-[13px] font-bold text-white hover:bg-rymel-indigo",
  cancelButton:
    "h-8 shrink-0 cursor-pointer rounded-[10px] border border-gray-300 bg-white px-3 text-[13px] font-semibold text-gray-900 hover:bg-gray-50",
  closeButton:
    "absolute right-2 top-2 flex size-6 cursor-pointer items-center justify-center rounded-md border-0 bg-transparent text-gray-400 hover:text-gray-700",
  success: "[&_[data-icon]]:text-success",
  error: "border-danger/30 [&_[data-icon]]:text-danger",
  warning: "[&_[data-icon]]:text-warning",
  info: "[&_[data-icon]]:text-rymel-indigo",
} as const;

/** Opciones para `<Toaster toastOptions={toastOptions} />`. */
export const toastOptions = {
  unstyled: true,
  classNames: toastClassNames,
} as const;
