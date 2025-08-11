import { haptic } from "ios-haptics";
import { platform } from "../../lib/platform/platform.ts";

type HapticNotificationType = "error" | "success" | "warning";
type HapticImpactType = "light" | "medium" | "heavy";

export function HapticsTest() {
  const handleTelegramNotification = (type: HapticNotificationType) => {
    platform.haptic(type);
  };

  const handleTelegramImpact = (type: HapticImpactType) => {
    platform.haptic(type);
  };

  const handleTelegramSelection = () => {
    platform.haptic("selection");
  };

  const handleIosHaptic = () => {
    haptic();
  };

  const handleIosConfirm = () => {
    haptic.confirm();
  };

  const handleIosError = () => {
    haptic.error();
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      <h1 className="text-2xl font-bold text-text">Haptics Test</h1>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-text">Telegram Haptics</h2>

        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-medium text-text">
            Notification Haptics
          </h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleTelegramNotification("success")}
              className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
            >
              Success Notification
            </button>
            <button
              onClick={() => handleTelegramNotification("warning")}
              className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
            >
              Warning Notification
            </button>
            <button
              onClick={() => handleTelegramNotification("error")}
              className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
            >
              Error Notification
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-medium text-text">Impact Haptics</h3>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleTelegramImpact("light")}
              className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
            >
              Light Impact
            </button>
            <button
              onClick={() => handleTelegramImpact("medium")}
              className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
            >
              Medium Impact
            </button>
            <button
              onClick={() => handleTelegramImpact("heavy")}
              className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
            >
              Heavy Impact
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <h3 className="text-lg font-medium text-text">Selection Haptic</h3>
          <button
            onClick={handleTelegramSelection}
            className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
          >
            Selection Changed
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-text">
          iOS Haptics (Web Fallback)
        </h2>
        <p className="text-sm text-hint">
          These haptics use a web-based fallback for iOS devices when Telegram
          API is not available
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={handleIosHaptic}
            className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
          >
            Single Haptic
            <span className="block text-sm text-hint mt-1">
              A single haptic feedback
            </span>
          </button>
          <button
            onClick={handleIosConfirm}
            className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
          >
            Confirm (Double Haptic)
            <span className="block text-sm text-hint mt-1">
              Two rapid haptics for confirmation
            </span>
          </button>
          <button
            onClick={handleIosError}
            className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
          >
            Error (Triple Haptic)
            <span className="block text-sm text-hint mt-1">
              Three rapid haptics for errors
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
