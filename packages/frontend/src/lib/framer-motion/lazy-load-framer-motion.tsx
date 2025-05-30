import { LazyMotion } from "framer-motion";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

const loadFeatures = () => {
  return import("./features.ts").then((res) => res.domAnimation);
};

export const LazyLoadFramerMotion = (props: Props) => {
  const { children } = props;

  return (
    <LazyMotion features={loadFeatures} strict>
      {children}
    </LazyMotion>
  );
};
