// Allows narrowing function's return type by using user-defined type guard
export const boolNarrow = <T>(arg?: T | null): arg is T => !!arg;
