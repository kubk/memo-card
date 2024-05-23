import { observer } from "mobx-react-lite";
import { css } from "@emotion/css";
import { theme } from "../../ui/theme.tsx";
import { HorizontalDivider } from "../../ui/horizontal-divider.tsx";

type Props = { front?: string; back?: string; example?: string };

export const CardSidePreview = observer((props: Props) => {
  const { front, back, example } = props;
  return (
    <div
      className={css({
        height: 250,
        width: 250,
        boxSizing: "border-box",
        borderRadius: theme.borderRadius,
        color: theme.textColor,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: 10,
        background: theme.secondaryBgColor,
      })}
    >
      <div
        className={css({
          fontWeight: 600,
          wordBreak: "break-word",
        })}
      >
        {front}
      </div>
      {back ? <HorizontalDivider /> : null}
      <div
        className={css({
          fontWeight: 600,
          wordBreak: "break-word",
        })}
      >
        {back}
      </div>
      <div
        className={css({
          paddingTop: 8,
          fontWeight: 400,
          fontSize: 14,
          maxWidth: 200,
        })}
      >
        {example}
      </div>
    </div>
  );
});
