import {describe, it, expect} from 'vitest'
import {shuffleArray} from './shuffle-array.ts'

describe('shuffleArray function', () => {
  it('should shuffle an array of numbers', () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray([...array]);
    expect(shuffled).not.toEqual(array);
  });

  it('should shuffle by reference', () => {
    const array = [1, 2, 3, 4, 5];
    const initialArray = [...array]
    shuffleArray(array);
    expect(array).not.toEqual(initialArray);
  });

  it('should shuffle an array of strings', () => {
    const array = ['a', 'b', 'c', 'd', 'e'];
    const shuffled = shuffleArray([...array]);
    expect(shuffled).not.toEqual(array);
  });

  it('should handle an empty array', () => {
    const array: unknown[] = [];
    const shuffled = shuffleArray(array);
    expect(shuffled).toEqual([]);
  });

  it('should retain all elements', () => {
    const array = [1, 2, 3, 4, 5];
    const shuffled = shuffleArray([...array]);
    expect(shuffled.sort()).toEqual(array.sort());
  });

  it('should provide a random order', () => {
    const array = [1, 2, 3, 4, 5];
    const firstShuffle = shuffleArray([...array]);
    const secondShuffle = shuffleArray([...array]);
    expect(firstShuffle).not.toEqual(secondShuffle);
  });
});
