export function getInitials(name: string, count = 2): string {
  return name
    .replace(/[.,!@#$%^&*()_+=\-`~[\]/\\{}:"|<>?]+/gi, "")
    .trim()
    .split(/\s+/)
    .slice(0, count)
    .map((word) => {
      const firstCharacter = Array.from(word)[0];
      return firstCharacter ? firstCharacter.toUpperCase() : "";
    })
    .join("");
}
