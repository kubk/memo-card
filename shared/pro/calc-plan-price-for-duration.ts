export type PlanDuration = 1 | 6 | 12;

export const durationsWithDiscount: Array<{
  duration: PlanDuration;
  discount: number;
  discountStars: number;
}> = [
  { duration: 1, discount: 0, discountStars: 0 },
  { duration: 6, discount: 0.15, discountStars: 0.333 },
  { duration: 12, discount: 0.25, discountStars: 0.5 },
];

export const calcPlanPriceForDuration = (
  type: "usd" | "stars",
  price: number,
  duration: PlanDuration,
) => {
  const found = durationsWithDiscount.find(
    (item) => item.duration === duration,
  );
  if (!found) {
    throw new Error(`Unknown duration: ${duration}`);
  }
  const discount = type === "usd" ? found.discount : found.discountStars;
  return Math.floor(price * duration * (1 - discount));
};
