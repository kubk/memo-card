import { type ReactNode } from "react";
import { StarIcon } from "lucide-react";

const proIconGradient = "linear-gradient(to right, #8b5cf6, #ec4899, #ef4444)";
const teacherIconGradient =
  "linear-gradient(135deg, #5c5fc8, #a64994, #c45363)";

type GradientIconProps = {
  icon: ReactNode;
  gradient: string;
};

function GradientIcon({ icon, gradient }: GradientIconProps) {
  return (
    <div
      className="rounded-lg w-[30px] h-[30px] flex flex-col justify-center items-center text-white"
      style={{
        backgroundImage: gradient,
      }}
    >
      {icon}
    </div>
  );
}

type PlanGradientIconProps = {
  icon: ReactNode;
};

export function ProGradientIcon({ icon }: PlanGradientIconProps) {
  return <GradientIcon icon={icon} gradient={proIconGradient} />;
}

export function TeacherGradientIcon({ icon }: PlanGradientIconProps) {
  return <GradientIcon icon={icon} gradient={teacherIconGradient} />;
}

export function ProIcon() {
  return <ProGradientIcon icon={<StarIcon size={18} fill="currentColor" />} />;
}
