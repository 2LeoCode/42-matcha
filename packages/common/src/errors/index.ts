export * from "./unexpected";
export * from "./codded";
export * from "./env-value";
export * from "./http-status";

export function throwError<
  ErrConstructor extends new (...args: any[]) => Error,
>(
  ErrConstructor: ErrConstructor,
  ...args: ConstructorParameters<ErrConstructor>
): never;

export function throwError(
  ...args: ConstructorParameters<ErrorConstructor>
): never;

export function throwError(...args: any[]) {
  if (typeof args[0] === "string") return throwErrorExplicit(Error, ...args);
  return throwErrorExplicit(args[0], ...args.slice(1));
}

function throwErrorExplicit<
  ErrConstructor extends new (...args: any[]) => Error,
>(
  ErrConstructor: ErrConstructor,
  ...args: ConstructorParameters<ErrConstructor>
) {
  throw new ErrConstructor(...args);
}
