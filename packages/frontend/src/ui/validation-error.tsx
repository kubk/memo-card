type Props = {
  error: string;
};

export function ValidationError(props: Props) {
  const { error } = props;
  return <div className="text-[0.875rem] text-danger ml-3">{error}</div>;
}
