import React, { ReactNode } from "react";
import { m } from "framer-motion";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { LazyLoadFramerMotion } from "../../lib/framer-motion/lazy-load-framer-motion.tsx";

type Props = {
  children: ReactNode;
  marginTop?: string;
};

export const DeckFinishedModal = (props: Props) => {
  const { children } = props;
  const marginTop = props.marginTop || "200px";

  const modal = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: marginTop,
      opacity: 1,
      transition: { delay: 0.2 },
    },
  };

  return (
    <LazyLoadFramerMotion>
      <m.div
        className={css({
          maxWidth: 290,
          margin: "0 auto",
          padding: 24,
          background: theme.secondaryBgColor,
          borderRadius: theme.borderRadius,
        })}
        initial={"hidden"}
        animate={"visible"}
        exit={"hidden"}
        variants={modal}
      >
        {children}
      </m.div>
    </LazyLoadFramerMotion>
  );
};
