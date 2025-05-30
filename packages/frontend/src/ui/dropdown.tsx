import { ReactNode, useEffect, useRef, useState } from "react";
import { LazyLoadFramerMotion } from "../lib/framer-motion/lazy-load-framer-motion.tsx";
import { AnimatePresence, m } from "framer-motion";
import { userStore } from "../store/user-store.ts";
import { cn } from "./cn.ts";
import { hapticSelection } from "../lib/platform/telegram/haptics.ts";

type Props = {
  items: Array<{ text: ReactNode; onClick: () => void }>;
};

export function Dropdown({ items }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    hapticSelection();
    setIsOpen(!isOpen);
  };
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="absolute inline-block">
      <div
        onClick={toggleDropdown}
        className="dropdown-icon text-2xl select-none cursor-pointer"
      >
        ...
      </div>
      <LazyLoadFramerMotion>
        <AnimatePresence>
          {isOpen && (
            <m.div
              exit={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              initial={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={cn(
                "dropdown-content block absolute bg-secondary-bg min-w-[160px] rounded-[12px] shadow z-10 text-text",
                userStore.isRtl ? "left-0" : "right-0",
              )}
            >
              {items.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    "p-[12px_16px] whitespace-nowrap hover:bg-button hover:text-button-text",
                    i === 0 && "rounded-t-[12px]",
                    i === items.length - 1 && "rounded-b-[12px]",
                  )}
                  onClick={() => {
                    item.onClick();
                    hapticSelection();
                    setIsOpen(false);
                  }}
                >
                  {item.text}
                </div>
              ))}
            </m.div>
          )}
        </AnimatePresence>
      </LazyLoadFramerMotion>
    </div>
  );
}
