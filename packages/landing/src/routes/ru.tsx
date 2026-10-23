import { createFileRoute } from "@tanstack/react-router";
import { LandingLanguage } from "api";
import { MemoCardPage } from "@/components/landing-page/memocardPage";
import { getLandingHead } from "@/shared/landingHead";

export const Route = createFileRoute("/ru")({
  staticData: { language: LandingLanguage.ru },
  head: () => getLandingHead(LandingLanguage.ru),
  component: () => <MemoCardPage language={LandingLanguage.ru} />,
});
