import { createFileRoute } from "@tanstack/react-router";
import { LandingLanguage } from "api";
import {
  ConnectToClaudePage,
  getConnectToClaudeHead,
} from "@/components/landing-page/connectToClaudePage";

export const Route = createFileRoute("/connect-to-claude")({
  staticData: { language: LandingLanguage.en },
  head: () => getConnectToClaudeHead(LandingLanguage.en),
  component: () => <ConnectToClaudePage language={LandingLanguage.en} />,
});
