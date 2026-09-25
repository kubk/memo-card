import { cn } from "../../ui/cn.ts";

export function LeaderboardMedal({
  rank,
  isCurrentUser = false,
  size = "row",
}: {
  rank: number;
  isCurrentUser?: boolean;
  size?: "row" | "podium";
}) {
  const medalSize =
    size === "podium"
      ? rank === 1
        ? "size-[42px]"
        : "size-9"
      : rank <= 3
        ? "size-[29px]"
        : "size-7";

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        size === "row" && "size-8",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center rounded-full border font-extrabold tabular-nums",
          medalSize,
          size === "podium" && "text-xl",
          size === "row" && rank < 100 && "text-[13px]",
          size === "row" && rank >= 100 && rank < 1000 && "text-[10px]",
          size === "row" && rank >= 1000 && "text-[9px] tracking-[-0.04em]",
          rank === 1 &&
            "border-[#e19600] bg-[linear-gradient(145deg,#ffd76a_8%,#ffad1f_50%,#db7900_100%)] text-[#6b3600] shadow-[inset_0_1px_1px_rgba(255,255,255,0.8),0_2px_5px_rgba(219,121,0,0.3)] dark:border-[#e99a0b] dark:bg-[linear-gradient(145deg,#ffc94f_4%,#e9910b_50%,#a95700_100%)] dark:text-[#4a2300] dark:shadow-[inset_0_1px_1px_rgba(255,235,178,0.55),0_2px_5px_rgba(0,0,0,0.4)]",
          rank === 2 &&
            "border-[#b5bdc5] bg-[linear-gradient(145deg,#f6f8fa_8%,#cbd2da_52%,#939da8_100%)] text-[#46505a] shadow-[inset_0_1px_1px_rgba(255,255,255,0.9),0_2px_5px_rgba(78,91,105,0.22)] dark:border-[#929da8] dark:bg-[linear-gradient(145deg,#d9dfe5_6%,#aab4be_52%,#717d88_100%)] dark:text-[#2d3740] dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_2px_5px_rgba(0,0,0,0.38)]",
          rank === 3 &&
            "border-[#ad6539] bg-[linear-gradient(145deg,#e8ae7b_8%,#c9753f_52%,#955027_100%)] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),0_2px_5px_rgba(149,80,39,0.28)] dark:border-[#a95d34] dark:bg-[linear-gradient(145deg,#d89058_6%,#b76031_52%,#71391e_100%)] dark:text-white dark:shadow-[inset_0_1px_1px_rgba(255,224,199,0.35),0_2px_5px_rgba(0,0,0,0.38)]",
          rank > 3 &&
            isCurrentUser &&
            "border-[#287db5] bg-[linear-gradient(145deg,#78c9f4_8%,#3398d1_52%,#19689d_100%)] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.55),0_2px_5px_rgba(25,104,157,0.3)] dark:border-[#2c7daf] dark:bg-[linear-gradient(145deg,#5eb5e5_6%,#287fae_52%,#175678_100%)] dark:text-white dark:shadow-[inset_0_1px_1px_rgba(198,235,255,0.38),0_2px_5px_rgba(0,0,0,0.38)]",
          rank > 3 &&
            !isCurrentUser &&
            "border-transparent bg-secondary-bg text-hint dark:bg-white/[0.06]",
        )}
      >
        {rank}
      </div>
    </div>
  );
}
