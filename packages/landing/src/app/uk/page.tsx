import { MemoCardPage } from "@/components/landing-page/memocardPage";
import { LanguageEnum } from "@/shared/translations";

export default function Page() {
  return <MemoCardPage language={LanguageEnum.uk} />;
}
