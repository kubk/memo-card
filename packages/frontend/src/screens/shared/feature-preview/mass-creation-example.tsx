import { motion } from "framer-motion";
import { MassCreatePaywallTranslation } from "./translate-mass-create-paywall";
import { ReadonlyInput } from "./readonly-input";
import { CardPaywallPreview } from "./card-paywall-preview";
import { t } from "../../../translations/t";

export function MassCreationExample(props: {
  translations: MassCreatePaywallTranslation;
  activeExample: number;
  hasChanged: boolean;
}) {
  const { translations, activeExample, hasChanged } = props;

  const direction = activeExample === 2 ? -1 : 1;

  return (
    <motion.div
      key={activeExample}
      initial={{ opacity: 0, x: hasChanged ? (direction > 0 ? -40 : 40) : 0 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: hasChanged ? (direction < 0 ? -40 : 40) : 0 }}
      transition={{
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      }}
      className="w-full"
    >
      <ReadonlyInput
        label={t("card_input_mode_type")}
        value={
          activeExample === 1
            ? translations.promptExample1
            : translations.promptExample2
        }
      />

      <div className="my-1 text-sm">{translations.youllGet}</div>

      <div className="overflow-x-auto pb-2">
        <div className="flex">
          {(activeExample === 1
            ? translations.resultExample1
            : translations.resultExample2
          ).map((card) => (
            <CardPaywallPreview key={card[0]} front={card[0]} back={card[1]} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
