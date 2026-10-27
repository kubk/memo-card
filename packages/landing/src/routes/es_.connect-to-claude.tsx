import { createFileRoute } from "@tanstack/react-router";
import { LandingLanguage } from "api";
import {
  ConnectToClaudePage,
  getConnectToClaudeHead,
} from "@/components/landing-page/connectToClaudePage";

export const Route = createFileRoute("/es_/connect-to-claude")({
  staticData: { language: LandingLanguage.es },
  head: () => getConnectToClaudeHead(LandingLanguage.es),
  component: () => <ConnectToClaudePage language={LandingLanguage.es} />,
});
