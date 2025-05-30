type Props = {
  error: string;
};

export function ValidationError(props: Props) {
  const { error } = props;
  return <div className="text-[14px] text-danger ml-3">{error}</div>;
}
