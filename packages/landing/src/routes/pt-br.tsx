import { createFileRoute } from "@tanstack/react-router";
import { LandingLanguage } from "api";
import { MemoCardPage } from "@/components/landing-page/memocardPage";
import { getLandingHead } from "@/shared/landingHead";

export const Route = createFileRoute("/pt-br")({
  staticData: { language: LandingLanguage.ptBr },
  head: () => getLandingHead(LandingLanguage.ptBr),
  component: () => <MemoCardPage language={LandingLanguage.ptBr} />,
});
