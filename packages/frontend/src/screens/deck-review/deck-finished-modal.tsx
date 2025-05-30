import { ReactNode } from "react";
import { m } from "framer-motion";
import { LazyLoadFramerMotion } from "../../lib/framer-motion/lazy-load-framer-motion.tsx";

type Props = {
  children: ReactNode;
};

export function DeckFinishedModal(props: Props) {
  const { children } = props;

  const modal = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "32px",
      opacity: 1,
      transition: { delay: 0.2 },
    },
  };

  return (
    <LazyLoadFramerMotion>
      <m.div
        className="mx-auto p-6 bg-bg rounded-[12px]"
        initial={"hidden"}
        animate={"visible"}
        exit={"hidden"}
        variants={modal}
      >
        {children}
      </m.div>
    </LazyLoadFramerMotion>
  );
}
