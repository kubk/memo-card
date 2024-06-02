export type PlanDuration = 1 | 6 | 12;

export const durationsWithDiscount: Array<{
  duration: PlanDuration;
  discount: number;
}> = [
  { duration: 1, discount: 0 },
  { duration: 6, discount: 0.15 },
  { duration: 12, discount: 0.25 },
];

export const calcPlanPrice = (price: number, duration: PlanDuration) => {
  const found = durationsWithDiscount.find(
    (item) => item.duration === duration,
  );
  if (!found) {
    throw new Error(`Unknown duration: ${duration}`);
  }
  const discount = found.discount;
  return Math.floor(price * duration * (1 - discount));
};
