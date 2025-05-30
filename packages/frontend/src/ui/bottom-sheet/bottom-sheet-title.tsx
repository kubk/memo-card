import { ReactNode } from "react";
import { cn } from "../cn";
import { userStore } from "../../store/user-store";
import { XIcon } from "lucide-react";

type Props = {
  title: ReactNode;
  onClose: () => void;
};

export function BottomSheetTitle(props: Props) {
  const { title, onClose } = props;

  return (
    <h2 className="w-full text-center text-xl relative self-center pt-2 pb-6">
      {title}
      <span
        className={cn(
          "absolute top-[4px] cursor-pointer bg-secondary-bg rounded-full w-[35px] h-[35px] flex justify-center items-center",
          {
            "left-2": userStore.isRtl,
            "right-2": !userStore.isRtl,
          },
        )}
        onClick={() => {
          onClose();
        }}
      >
        <XIcon size={18} />
      </span>
    </h2>
  );
}
