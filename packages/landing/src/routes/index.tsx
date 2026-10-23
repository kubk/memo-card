import { createFileRoute } from "@tanstack/react-router";
import { LandingLanguage } from "api";
import { MemoCardPage } from "@/components/landing-page/memocardPage";
import { getLandingHead } from "@/shared/landingHead";

export const Route = createFileRoute("/")({
  staticData: { language: LandingLanguage.en },
  head: () => getLandingHead(LandingLanguage.en),
  component: () => <MemoCardPage language={LandingLanguage.en} />,
});
