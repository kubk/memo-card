export const formatAccessUser = (user: {
  id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
}) => {
  if (user.username) {
    return `@${user.username}`;
  }
  if (user.first_name || user.last_name) {
    return `${user.first_name ?? ""} ${user.last_name ?? ""}`;
  }
  return `#${user.id}`;
};
