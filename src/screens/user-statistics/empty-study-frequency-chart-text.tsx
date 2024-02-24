import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import React from "react";
import { t } from "../../translations/t.ts";

export const EmptyStudyFrequencyChartText = () => {
  return (
    <div
      className={css({
        backgroundColor: theme.bgColor,
        color: theme.textColor,
        padding: 12,
        boxShadow: theme.boxShadow,
        borderRadius: theme.borderRadius,
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: 14,
        width: 250,
        textAlign: "center",
      })}
    >
      {t("user_stats_empty_text")}
    </div>
  );
};
