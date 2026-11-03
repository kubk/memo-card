import { useState } from "preact/compat";
import {
  notifyError,
  notifyLoading,
  notifySuccess,
} from "../src/screens/shared/snackbar/snackbar.tsx";
import { Toasts } from "../src/screens/shared/snackbar/toasts.tsx";
import { Button } from "../src/ui/button.tsx";
import { PreviewFrame } from "./ui/preview-frame.tsx";
import { PropGroup, RadioProp } from "./ui/prop-controls.tsx";
import { PropsPanel } from "./ui/props-panel.tsx";

type ToastStoryVariant = "success" | "error" | "loading";

const variantOptions = [
  { id: "success", label: "success" },
  { id: "error", label: "error" },
  { id: "loading", label: "loading" },
] as const;

function isToastStoryVariant(value: string): value is ToastStoryVariant {
  return variantOptions.some((option) => option.id === value);
}

export function ToastPlayground() {
  const [variant, setVariant] = useState<ToastStoryVariant>("success");

  const showToast = () => {
    if (variant === "success") {
      notifySuccess("Deck has been saved");
      return;
    }
    if (variant === "loading") {
      notifyLoading("Preparing");
      return;
    }

    notifyError();
  };

  return (
    <>
      <Toasts />
      <PreviewFrame>
        <Button variant="outline" onClick={showToast}>
          Show toast
        </Button>
      </PreviewFrame>
      <PropsPanel>
        <PropGroup>
          <RadioProp
            id="toast-variant"
            options={variantOptions}
            value={variant}
            onValueChange={(value) => {
              if (isToastStoryVariant(value)) {
                setVariant(value);
              }
            }}
          />
        </PropGroup>
      </PropsPanel>
    </>
  );
}
