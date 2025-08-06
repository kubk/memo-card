import { t, translateCategory } from "../translations/t.ts";

type Props = {
  logo: string;
  categoryName: string;
};

export function DeckCategoryLogo(props: Props) {
  const { logo, categoryName } = props;
  const title = `${t("deck_category")}: ${translateCategory(categoryName)}`;

  return <span title={title}>{logo}</span>;
}
