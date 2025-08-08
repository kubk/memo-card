import { haptic } from "ios-haptics";
import { HapticNotificationType, HapticImpactType } from "./haptics";

export function webMobileHaptic(
  type: HapticNotificationType | "selection" | HapticImpactType,
) {
  switch (type) {
    case "success":
    case "selection":
    case "light":
      haptic();
      break;
    case "warning":
    case "medium":
      haptic.confirm();
      break;
    case "error":
    case "heavy":
      haptic.error();
      break;
    default:
      return type satisfies never;
  }
}
