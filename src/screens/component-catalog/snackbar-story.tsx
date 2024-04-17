import React from "react";
import { notifyError, notifySuccess } from "../shared/snackbar/snackbar.tsx";
import { SnackbarProviderWrapper } from "../shared/snackbar/snackbar-provider-wrapper.tsx";

export const SnackbarStory = () => {
  return (
    <div>
      <SnackbarProviderWrapper />
      <button onClick={() => notifySuccess("This is a success message")}>
        Show success snackbar
      </button>

      <button onClick={() => notifyError({}, { duration: 10000 })}>
        Show error snackbar
      </button>
    </div>
  );
};
