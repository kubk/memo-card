import { theme } from "../../ui/theme.tsx";
import { css } from "@emotion/css";
import React from "react";
import ContentLoader from "react-content-loader";

type Props = {
  speed?: number;
};

export const CardRowLoading = (props: Props) => {
  const speed = props.speed || 2;
  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
        gap: 4,
        borderRadius: theme.borderRadius,
        padding: "14px 12px",
        background: theme.bgColor,
      })}
    >
      <ContentLoader
        speed={speed}
        width={"100%"}
        height={20}
        viewBox="0 0 400 20"
        backgroundColor={theme.bgColor}
        foregroundColor={theme.hintColor}
      >
        <rect x="0" y="0" rx="3" ry="3" width="100%" height="20" />
      </ContentLoader>
    </div>
  );
};
