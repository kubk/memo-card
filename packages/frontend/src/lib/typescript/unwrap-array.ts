export type UnwrapArray<A> = A extends unknown[] ? UnwrapArray<A[number]> : A;
