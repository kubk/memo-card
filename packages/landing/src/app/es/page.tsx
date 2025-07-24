import { MemoCardPage } from "@/components/landing-page/memocardPage";
import { LandingLanguage } from "api";

export default function Page() {
  return <MemoCardPage language={LandingLanguage.es} />;
}
