import { CircleXIcon } from "lucide-react";
import { closeSnackbar, SnackbarKey } from "notistack";

type Props = { snackbarId: SnackbarKey };

export function ClearSnackbar(props: Props) {
  const { snackbarId } = props;
  return (
    <button
      className="p-0 border-0 outline-none text-inherit font-inherit cursor-pointer bg-transparent focus:outline-none mr-2"
      onClick={() => {
        closeSnackbar(snackbarId);
      }}
    >
      <CircleXIcon size={24} className="text-button" />
    </button>
  );
}
