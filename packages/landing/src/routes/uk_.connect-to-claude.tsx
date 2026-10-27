import { createFileRoute } from "@tanstack/react-router";
import { LandingLanguage } from "api";
import {
  ConnectToClaudePage,
  getConnectToClaudeHead,
} from "@/components/landing-page/connectToClaudePage";

export const Route = createFileRoute("/uk_/connect-to-claude")({
  staticData: { language: LandingLanguage.uk },
  head: () => getConnectToClaudeHead(LandingLanguage.uk),
  component: () => <ConnectToClaudePage language={LandingLanguage.uk} />,
});
