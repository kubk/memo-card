import { ReactNode, useEffect, useRef, useState } from "react";
import { LazyLoadFramerMotion } from "../lib/framer-motion/lazy-load-framer-motion.tsx";
import { AnimatePresence, m } from "framer-motion";
import { userStore } from "../store/user-store.ts";
import { cn } from "./cn.ts";
import { platform } from "../lib/platform/platform.ts";
import { EllipsisIcon } from "lucide-react";
import { AnimatedDropdownItem } from "./animated-dropdown/animated-dropdown-item.tsx";

type Props = {
  items: Array<{ text: ReactNode; onClick: () => void; icon: ReactNode }>;
  className?: string;
};

export function Dropdown({ items, className }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const toggleDropdown = () => {
    platform.haptic("selection");
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
    <div ref={dropdownRef} className={cn("inline-block", className)}>
      <button
        onClick={toggleDropdown}
        className="dropdown-icon text-hint select-none cursor-pointer active:scale-90"
      >
        <EllipsisIcon size={24} />
      </button>
      <LazyLoadFramerMotion>
        <AnimatePresence>
          {isOpen && (
            <m.div
              className={cn(
                "dropdown-content border border-secondary-bg block absolute bg-bg min-w-[160px] rounded-xl shadow z-10 text-text",
                userStore.isRtl ? "left-0" : "right-0",
              )}
              initial={{
                opacity: 0,
                scale: 0.8,
                transformOrigin: userStore.isRtl ? "top left" : "top right",
              }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              {items.map((item, i) => (
                <AnimatedDropdownItem
                  key={i}
                  className={cn(
                    i === 0 ? "rounded-t-xl" : "border-t border-secondary-bg",
                    i === items.length - 1 && "rounded-b-xl",
                  )}
                  onClick={() => {
                    item.onClick();
                    platform.haptic("selection");
                    setIsOpen(false);
                  }}
                >
                  <span className={"flex gap-3 items-center text-text"}>
                    {item.icon}
                    {item.text}
                  </span>
                </AnimatedDropdownItem>
              ))}
            </m.div>
          )}
        </AnimatePresence>
      </LazyLoadFramerMotion>
    </div>
  );
}
