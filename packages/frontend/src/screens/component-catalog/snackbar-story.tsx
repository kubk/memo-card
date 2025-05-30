import { notifyError, notifySuccess } from "../shared/snackbar/snackbar.tsx";
import { SnackbarProviderWrapper } from "../shared/snackbar/snackbar-provider-wrapper.tsx";

export function SnackbarStory() {
  return (
    <div>
      <SnackbarProviderWrapper />
      <button onClick={() => notifySuccess("This is a success message")}>
        Show success snackbar
      </button>

      <button onClick={() => notifyError(false, { duration: 10000 })}>
        Show error snackbar
      </button>

      <button
        onClick={() =>
          notifyError(false, {
            duration: 100 * 1000,
            message:
              "Unable to generate cards. Please try updating your prompt",
          })
        }
      >
        Show long error snackbar
      </button>
    </div>
  );
}
