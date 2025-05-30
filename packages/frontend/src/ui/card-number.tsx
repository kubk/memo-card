type Props = { number: number };

export function CardNumber(props: Props) {
  const { number } = props;

  return <span className="text-hint">{number}. </span>;
}
