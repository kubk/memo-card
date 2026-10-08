import { useState } from "preact/compat";
import { getInitials } from "../../lib/get-initials.ts";

const avatarBgColors = [
  "#D45246",
  "#F68136",
  "#6C61DF",
  "#46BA43",
  "#5CAFFA",
  "#408ACF",
  "#D95574",
];

function getPeerColorGradient(peerId: number): string {
  const color =
    avatarBgColors[Math.abs(peerId) % avatarBgColors.length] ??
    avatarBgColors[0];
  return `linear-gradient(#ffffff -300%, ${color})`;
}

export function LeaderboardAvatar({
  avatarUrl,
  fallbackName,
  peerId,
}: {
  avatarUrl: string | null;
  fallbackName: string;
  peerId: number | undefined;
}) {
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);

  const avatarColor =
    peerId === undefined
      ? { backgroundColor: avatarBgColors[0] }
      : { backgroundImage: getPeerColorGradient(peerId) };

  return (
    <div
      className="relative flex size-[53px] shrink-0 items-center justify-center overflow-hidden rounded-full text-[18px] font-medium leading-none text-white"
      style={avatarColor}
    >
      {getInitials(fallbackName)}
      {avatarUrl && failedAvatarUrl !== avatarUrl && (
        <img
          className="absolute inset-0 size-full object-cover"
          src={avatarUrl}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailedAvatarUrl(avatarUrl)}
        />
      )}
    </div>
  );
}
