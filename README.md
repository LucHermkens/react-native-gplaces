# react-native-gplaces

React Native library for utilizing Google's Autocomplete for Places.

## Install

### using npm

```sh
npm install --save react-native-gplaces
```

### using yarn

```sh
yarn add react-native-gplaces
```

## Usage

### ES6

The module uses an ES6 style export statement, simply use `import` to load the module.

```js
import GPlaces from 'react-native-gplaces';
```

### ES5

If you're using an ES5 require statement to load the module, please add `default`. See [here](https://github.com/joltup/rn-fetch-blob/wiki/Trouble-Shooting#rnfetchblobfetch-is-not-a-function) for more detail.

```js
var GPlaces = require('react-native-gplaces').default;
```

## Searching

### Creating an instance

This package supports custom queries if you'd like to use them.
See [here](https://developers.google.com/places/web-service/autocomplete#place_autocomplete_requests) for more details.

```js
const places = new GPlaces({
  key: 'YOUR_API_KEY',
  query: {
    components: 'country:nl|country:be',
    types: '(cities)'
  }
});
```

### Search for places

```js
places.search(input) // input: 'eindhoven'
  .then(r => {
    // returns Result[]
  })
  .catch(console.error)
```

### Search for places nearby

```js
storage.searchNearby(input, radius) // input: 'eindhoven', radius: 1000
  .then(r => {
    // returns Result[]
  })
  .catch(console.error)
```

## API

### `request(url: string): Promise<any> (@private)`

Calling this method will fetch an URL and return a JSON response

### `autocompleteRequest(options: string): Promise<Results> (@private)`

Calling this method will fetch and return an array of results

<!-- TODO: document default query -->
<!-- TODO: recommend debounce -->

### `search(input: string): Promise<Results>`

Calling this method will search for places matching the input.

### `searchNearby(input: string, radius: number): Promise<Results>`

Calling this method will search for nearby places matching the input in a given radius.
The default radius is 1000m / 1km.

### `getPlaceDetails(placeid: string, query: Query): Promise<Results>`

Calling this method will get certain details for a place based on a query.

## Types

See [here](https://developers.google.com/places/web-service/autocomplete#place_autocomplete_requests) for up-to-date information about queries & results.

```ts
interface Query {
  sessiontoken: string;
  offset: number;
  location: string;
  radius: number;
  language: string;
  types: string;
  components: string;
  strictbounds: boolean;
}
interface Options {
  key: string;
  query: Query;
}

interface MSubstring {
  length: number;
  offset: number;
}
type MSubstrings = Array<MSubstring>

interface SFormat {
  main_text: string;
  main_text_matched_substrings: MSubstrings;
  secondary_text: string;
}
type SFormatting = Array<SFormat>

interface Term {
  offset: number;
  value: string;
}
type Terms = Array<Term>

interface ACResult {
  id: string;
  place_id: string;
  reference: string;
  description: string;
  matched_substrings: MSubstring;
  structured_formatting: SFormatting;
  terms: Terms;
  types: Array<string>;
}
type ACResults = Array<ACResult>
```
