import ContentLoader from "react-content-loader";

type Props = {
  speed?: number;
};

export function CardRowLoading(props: Props) {
  const speed = props.speed || 2;
  return (
    <div className="flex justify-between cursor-pointer gap-1 rounded-[12px] p-[14px_12px] bg-bg">
      <ContentLoader
        speed={speed}
        width={"100%"}
        height={20}
        viewBox="0 0 400 20"
        backgroundColor="var(--tg-theme-bg-color)"
        foregroundColor="var(--tg-theme-hint-color)"
      >
        <rect x="0" y="0" rx="3" ry="3" width="100%" height="20" />
      </ContentLoader>
    </div>
  );
}
