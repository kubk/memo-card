import { createFileRoute } from "@tanstack/react-router";
import { LandingLanguage } from "api";
import { MemoCardPage } from "@/components/landing-page/memocardPage";
import { getLandingHead } from "@/shared/landingHead";

export const Route = createFileRoute("/uk")({
  staticData: { language: LandingLanguage.uk },
  head: () => getLandingHead(LandingLanguage.uk),
  component: () => <MemoCardPage language={LandingLanguage.uk} />,
});
