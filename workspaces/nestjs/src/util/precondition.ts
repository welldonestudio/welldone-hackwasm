import { AssertionError } from 'assert';

export function precondition(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new AssertionError({ message: msg });
  }
}
