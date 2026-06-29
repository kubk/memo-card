export function getTz() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
