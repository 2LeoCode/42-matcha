export class EnvValueError extends Error {
  constructor(name: string, value: string, help?: string) {
    let msg = `Invalid value for environment variable '${name}': '${value}'`;
    if (help !== undefined) msg += `: ${help}`;
    super(msg);
  }
}
