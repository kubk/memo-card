import React from "react";
import {
  notifyError,
  notifySuccess,
  SnackbarProviderWrapper,
} from "../shared/snackbar.tsx";

export const SnackbarStory = () => {
  return (
    <div>
      <SnackbarProviderWrapper />
      <button onClick={() => notifySuccess("This is a success message")}>
        Show success snackbar
      </button>

      <button onClick={() => notifyError("This is a success message")}>
        Show error snackbar
      </button>
    </div>
  );
};
