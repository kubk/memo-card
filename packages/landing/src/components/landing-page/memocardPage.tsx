import { Footer } from "./footer";
import { YoutubeTutorial } from "./youtubeTutorial";
import {
  BookText,
  Calculator,
  Code2,
  FlaskConical,
  Globe2,
  Languages,
  Music2,
  Stethoscope,
} from "lucide-react";
import { getTranslation } from "@/shared/translations";
import { Header } from "./header";
import { FeatureCard } from "./featureCard";
import { ProPlanSection } from "./proPlanSection";
import { TryActionButton } from "./tryActionButton";
import { renderHighlightedText } from "./renderHighlightedText";
import { demoPreviews } from "./demoPreviews";
import { LandingLanguage } from "api";

export function MemoCardPage(props: { language: LandingLanguage }) {
  const { language } = props;
  const translation = getTranslation(language);
  const videoId = language === "ru" ? "GPkoonk1LwI" : "nU1QG5KCh44";

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <Header language={language} page="home" />

      <section className="pt-16 md:pt-24 text-center">
        <div className="container mx-auto px-4 max-w-(--breakpoint-lg) lg:max-w-5xl xl:max-w-6xl">
          <h1 className={"text-5xl md:text-7xl font-bold mb-4 mt-[24px]"}>
            {renderHighlightedText(translation.hero.title)}
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-6">
            {translation.hero.description1}{" "}
            {renderHighlightedText(
              translation.hero.description2,
              "font-semibold",
            )}
          </p>
          <div className={"my-10"}>
            <TryActionButton translation={translation} />
          </div>
        </div>
      </section>

      <section className="md:mt-2 flex justify-center flex-col md:flex-row gap-12 px-4 md:p-0">
        <div className="md:w-[465px] hidden md:flex flex-col md:items-end">
          <div>
            <h2 className="text-2xl font-bold mb-4">
              {translation.useCases.title}
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(translation.useCases.listEnum).map(
                ([key, value]) => {
                  const Icon = {
                    languages: Languages,
                    medicine: Stethoscope,
                    geography: Globe2,
                    music: Music2,
                    programming: Code2,
                    history: BookText,
                    mathematics: Calculator,
                    chemistry: FlaskConical,
                  }[key];
                  return (
                    <div key={key} className="flex items-start">
                      <span className="shrink-0 w-5 h-5 flex items-center justify-center mr-3 mt-1 text-blue-500">
                        {Icon && <Icon className="w-5 h-5" />}
                      </span>
                      <span className="text-lg">{value}</span>
                    </div>
                  );
                },
              )}
            </div>
          </div>
        </div>
        <div>
          <YoutubeTutorial videoId={videoId} />
        </div>
      </section>

      <section className="mt-4 md:mt-8 bg-white">
        <div className="container mx-auto px-4 max-w-(--breakpoint-lg) lg:max-w-5xl xl:max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {translation.features.list.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
                imageSrc={demoPreviews[index]}
                imageAlt={"Preview " + feature.title}
              />
            ))}
          </div>
        </div>
      </section>

      <ProPlanSection language={language} />

      <Footer language={language} translation={translation} />
    </div>
  );
}
