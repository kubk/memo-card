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
    <div className={cn("flex justify-center", className)}>
      {Array.from({ length: totalExamples }, (_, index) => {
        const exampleNumber = index + 1;
        return (
          <button
            key={exampleNumber}
            onClick={() => onExampleChange(exampleNumber)}
            className={cn(
              "p-4 focus:outline-none",
              "flex items-center justify-center",
            )}
          >
            <div
              className={cn(
                "w-4 h-4 rounded-full",
                activeExample === exampleNumber ? "bg-button" : "bg-hint",
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
