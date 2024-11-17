import { completeObject } from "../objects";

const SPLIT_OPTIONS_DEFAULT: SplitOptions = {
  max: 0,
};

export function split(
  s: string,
  sep: string,
  options: Partial<SplitOptions> = {},
) {
  completeObject(options, SPLIT_OPTIONS_DEFAULT);
  let { max } = options;
  const result: string[] = [];

  while (max > 0) {
    const sepIdx = s.indexOf(sep);

    if (sepIdx == -1) break;
    const token = s.slice(0, sepIdx);

    s = s.slice(sepIdx + 1);
    if (!token) continue;
    result.push(token);
    --max;
  }
  if (s) result.push(s);
  return result;
}

export type SplitOptions = {
  max: number;
};
