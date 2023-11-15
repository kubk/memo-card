import { css } from "@emotion/css";
import { theme } from "./theme.tsx";
import { motion } from "framer-motion";
import React from "react";

type Props = { value: number; max: number };

export const ProgressBar = ({ value, max }: Props) => {
  return (
    <div
      className={css({
        width: "100%",
        backgroundColor: theme.secondaryBgColor,
        borderRadius: theme.borderRadius,
        position: "relative",
        overflow: "hidden",
      })}
    >
      <motion.div
        initial={false}
        animate={{ width: `${(value / max) * 100}%` }}
        className={css({
          backgroundColor: theme.success,
          height: 30,
        })}
      />
      <div
        className={css({
          position: "absolute",
          left: "50%",
          top: 4,
          transform: "translateX(-50%)",
          textAlign: "center",
          fontSize: 14,
          fontWeight: 600,
          color: theme.textColor,
        })}
      >
        {value}/{max}
      </div>
    </div>
  );
};
