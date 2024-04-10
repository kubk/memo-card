import { css, cx } from "@emotion/css";
import { theme } from "./theme.tsx";
import { Flex } from "./flex.tsx";
import { tapScale } from "../lib/animations/tap-scale.ts";
import { HintTransparent } from "./hint-transparent.tsx";

type Props = {
  icon: string;
  title: string;
  description?: string;
  onClick: () => void;
};

export const Choice = (props: Props) => {
  const { icon, title, description, onClick } = props;

  return (
    <div
      onClick={onClick}
      className={css({
        padding: 16,
        paddingTop: 10,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        color: theme.textColor,
        backgroundColor: theme.bgColor,
        borderRadius: theme.borderRadius,
        boxShadow: theme.boxShadow,
        cursor: "pointer",
        ...tapScale,
        ":hover": {
          transform: "scale(1.05)",
          transition: "transform 0.3s",
          transformOrigin: "center center",
        },
      })}
    >
      <Flex alignItems={"center"} gap={8} justifyContent={"center"}>
        <i className={cx(icon, css({ color: theme.buttonColor }))} />
        <h3 className={css({ color: theme.buttonColor })}>{title}</h3>
      </Flex>
      <HintTransparent>{description}</HintTransparent>
    </div>
  );
};
