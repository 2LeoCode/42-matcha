export class HttpStatusError extends Error {
  constructor(
    path: string,
    public readonly statusCode?: number,
  ) {
    super(
      `Failed to access ressource at ${path}: Bad status code: ${statusCode}`,
    );
  }
}
