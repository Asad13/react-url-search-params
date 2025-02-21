# react-url-search-params

A zero-dependency, type-safe library for managing URL query parameters in React with schema-based validation. It includes a built-in schema generator, eliminating the need for external validation libraries like Zod or Yup. Query parameter changes automatically create a new entry in the browser history, ensuring seamless navigation.

## Installation

Install the package using npm or yarn or pnpm:

```sh
npm install react-url-search-params
```

or

```sh
yarn add react-url-search-params
```

or

```sh
pnpm add react-url-search-params
```

## Features

- Type-safe URL search parameters handling
- Default values for query parameters
- Easy-to-use hooks for managing and updating URL search params
- validating search params at run-time based on the schema you defined
- Automatically updates browser's history

## Usage

### Basic Usage(Typescript)

```tsx
import {
  useUrlSearchParams,
  createUrlSearchParamsSchema,
  UrlSchemaToType,
} from 'react-url-search-params';

const urlSearchParamsSchema = createUrlSearchParamsSchema({
  q: 'string',
  page: 'number',
  instock: 'boolean',
});

type UrlSearchParams = UrlSchemaToType<typeof urlSearchParamsSchema>;

const Component = () => {
  const { usp } = useUrlSearchParams<UrlSearchParams>(urlSearchParamsSchema);

  return (
    <>
      <input
        type="search"
        onchange={(event: React.ChangeEvent<HTMLInputElement>) => {
          usp.assign({
            q: event.target.value,
          });
        }}
        value={usp.values?.q ?? ''} // You can use || instead of ??(Nullish coalescing operator)
        name="q"
        id="q"
      />
      <button
        onClick={() => {
          usp.append({
            instock: true,
          });
        }}
      >
        In Stock
      </button>
      <div>
        <span>
          <button
            onClick={() => {
              usp.set('page', 1);
            }}
          >
            1
          </button>
        </span>
        <span>
          <button
            onClick={() => {
              usp.set('page', 2);
            }}
          >
            2
          </button>
        </span>
        <span>
          <button
            onClick={() => {
              usp.set('page', 3);
            }}
          >
            3
          </button>
        </span>
      </div>
    </>
  );
};

export default Component;
```

### Basic Usage(Javascript)

```jsx
import {
  useUrlSearchParams,
  createUrlSearchParamsSchema,
} from 'react-url-search-params';

const urlSearchParamsSchema = createUrlSearchParamsSchema({
  q: 'string',
  page: 'number',
  instock: 'boolean',
});

const Component = () => {
  const { usp } = useUrlSearchParams(urlSearchParamsSchema);

  return (
    <>
      <input
        type="search"
        onchange={(event: React.ChangeEvent<HTMLInputElement>) => {
          usp.assign({
            q: event.target.value,
          });
        }}
        value={usp.values?.q ?? ''} // You can use || instead of ??(Nullish coalescing operator)
        name="q"
        id="q"
      />
      <button
        onClick={() => {
          usp.append({
            instock: true,
          });
        }}
      >
        In Stock
      </button>
      <div>
        <span>
          <button
            onClick={() => {
              usp.set('page', 1);
            }}
          >
            1
          </button>
        </span>
        <span>
          <button
            onClick={() => {
              usp.set('page', 2);
            }}
          >
            2
          </button>
        </span>
        <span>
          <button
            onClick={() => {
              usp.set('page', 3);
            }}
          >
            3
          </button>
        </span>
      </div>
    </>
  );
};

export default Component;
```

### Defining the URL Search Params Schema

```tsx
const urlSearchParamsSchema = createUrlSearchParamsSchema({
  q: 'string',
  page: 'number',
  instock: 'boolean',
});
```

### Inferring Type from Schema

```tsx
type UrlSearchParams = UrlSchemaToType<typeof urlSearchParamsSchema>;
```

### Using the `useUrlSearchParams` Hook

```tsx
const { usp } = useUrlSearchParams<UrlSearchParams>(urlSearchParamsSchema);
```

### Using the `useUrlSearchParams` Hook with default value

```tsx
// This is especially useful when you need to set search parameters immediately upon visiting the page.
// There is no need to use the useEffect hook to initialize search parameters on page load.
const { usp } = useUrlSearchParams<UrlSearchParams>(urlSearchParamsSchema, {
  q: 'hello',
});
```

### Updating Search Params

```tsx
<input
  type="search"
  onchange={(event: React.ChangeEvent<HTMLInputElement>) => {
    usp.assign({
      q: event.target.value,
    });
  }}
  value={usp.values?.q ?? ''} // You can use || instead of ??(Nullish coalescing operator)
  name="q"
  id="q"
/>
```

## API Reference

### `createUrlSearchParamsSchema`

Creates a schema definition for URL search parameters.

```tsx
const schema = createUrlSearchParamsSchema({
  key1: 'string',
  key2: 'number',
});
```

Infer Typescript type from the Schema you defined.

```tsx
type UrlSearchParams = UrlSchemaToType<typeof schema>;
```

### `useUrlSearchParams`

Hook to interact with URL search parameters.

```tsx
const { usp } = useUrlSearchParams<UrlSearchParams>(schema, {
  key1: 'default',
}); // Both the type parameter (<UrlSearchParams>) and the second argument are optional. Use the second argument only if you want to set default values when the page loads with existing search parameters.
```

### `usp` Methods

#### `usp.toString()`

Converts the current URL search parameters to a query string.

```tsx
const queryString = usp.toString();
console.log(queryString); // Example output: "q=hello&r=3"
```

#### `usp.has(key: keyof T)`

Checks if a search parameter exists.

```tsx
const exists = usp.has('q');
console.log(exists); // true or false
```

#### `usp.size()`

Gets the number of active search parameters.

```tsx
const count = usp.size();
console.log(count); // Example output: 2
```

#### `usp.get(key: keyof T)`

Retrieves a search parameter.

```tsx
const value = usp.get('q');
console.log(value); // Example output: "hello"
```

#### `usp.getAll()`

Retrieves all active search parameters.

```tsx
const allParams = usp.getAll();
console.log(allParams); // Example output: { q: "hello", r: 3 }
```

#### `usp.set(key: keyof T, value: UrlSearchParamsValueType)`

Sets a specific search parameter.

```tsx
usp.set('q', 'new-value');
```

#### `usp.append(params: Partial<T>)`

Appends multiple search parameters without replacing existing ones.

```tsx
usp.append({ instock: true });
```

#### `usp.assign(params: Partial<T>)`

Sets multiple search parameters, replacing existing ones.

```tsx
usp.assign({ q: 'updated', page: 5 });
```

#### `usp.remove(key: keyof T)`

Deletes a specific search parameter.

```tsx
usp.remove('page');
```

#### `usp.removeAll()`

Removes all search parameters.

```tsx
usp.removeAll();
```

## License

MIT
