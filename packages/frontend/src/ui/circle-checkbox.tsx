import { m } from "framer-motion";
import { LazyLoadFramerMotion } from "../lib/framer-motion/lazy-load-framer-motion.tsx";
import { cn } from "./cn.ts";

type Props = {
  checked: boolean;
  onChange: () => void;
  checkedClassName: string;
};

export function CircleCheckbox(props: Props) {
  const { checked, onChange, checkedClassName } = props;

  return (
    <LazyLoadFramerMotion>
      <m.button
        onClick={onChange}
        className={cn(
          "rounded-full flex items-center justify-center w-6 h-6 cursor-pointer overflow-hidden",
          checked ? checkedClassName : "bg-bg border border-[#d1d5db]",
        )}
        initial={false}
        whileTap={{ scale: 0.95 }}
        transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
      >
        <m.svg
          width="20"
          height="20"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: checked ? 1 : 0,
            scale: checked ? 1 : 0.8,
          }}
          transition={{
            duration: 0.15,
            ease: "easeOut",
          }}
        >
          <path
            d="M11.4669 3.72684C11.7558 3.91574 11.8369 4.30308 11.648 4.59198L7.39799 11.092C7.29783 11.2452 7.13556 11.3467 6.95402 11.3699C6.77247 11.3931 6.58989 11.3355 6.45446 11.2124L3.70446 8.71241C3.44905 8.48022 3.43023 8.08494 3.66242 7.82953C3.89461 7.57412 4.28989 7.55529 4.5453 7.78749L6.75292 9.79441L10.6018 3.90792C10.7907 3.61902 11.178 3.53795 11.4669 3.72684Z"
            fill="white"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </m.svg>
      </m.button>
    </LazyLoadFramerMotion>
  );
}
