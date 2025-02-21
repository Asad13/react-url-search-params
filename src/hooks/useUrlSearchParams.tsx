import { useState, useEffect, useCallback } from 'react';
import { Schema } from '../utils/schema';

export type UrlSearchParamsValueType = string | number | boolean | bigint;

export type UrlSearchParamsType = {
  [key: string]: UrlSearchParamsValueType;
};

/**
 * A custom React hook to manage URL search parameters.
 *
 * This hook allows you to get, set, delete, and check URL search parameters easily.
 * It updates the browser's history state when parameters change.
 *
 * @template T - A type representing the structure of the search parameters.
 * @param {Schema} schema - Schema
 * @param {Partial<T>} searchParams - Initial search parameters.
 * @returns {Readonly<{
 *   usp: Readonly<{
 *     values: Partial<T>,
 *     toString: () => string,
 *     has: (key: keyof T) => boolean,
 *     size: () => number,
 *     get: (key: keyof T) => UrlSearchParamsValueType | null,
 *     getAll: () => Partial<T> | undefined,
 *     set: (key: keyof T, value: UrlSearchParamsValueType) => void,
 *     append: (params: Partial<T>) => void,
 *     assign: (params: Partial<T>) => void,
 *     remove: (key: keyof T) => void,
 *     removeAll: () => void
 *   }>
 * }>} An object containing a `usp` property with utility functions for managing search parameters.
 */
export const useUrlSearchParams = <T extends UrlSearchParamsType>(
  schema: Schema<any>,
  searchParams?: Partial<T>
) => {
  const initialParams = new URLSearchParams(window.location.search);
  let initialSearchParams: Partial<T> = {};

  if (initialParams.size > 0) {
    // Validate and populate `initialSearchParams`
    initialParams.forEach((value, key) => {
      if (key in schema.shape) {
        let convertedValue: any;

        switch (schema.shape[key]) {
          case 'string':
            convertedValue = value;
            break;
          case 'number':
            convertedValue = isNaN(Number(value)) ? undefined : Number(value);
            break;
          case 'boolean':
            if (value === 'true' || value === 'false') {
              convertedValue = value === 'true';
            } else {
              convertedValue = undefined;
            }
            break;
          case 'bigint':
            try {
              convertedValue = BigInt(value);
            } catch {
              convertedValue = undefined;
            }
            break;
          default:
            convertedValue = undefined;
        }

        // Validate before adding
        if (
          convertedValue !== undefined &&
          schema.validateKey(key, convertedValue)
        ) {
          initialSearchParams[key as keyof T] = convertedValue;
        }
      }
    });
  } else if (searchParams !== undefined) {
    initialSearchParams = searchParams as T;
  }

  const [values, setValues] = useState<Partial<T>>(
    Object.keys(initialSearchParams).length > 0 ? initialSearchParams : {}
  );

  useEffect(() => {
    let newUrl = `${window.location.pathname}`;

    const params = new URLSearchParams();

    Object.entries(values).forEach(([key, value]) => {
      if (value !== '') params.set(key, `${value}`);
    });

    if (params.size > 0) {
      newUrl += `?${params.toString()}`;
    }
    window.history.pushState({}, '', newUrl);
  }, [values]);

  /**
   * Converts the current URL search parameters to a query string.
   *
   * @returns {string} A URL-encoded query string representing the search parameters.
   *
   * @example
   * // If the URL is "https://example.com?page=1&sort=asc"
   * toString(); // Returns "page=1&sort=asc"
   */
  const toString = useCallback(() => {
    const params = new URLSearchParams(window.location.search);
    return params.toString();
  }, []);

  /**
   * Checks if a search parameter exists and is not null.
   * @param {keyof T} key - The parameter key.
   * @returns {boolean} True if the parameter exists, false otherwise.
   */
  const has = useCallback(
    (key: keyof T) => {
      return values[key] !== undefined;
    },
    [values]
  );

  /**
   * Gets the number of non-undefined search parameters.
   * @returns {number} The count of active search parameters.
   */
  const size = useCallback(() => {
    return Object.keys(values).length;
  }, [values]);

  /**
   * Retrieves a search parameter.
   * @param {keyof T} key - The parameter key.
   * @returns {UrlSearchParamsValueType | null} The parameter value or null if not found.
   */
  const get = useCallback(
    (key: keyof T) => {
      return values[key] !== undefined ? values[key] : null;
    },
    [values]
  );

  /**
   * Retrieves all defined search parameters.
   * @returns {Partial<T> | undefined} The active search parameters.
   */
  const getAll = useCallback(() => {
    return values;
  }, [values]);

  /**
   * Add a specific search parameter. If the parameter already exists then updates it.
   * @param {keyof T} key - The parameter key.
   * @param {UrlSearchParamsValueType} value - The parameter value.
   */
  const set = useCallback(<K extends keyof T>(key: K, value: T[K]) => {
    setValues(
      (prev) =>
        ({
          ...prev,
          [key]: value,
        } as unknown as T)
    );
  }, []);

  /**
   * Appends multiple search parameters. Update old parameters.
   * @param {Partial<T>} params - The parameters to set.
   */
  const append = useCallback((params: Partial<T>) => {
    setValues(
      (prev) =>
        ({
          ...prev,
          ...params,
        } as T)
    );
  }, []);

  /**
   * Sets multiple search parameters. Deletes/Replaces old parameters.
   * @param {Partial<T>} params - The parameters to set.
   */
  const assign = useCallback((params: Partial<T>) => {
    setValues({
      ...params,
    } as T);
  }, []);

  /**
   * Deletes a search parameter.
   * @param {keyof T} key - The parameter key.
   */
  const remove = useCallback((key: keyof T) => {
    setValues((prev) => {
      const newParams = { ...prev };
      delete newParams[key];
      return newParams;
    });
  }, []);

  /**
   * Deletes all search parameters.
   */
  const removeAll = useCallback(() => {
    setValues({});
  }, []);

  return {
    usp: {
      values,
      toString,
      has,
      size,
      get,
      getAll,
      set,
      append,
      assign,
      remove,
      removeAll,
    },
  } as const;
};
