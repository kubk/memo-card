import { CheckIcon, CircleXIcon } from "lucide-react";
import { SnackbarProvider } from "notistack";

export function SnackbarProviderWrapper() {
  return (
    <SnackbarProvider
      classes={{
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
      }}
    />
  );
}
