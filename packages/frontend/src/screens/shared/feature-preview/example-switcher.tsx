import { cn } from "../../../ui/cn";

type Props = {
  activeExample: number;
  totalExamples: number;
  onExampleChange: (exampleNumber: number) => void;
  className?: string;
};

export function ExampleSwitcher(props: Props) {
  const { activeExample, totalExamples, onExampleChange, className } = props;

  return (
    <div className={cn("flex justify-center gap-4", className)}>
      {Array.from({ length: totalExamples }, (_, index) => {
        const exampleNumber = index + 1;
        return (
          <button
            key={exampleNumber}
            onClick={() => onExampleChange(exampleNumber)}
            className={cn(
              "w-3 h-3 rounded-full focus:outline-none",
              activeExample === exampleNumber ? "bg-button" : "bg-hint",
            )}
          />
        );
      })}
    </div>
  );
}
