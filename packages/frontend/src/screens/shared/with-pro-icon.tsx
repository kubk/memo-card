import { ReactNode } from "react";
import { userStore } from "../../store/user-store.ts";
import { ProIcon } from "../../ui/pro-icon.tsx";

export function WithProIcon(props: { children?: ReactNode }) {
  if (!userStore.isPaid) {
    return <ProIcon />;
  }
  return props.children;
}
