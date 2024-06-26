import { theme } from "../theme.tsx";

export const RadioBoxEmpty = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    style={{
      width: 24,
      height: 24,
    }}
  >
    <path
      fill={theme.hintColor}
      d="M12 20a8 8 0 0 1-8-8 8 8 0 0 1 8-8 8 8 0 0 1 8 8 8 8 0 0 1-8 8m0-18A10 10 0 0 0 2 12a10 10 0 0 0 10 10 10 10 0 0 0 10-10A10 10 0 0 0 12 2Z"
    />
  </svg>
);
