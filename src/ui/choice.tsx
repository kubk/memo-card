import { css, cx } from "@emotion/css";
import { theme } from "./theme.tsx";
import { Flex } from "./flex.tsx";
import { tapScale } from "../lib/animations/tap-scale.ts";

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
        display: "flex",
        flexDirection: "column",
        gap: 4,
        border: `1px solid ${theme.buttonColorLighter}`,
        color: theme.buttonColor,
        backgroundColor: theme.buttonColorLighter,
        borderRadius: theme.borderRadius,
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
        <i className={cx(icon, css({ color: "inherit" }))} />
        <h3 className={css({ color: "inherit" })}>{title}</h3>
      </Flex>
      <span className={css({ fontSize: 14 })}>{description}</span>
    </div>
  );
};
