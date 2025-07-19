import { Check, X } from "lucide-react";
import React from "react";
import { Button } from "@/components/ui/button";
import { links } from "api";

type Props = {
  title: string;
  purchaseText: string;
  features: Array<{ included: boolean; text: string }>;
  isProPlan?: boolean;
};

export function PlanCard({ title, purchaseText, features, isProPlan }: Props) {
  return (
    <div
      className={`p-6 rounded-2xl transition-all duration-200 ${
        isProPlan
          ? "bg-linear-to-br from-blue-50 to-white border-2 border-blue-500 shadow-lg hover:shadow-xl"
          : "bg-white border border-gray-200 shadow-md hover:border-gray-300 hover:shadow-lg"
      }`}
    >
      <h3
        className={`text-2xl font-bold mb-6 ${
          isProPlan ? "text-blue-600" : "text-gray-800"
        }`}
      >
        {title}
      </h3>
      <ul className="space-y-3">
        {features.map((feature: any, index: any) => (
          <li key={index} className="flex items-start group">
            {feature.included ? (
              <Check className="text-green-500 mr-3 shrink-0 group-hover:scale-110 transition-transform" />
            ) : (
              <X className="text-red-500 mr-3 shrink-0 group-hover:scale-110 transition-transform" />
            )}
            <span className="text-gray-600">{feature.text}</span>
          </li>
        ))}
      </ul>
      {isProPlan ? (
        <a className="block mt-6" href={links.lsqMonthlySubscription}>
          <Button variant="pro" size="lg" className="w-full">
            {purchaseText}
          </Button>
        </a>
      ) : null}
    </div>
  );
}
