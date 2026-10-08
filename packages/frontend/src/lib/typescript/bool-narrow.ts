export const boolNarrow = <T>(arg?: T | null): arg is T => !!arg;
