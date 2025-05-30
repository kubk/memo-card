import confetti from "canvas-confetti";
import { notifyError, notifySuccess } from "./snackbar/snackbar.tsx";
import { t } from "../../translations/t.ts";

export const notifyPaymentSuccess = () => {
  setTimeout(() => {
    notifySuccess(t("payment_success"));
  });
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
  });
};

export const notifyPaymentFailed = () => {
  notifyError(
    {
      info: "Payment failed",
    },
    {
      message: t("payment_failed"),
      duration: 10000,
    },
  );
};
