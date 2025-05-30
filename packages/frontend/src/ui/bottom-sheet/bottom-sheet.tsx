import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { platform } from "../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { cn } from "../cn.ts";

const variants = {
  open: { y: 0 },
  closed: { y: "100%" },
};

const overlayVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export function BottomSheet(props: Props) {
  const { isOpen, onClose, children } = props;

  // Disable backdrop scroll
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const bottomSheetBody =
    platform instanceof BrowserPlatform && !platform.isMobile ? (
      <div
        className={cn(
          "fixed bottom-0 right-0 bg-bg p-5 rounded-[20px] h-fit z-bottom-sheet-fg w-2xl",
          "top-1/2 left-1/2",
        )}
        style={{
          boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
          transform: "translate(-50%, -50%)",
        }}
      >
        {children}
      </div>
    ) : (
      <motion.div
        className={cn(
          "fixed bottom-0 left-0 right-0 bg-bg rounded-t-[20px] p-5 z-bottom-sheet-fg",
        )}
        style={{
          boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)",
        }}
        initial="closed"
        animate="open"
        exit="closed"
        variants={variants}
        transition={{ duration: 0.2 }}
      >
        {children}
      </motion.div>
    );
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-bottom-sheet-bg"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(4px)",
              WebkitBackdropFilter: "blur(4px)",
            }}
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          {bottomSheetBody}
        </>
      )}
    </AnimatePresence>
  );
}
