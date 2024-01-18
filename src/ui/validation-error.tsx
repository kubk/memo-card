import { css } from "@emotion/css";
import { theme } from "./theme.tsx";

type Props = {
  error: string;
};

export const ValidationError = (props: Props) => {
  const { error } = props;
  return (
    <div className={css({ fontSize: 14, color: theme.danger })}>{error}</div>
  );
};
