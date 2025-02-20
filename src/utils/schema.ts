export type UrlSchemaOptionType = 'string' | 'number' | 'boolean' | 'bigint'; // "date" | "any"

export type UrlSchemaToType<T extends Schema<any>> = {
  [K in keyof T['shape']]: T['shape'][K] extends 'string'
    ? string
    : T['shape'][K] extends 'number'
    ? number
    : T['shape'][K] extends 'boolean'
    ? boolean
    : T['shape'][K] extends 'bigint'
    ? bigint
    : never;
};

export class Schema<T extends Record<string, UrlSchemaOptionType>> {
  constructor(public shape: T) {}

  validate(data: Record<string, any>): boolean {
    // Ensure data has no extra keys
    const schemaKeys = Object.keys(this.shape);
    const dataKeys = Object.keys(data);

    if (dataKeys.length !== schemaKeys.length) return false; // Checks for extra or missing keys

    for (const key of schemaKeys) {
      if (!(key in data)) return false; // Missing key check

      const expectedType = this.shape[key];
      const actualType = typeof data[key];

      if (expectedType !== actualType) {
        return false;
      }
    }
    return true;
  }

  validateKey(key: string, value: any): boolean {
    const schemaKeys = Object.keys(this.shape);
    if (!schemaKeys.includes(key)) return false;

    const expectedType = this.shape[key];
    const actualType = typeof value;

    if (expectedType !== actualType) {
      return false;
    }

    return true;
  }
}

export const createUrlSearchParamsSchema = <
  T extends Record<string, UrlSchemaOptionType>
>(
  shape: T
) => new Schema(shape);
