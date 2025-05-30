import { css } from "@emotion/css";
import { theme } from "./theme.tsx";

export const wysiwygTableStyle = css`
  table {
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
    border-radius: ${theme.borderRadius}px;
    border: 1px solid ${theme.divider};
  }

  thead {
    font-weight: bold;
  }

  th,
  td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid ${theme.divider};
    border-right: 1px solid ${theme.divider};
  }

  th {
    font-weight: bold;
    text-transform: uppercase;
    font-size: 14px;
    color: #343a40;
  }

  td {
    font-size: 14px;
    color: ${theme.textColor};
  }

  tr th:last-child,
  tr td:last-child {
    border-right: none;
  }

  tr:last-child td {
    border-bottom: none;
  }
`;
