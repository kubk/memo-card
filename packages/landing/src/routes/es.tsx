import { createFileRoute } from "@tanstack/react-router";
import { LandingLanguage } from "api";
import { MemoCardPage } from "@/components/landing-page/memocardPage";
import { getLandingHead } from "@/shared/landingHead";

export const Route = createFileRoute("/es")({
  staticData: { language: LandingLanguage.es },
  head: () => getLandingHead(LandingLanguage.es),
  component: () => <MemoCardPage language={LandingLanguage.es} />,
});
