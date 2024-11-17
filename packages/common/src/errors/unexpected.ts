export class UnexpectedError extends Error {
  constructor(cause: unknown) {
    super("An unexpected error occured", { cause });
  }
}

export function throwUnexpectedError(cause: unknown): never {
  throw new UnexpectedError(cause);
}
