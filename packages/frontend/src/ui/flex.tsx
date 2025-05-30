import { CSSProperties, ReactNode } from "react";
import { userStore } from "../store/user-store.ts";
import { cn } from "./cn.ts";

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

export function Flex(props: Props) {
  const { children, className } = props;

  // Map CSS properties to Tailwind classes
  const getFlexDirection = () => {
    switch (props.direction) {
      case "row":
        return "flex-row";
      case "column":
        return "flex-col";
      case "row-reverse":
        return "flex-row-reverse";
      case "column-reverse":
        return "flex-col-reverse";
      default:
        return "";
    }
  };

  const getJustifyContent = () => {
    switch (props.justifyContent) {
      case "flex-start":
        return "justify-start";
      case "flex-end":
        return "justify-end";
      case "center":
        return "justify-center";
      case "space-between":
        return "justify-between";
      case "space-around":
        return "justify-around";
      case "space-evenly":
        return "justify-evenly";
      default:
        return "";
    }
  };

  const getAlignItems = () => {
    switch (props.alignItems) {
      case "flex-start":
        return "items-start";
      case "flex-end":
        return "items-end";
      case "center":
        return "items-center";
      case "baseline":
        return "items-baseline";
      case "stretch":
        return "items-stretch";
      default:
        return "";
    }
  };

  const getAlignSelf = () => {
    switch (props.alignSelf) {
      case "flex-start":
        return "self-start";
      case "flex-end":
        return "self-end";
      case "center":
        return "self-center";
      case "baseline":
        return "self-baseline";
      case "stretch":
        return "self-stretch";
      case "auto":
        return "self-auto";
      default:
        return "";
    }
  };

  // Handle spacing with inline styles for precise values
  const style: CSSProperties = {};
  if (props.gap) style.gap = props.gap;
  if (props.ml) style.marginLeft = props.ml;
  if (props.mr) style.marginRight = props.mr;
  if (props.mt) style.marginTop = props.mt;
  if (props.mb) style.marginBottom = props.mb;
  if (props.pt) style.paddingTop = props.pt;
  if (props.pb) style.paddingBottom = props.pb;
  if (props.pl) style.paddingLeft = props.pl;
  if (props.pr) style.paddingRight = props.pr;

  return (
    <div
      className={cn(
        "flex",
        props.fullWidth && "w-full",
        getFlexDirection(),
        getJustifyContent(),
        getAlignItems(),
        getAlignSelf(),
        userStore.isRtl && "text-right",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}
