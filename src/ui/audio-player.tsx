import { css } from "@emotion/css";

type Props = { src: string };

export const AudioPlayer = (props: Props) => {
  const { src } = props;

  return (
    <audio
      className={css({
        width: "100%",
        "&:focus": {
          outline: "none",
        },
      })}
      controls
      src={src}
      controlsList="nodownload"
    />
  );
};
