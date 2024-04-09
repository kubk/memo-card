import confetti from "canvas-confetti";
import { showAlert } from "../../lib/telegram/show-alert.ts";

export const notifyPaymentSuccess = () => {
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
  showAlert("Payment is successful. Enjoy additional features 😊");
};

export const notifyPaymentFailed = () => {
  showAlert(
    "Payment failed. We're aware of the issue and working on it. Please contact support via Settings > Support.",
  );
};
