import { Flex } from "../../../ui/flex";
import { translateMassCreatePaywall } from "./translate-mass-create-paywall";
import { MassCreationExample } from "./mass-creation-example";
import { AnimatePresence } from "framer-motion";
import { UpgradeProBlock } from "./upgrade-pro-block";
import { useLocalObservable } from "mobx-react-lite";
import { ExampleSwitcher } from "./example-switcher";

export function MassCreationBody(props: { showUpgrade?: boolean }) {
  const { showUpgrade } = props;
  const translations = translateMassCreatePaywall();

  const switcher = useLocalObservable(() => ({
    activeExample: 1 as 1 | 2,
    hasChanged: false,
    setActiveExample(value: 1 | 2) {
      this.activeExample = value;
      this.hasChanged = true;
    },
  }));

  return (
    <div className="w-[90%] max-w-[500px]">
      <Flex gap={8} direction={"column"}>
        <div className="relative w-full">
          <AnimatePresence>
            <MassCreationExample
              translations={translations}
              activeExample={switcher.activeExample}
              hasChanged={switcher.hasChanged}
            />
          </AnimatePresence>
        </div>

        <ExampleSwitcher
          activeExample={switcher.activeExample}
          totalExamples={2}
          onExampleChange={(exampleNumber) =>
            switcher.setActiveExample(exampleNumber as 1 | 2)
          }
          className="mt-2 mb-4"
        />

        {showUpgrade && <UpgradeProBlock />}
      </Flex>
    </div>
  );
}
