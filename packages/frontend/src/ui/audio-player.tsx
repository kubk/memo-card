type Props = { src: string };

export function AudioPlayer(props: Props) {
  const { src } = props;
  return (
    <audio
      className="w-full focus:outline-none"
      controls
      src={src}
      controlsList="nodownload"
    />
  );
}
