import { WebHaptics, defaultPatterns } from "web-haptics";
import { platform } from "../../lib/platform/platform.ts";

type HapticNotificationType = "error" | "success" | "warning";
type HapticImpactType = "light" | "medium" | "heavy";

const webHaptics = new WebHaptics();

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
          Web Haptics (Vibration API Fallback)
        </h2>
        <p className="text-sm text-hint">
          These haptics use the Vibration API for devices when Telegram API is
          not available
        </p>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => webHaptics.trigger(defaultPatterns.light)}
            className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
          >
            Light
            <span className="block text-sm text-hint mt-1">
              Single light tap
            </span>
          </button>
          <button
            onClick={() => webHaptics.trigger(defaultPatterns.medium)}
            className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
          >
            Medium
            <span className="block text-sm text-hint mt-1">
              Moderate tap for standard interactions
            </span>
          </button>
          <button
            onClick={() => webHaptics.trigger(defaultPatterns.heavy)}
            className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
          >
            Heavy
            <span className="block text-sm text-hint mt-1">
              Strong tap for significant interactions
            </span>
          </button>
          <button
            onClick={() => webHaptics.trigger(defaultPatterns.success)}
            className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
          >
            Success
            <span className="block text-sm text-hint mt-1">
              Ascending double-tap
            </span>
          </button>
          <button
            onClick={() => webHaptics.trigger(defaultPatterns.error)}
            className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
          >
            Error
            <span className="block text-sm text-hint mt-1">
              Three rapid harsh taps
            </span>
          </button>
          <button
            onClick={() => webHaptics.trigger(defaultPatterns.selection)}
            className="py-3.5 px-4 bg-button text-button-text font-semibold rounded-xl active:scale-95 transition-all duration-200 text-left"
          >
            Selection
            <span className="block text-sm text-hint mt-1">
              Subtle tap for selection changes
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
