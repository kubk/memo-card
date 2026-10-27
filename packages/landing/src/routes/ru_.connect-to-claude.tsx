import { createFileRoute } from "@tanstack/react-router";
import { LandingLanguage } from "api";
import {
  ConnectToClaudePage,
  getConnectToClaudeHead,
} from "@/components/landing-page/connectToClaudePage";

export const Route = createFileRoute("/ru_/connect-to-claude")({
  staticData: { language: LandingLanguage.ru },
  head: () => getConnectToClaudeHead(LandingLanguage.ru),
  component: () => <ConnectToClaudePage language={LandingLanguage.ru} />,
});
