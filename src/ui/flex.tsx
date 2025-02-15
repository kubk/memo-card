import { CSSProperties, ReactNode } from "react";
import { css, cx } from "@emotion/css";
import { userStore } from "../store/user-store.ts";

type Props = {
  children: ReactNode;
  direction?: CSSProperties["flexDirection"];
  justifyContent?: CSSProperties["justifyContent"];
  alignItems?: CSSProperties["alignItems"];
  alignSelf?: CSSProperties["alignSelf"];
  gap?: CSSProperties["gap"];
  ml?: CSSProperties["marginLeft"];
  mr?: CSSProperties["marginRight"];
  mt?: CSSProperties["marginTop"];
  mb?: CSSProperties["marginBottom"];
  pt?: CSSProperties["paddingTop"];
  pb?: CSSProperties["paddingBottom"];
  pl?: CSSProperties["paddingLeft"];
  pr?: CSSProperties["paddingRight"];
  className?: string;
  fullWidth?: boolean;
};

export const Flex = (props: Props) => {
  const { children, className } = props;

  return (
    <div
      className={cx(
        css({
          display: "flex",
          width: props.fullWidth ? "100%" : undefined,
          flexDirection: props.direction,
          justifyContent: props.justifyContent,
          alignItems: props.alignItems,
          alignSelf: props.alignSelf,
          gap: props.gap,
          marginLeft: props.ml,
          marginRight: props.mr,
          marginTop: props.mt,
          marginBottom: props.mb,
          paddingTop: props.pt,
          paddingBottom: props.pb,
          paddingLeft: props.pl,
          paddingRight: props.pr,
          textAlign: userStore.isRtl ? "right" : undefined,
        }),
        className,
      )}
    >
      {children}
    </div>
  );
};
