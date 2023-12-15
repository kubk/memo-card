import { motion } from "framer-motion";
import React, { SVGProps } from "react";

type Direction = "top" | "bottom";

const getRotation = (direction: Direction) => {
  switch (direction) {
    case "top":
      return 0;
    case "bottom":
      return 180;
  }
};

type Props = Pick<SVGProps<SVGSVGElement>, "onClick" | "className"> & {
  direction: Direction;
};

export const ChevronIcon = (props: Props) => {
  const { direction, ...restProps } = props;
  return (
    <motion.svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      whileTap={{ scale: 0.9 }}
      animate={{ rotate: getRotation(direction) }}
      initial={false}
      {...restProps}
    >
      <path
        d="M4 10.5L8.5 6L13 10.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </motion.svg>
  );
};
