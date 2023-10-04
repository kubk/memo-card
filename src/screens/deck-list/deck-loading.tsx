import { theme } from "../../ui/theme.tsx";
import { css } from "@emotion/css";
import React from "react";
import ContentLoader from "react-content-loader";

export const DeckLoading = () => {
  return (
    <div
      className={css({
        display: "flex",
        justifyContent: "space-between",
        cursor: "pointer",
        gap: 4,
        borderRadius: 8,
        padding: "13px 12px",
        background: theme.secondaryBgColor,
      })}
    >
      <ContentLoader
        speed={2}
        width={"100%"}
        height={20}
        viewBox="0 0 400 20"
        backgroundColor={theme.secondaryBgColor}
        foregroundColor={theme.hintColor}
      >
        <rect x="0" y="0" rx="3" ry="3" width="100%" height="20" />
      </ContentLoader>
    </div>
  );
};
