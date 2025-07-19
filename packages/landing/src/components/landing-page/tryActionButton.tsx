import { links } from "api";
import { Translation } from "@/shared/translations";

export function TryActionButton(props: { translation: Translation }) {
  const { translation } = props;
  return (
    <div className={"flex justify-center"}>
      <a
        href={links.appBrowser}
        className="shadow-md flex gap-2 items-center bg-linear-to-l from-blue-500 to-blue-600 text-white px-6 py-3 rounded-l-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition duration-300"
      >
        {translation.hero.tryBrowser}
      </a>
      <a
        href={links.appTelegram}
        className="shadow-md flex gap-2 items-center bg-linear-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-r-2xl font-semibold hover:from-blue-600 hover:to-blue-700 transition duration-300"
      >
        {translation.hero.tryTelegram}
      </a>
    </div>
  );
}
