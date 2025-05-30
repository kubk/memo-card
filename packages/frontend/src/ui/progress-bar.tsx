import { m } from "framer-motion";
import { LazyLoadFramerMotion } from "../lib/framer-motion/lazy-load-framer-motion.tsx";

type Props = {
  value: number;
  max: number;
};

export function ProgressBar(props: Props) {
  const { value, max } = props;
  return (
    <div className="w-full bg-bg rounded-xl relative overflow-hidden">
      <LazyLoadFramerMotion>
        <m.div
          initial={false}
          animate={{ width: `${(value / max) * 100}%` }}
          className="bg-success h-[30px]"
        />
      </LazyLoadFramerMotion>
      <div
        style={{
          transform: "translateX(-50%)",
        }}
        className="absolute left-1/2 top-1 text-center text-sm font-semibold text-text"
      >
        {value}/{max}
      </div>
    </div>
  );
}
