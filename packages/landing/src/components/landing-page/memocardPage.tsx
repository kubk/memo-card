import { links } from "api";
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
import { LanguageSwitcher } from "./languageSwitcher";
import { FeatureCard } from "./featureCard";
import { PlanCard } from "./planCard";
import { TryActionButton } from "./tryActionButton";
import { renderHighlightedText } from "./renderHighlightedText";
import { demoPreviews } from "./demoPreviews";
import { LandingLanguage } from "api";

export function MemoCardPage(props: { language: LandingLanguage }) {
  const { language } = props;
  const translation = getTranslation(language);
  const youtubeChannelLink =
    language === "ru" ? links.youtubeChannelRu : links.youtubeChannelEn;
  const videoId = language === "ru" ? "GPkoonk1LwI" : "nU1QG5KCh44";

  return (
    <div className="flex flex-col min-h-screen bg-white text-black">
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 md:border-none"
        style={{
          backgroundColor: "hsla(0, 0%, 100%, .86)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
        }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center max-w-(--breakpoint-lg) lg:max-w-5xl xl:max-w-6xl">
          <div className="flex items-center">
            <div className="flex items-center font-semibold gap-2">
              <img src={"/logoI.png"} alt="MemoCard Logo" className="h-6" />
              <span>MemoCard</span>
            </div>
          </div>
          <nav className="hidden md:flex space-x-6 -ml-[80px]">
            <a href={links.botChannel} className="text font-semibold">
              Telegram
            </a>
            <a href={youtubeChannelLink} className="text font-semibold">
              YouTube
            </a>
            <a href={links.github} className="text font-semibold">
              GitHub
            </a>
          </nav>
          <div className="flex items-center">
            <LanguageSwitcher />
          </div>
        </div>
      </header>

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

      <section>
        <div className={"my-12 mt-14"}>
          <TryActionButton translation={translation} />
        </div>
      </section>

      <section className="max-w-(--breakpoint-lg) mx-auto lg:max-w-5xl xl:max-w-6xl mb-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            {translation.plans.title}
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <PlanCard
              title={translation.plans.free}
              features={translation.freePlanFeatures.included
                .map((item) => ({
                  included: true,
                  text: item,
                }))
                .concat(
                  translation.freePlanFeatures.notIncluded.map((item) => ({
                    included: false,
                    text: item,
                  })),
                )}
            />
            <PlanCard
              title={translation.plans.pro}
              features={translation.proPlanFeatures.included.map((item) => ({
                included: true,
                text: item,
              }))}
              isProPlan={true}
            />
          </div>
        </div>
      </section>

      <Footer translation={translation} />
    </div>
  );
}
