import { ReactNode, useState } from "react";
import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { theme } from "./theme.tsx";
import { ChevronIcon } from "./chevron-icon.tsx";
import { Hint } from "./hint.tsx";
import { LazyLoadFramerMotion } from "../lib/framer-motion/lazy-load-framer-motion.tsx";
import { AnimatePresence, m } from "framer-motion";
import { Flex } from "./flex.tsx";

type Props = {
  title: ReactNode;
  body: ReactNode;
};

export const Accordion = observer((props: Props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { title, body } = props;

  return (
    <Flex direction={"column"} gap={8} mt={16} fullWidth>
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className={css({
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 12,
          borderRadius: theme.borderRadius,
          background: theme.bgColor,
          cursor: "pointer",
        })}
      >
        <div
          className={css({
            fontWeight: 500,
            display: "flex",
            alignItems: "center",
            gap: 8,
            userSelect: "none",
          })}
        >
          {title}
        </div>
        <ChevronIcon direction={isExpanded ? "top" : "bottom"} />
      </div>
      <LazyLoadFramerMotion>
        <AnimatePresence>
          {isExpanded && (
            <m.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Hint>{body}</Hint>
            </m.div>
          )}
        </AnimatePresence>
      </LazyLoadFramerMotion>
    </Flex>
  );
});
