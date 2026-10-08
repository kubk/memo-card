import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
} from "preact/compat";
import * as m from "motion/react-m";
import { XIcon } from "lucide-react";
import { platform } from "../../lib/platform/platform.ts";
import { BrowserPlatform } from "../../lib/platform/browser/browser-platform.ts";
import { userStore } from "../../store/user-store.ts";
import { cn } from "../cn.ts";
import { TelegramPlatform } from "../../lib/platform/telegram/telegram-platform.ts";
import { Drawer } from "../drawer.tsx";

const overlayVariants = {
  open: { opacity: 1 },
  closed: { opacity: 0 },
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title: string;
  background?: "primary" | "secondary";
  headerSpacing?: "default" | "compact";
};

const BottomSheetPortalContext = createContext<HTMLElement | null>(null);

export function BottomSheetPortalProvider({
  children,
  container,
}: {
  children: ReactNode;
  container: HTMLElement | null;
}) {
  return (
    <BottomSheetPortalContext.Provider value={container}>
      {children}
    </BottomSheetPortalContext.Provider>
  );
}

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
  const {
    isOpen,
    onClose,
    children,
    title,
    background = "primary",
    headerSpacing = "default",
  } = props;
  const portalContainer = useContext(BottomSheetPortalContext);
  const isDesktop = platform instanceof BrowserPlatform && !platform.isMobile;
  const backgroundClassName =
    background === "secondary" ? "bg-secondary-bg" : "bg-bg";
  const titleClassName = cn(
    "relative w-full self-center pt-2 text-center text-xl",
    headerSpacing === "compact" ? "pb-2" : "pb-6",
  );

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
        container={portalContainer}
        onOpenChange={(open) => {
          if (!open) {
            onClose();
          }
        }}
        title={title}
        titleClassName={titleClassName}
        contentProps={{
          className: backgroundClassName,
          style: { boxShadow: "0 -2px 10px rgba(0, 0, 0, 0.1)" },
        }}
      >
        {children}
      </Drawer>
    );
  }

  return (
    isOpen && (
      <>
        <m.div
          className="fixed inset-0 z-bottom-sheet-bg"
          style={{
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
          initial="closed"
          animate="open"
          variants={overlayVariants}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />
        <div className="fixed inset-0 z-bottom-sheet-fg grid place-items-center pointer-events-none safe-viewport-padding">
          <m.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "pointer-events-auto shadow bg-bg p-5 rounded-[20px] h-fit max-w-2xl w-full",
              backgroundClassName,
            )}
          >
            <h2 className={titleClassName}>
              <BottomSheetTitleContent title={title} onClose={onClose} />
            </h2>
            {children}
          </m.div>
        </div>
      </>
    )
  );
}
