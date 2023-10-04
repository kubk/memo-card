import { whileTap } from "../../ui/animations.ts";
import { css, cx } from "@emotion/css";
import { reset } from "../../ui/reset.ts";
import { motion } from "framer-motion";
import React from "react";

type Props = { onClick: () => void };

export const StopReviewButton = (props: Props) => {
  return (
    <motion.button
      whileTap={whileTap}
      className={cx(
        reset.button,
        css({ position: "absolute", left: -8, top: 10, cursor: "pointer" }),
      )}
      onClick={props.onClick}
    >
      <i className={"mdi mdi-chevron-left mdi-24px"} />
    </motion.button>
  );
};
