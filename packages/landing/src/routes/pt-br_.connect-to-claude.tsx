import { createFileRoute } from "@tanstack/react-router";
import { LandingLanguage } from "api";
import {
  ConnectToClaudePage,
  getConnectToClaudeHead,
} from "@/components/landing-page/connectToClaudePage";

export const Route = createFileRoute("/pt-br_/connect-to-claude")({
  staticData: { language: LandingLanguage.ptBr },
  head: () => getConnectToClaudeHead(LandingLanguage.ptBr),
  component: () => <ConnectToClaudePage language={LandingLanguage.ptBr} />,
});
