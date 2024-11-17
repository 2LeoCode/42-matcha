export function completeObject<T extends object>(
  obj: Partial<T>,
  defaults: T,
): asserts obj is T {
  for (const key in defaults) if (!(key in obj)) obj[key] = defaults[key];
}
