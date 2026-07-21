import { type ReactNode, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { XIcon } from "lucide-react";
import { platform } from "../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { userStore } from "../../store/user-store.ts";
import { cn } from "../cn.ts";
import { TelegramPlatform } from "../../lib/platform/telegram/telegram-platform.ts";
import { Drawer, DrawerContent, DrawerTitle } from "../drawer.tsx";

const overlayVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
};

const titleClassName =
  "w-full text-center text-xl relative self-center pt-2 pb-6";

function BottomSheetTitleContent(props: {
  title: string;
  onClose: () => void;
}) {
  return (
    <>
      {props.title}
      <span
        className={cn(
          "absolute top-[4px] cursor-pointer bg-secondary-bg rounded-full w-[35px] h-[35px] flex justify-center items-center",
          {
            "left-2": userStore.isRtl,
            "right-2": !userStore.isRtl,
          },
        )}
        onClick={props.onClose}
      >
        <XIcon size={18} />
      </span>
    </>
  );
}

export function BottomSheet(props: Props) {
  const { isOpen, onClose, children, title } = props;
  const isDesktop = platform instanceof BrowserPlatform && !platform.isMobile;

  useEffect(() => {
    if (!isDesktop) {
      return;
    }

    document.body.style.overflow = isOpen ? "hidden" : "unset";

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isDesktop, isOpen]);

  useEffect(() => {
    if (isOpen && platform instanceof TelegramPlatform) {
      platform.hideKeyboard();
    }
  }, [isOpen]);

  if (!isDesktop) {
    return (
      <Drawer
        open={isOpen}
        autoFocus={false}
        onOpenChange={(open) => {
          if (!open) {
            onClose();
          }
        }}
      >
        <DrawerContent
          className={cn(
            platform instanceof TelegramPlatform && platform.isIos() && "pb-10",
          )}
          style={{
            boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
          }}
        >
          <DrawerTitle className={titleClassName}>{title}</DrawerTitle>
          {children}
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-bottom-sheet-bg"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <div className="fixed inset-0 z-bottom-sheet-fg grid place-items-center pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className={cn(
                "pointer-events-auto shadow bg-bg p-5 rounded-[20px] h-fit max-w-2xl w-full",
              )}
            >
              <h2 className={titleClassName}>
                <BottomSheetTitleContent title={title} onClose={onClose} />
              </h2>
              {children}
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
