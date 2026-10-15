import { CheckIcon, CircleXIcon, Loader2Icon } from "lucide-react";
import { SnackbarProvider } from "notistack";

export function SnackbarProviderWrapper() {
  return (
    <SnackbarProvider
      classes={{
        containerAnchorOriginTopLeft: "!top-[var(--app-top-control-offset)]",
        containerAnchorOriginTopCenter: "!top-[var(--app-top-control-offset)]",
        containerAnchorOriginTopRight: "!top-[var(--app-top-control-offset)]",
        containerAnchorOriginBottomLeft:
          "!bottom-[var(--app-bottom-control-offset)]",
        containerAnchorOriginBottomCenter:
          "!bottom-[var(--app-bottom-control-offset)]",
        containerAnchorOriginBottomRight:
          "!bottom-[var(--app-bottom-control-offset)]",
      }}
      iconVariant={{
        success: (
          <div className="mr-2">
            <CheckIcon size={24} className="text-button" />
          </div>
        ),
        error: (
          <div className="mr-2">
            <CircleXIcon size={24} className="text-danger" />
          </div>
        ),
        info: (
          <div className="mr-2">
            <Loader2Icon size={24} className="animate-spin text-button" />
          </div>
        ),
      }}
    />
  );
}
