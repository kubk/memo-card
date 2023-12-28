const fieldSeparator = " - ";
const deckSeparator = "\n";
// deckSeparator as regex one or many new lines
const deckSeparatorRegex = /\n+/g;

type CardParsed = {
  front: string;
  back: string;
  example?: string;
};

export const parseCardsFromText = (text: string): Array<CardParsed> => {
  if (!text.includes(deckSeparator)) {
    return [extractDeckFromRow(text)];
  }

  const rows = text.split(deckSeparatorRegex);

  return rows.map(extractDeckFromRow);
};

const extractDeckFromRow = (row: string): CardParsed => {
  const [front, back, example] = row.split(fieldSeparator);
  if (!front || !back) {
    return {
      front: row,
      back: row,
    };
  }
  return { front, back, example };
};
