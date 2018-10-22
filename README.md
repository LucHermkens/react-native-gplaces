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

## Importing

### ES6

The module uses an ES6 style export statement, simply use `import` to load the module.

```js
import GPlaces from 'react-native-gplaces';
```

### ES5

If you're using an ES5 require statement to load the module, please add `default`. Look [here](https://github.com/joltup/rn-fetch-blob/wiki/Trouble-Shooting#rnfetchblobfetch-is-not-a-function) for more detail.

```js
var GPlaces = require('react-native-gplaces').default;
```

## Usage

This package supports custom queries if you'd like to use them. For searching queries look [here](https://developers.google.com/places/web-service/autocomplete#place_autocomplete_requests) and queries for getting places look [here](https://developers.google.com/places/web-service/details#PlaceDetailsRequests).

### Creating an instance

You can obtain a Google API key [here](https://developers.google.com/maps/documentation/javascript/get-api-key).

```js
const places = new GPlaces({
  key: 'YOUR_GOOGLE_MAPS_API_KEY' // https://developers.google.com/maps/documentation/javascript/get-api-key
});
```

### Search for places

```js
places.search('nemo', {
  components: 'country:nl',
  types: 'establishment'
})
  .then(r => {
    // returns ACResult[]
  })
  .catch(console.error)
```

### Search for places nearby

```js
places.searchNearby('brussel', 2500, {
  components: 'country:be',
  types: '(cities)'
})
  .then(r => {
    // returns ACResult[]
  })
  .catch(console.error)
```

### Get details for a Place

```js
places.getPlaceDetails('ChIJn8N5VRvZxkcRmLlkgWTSmvM', {
  fields: 'geometry'
})
  .then(r => {
    // returns PDResult
  })
  .catch(console.error)
```

## API

### `constructor GPlaces(options: Options): GPlaces`

Constructor for creating an instance of the GPlaces class

### `request: (url?: string) => Promise<any> (@private)`

Calling this method will fetch an URL and return a JSON response

### `autocompleteRequest: (options?: string) => Promise<ACResult[]> (@private)`

Calling this method will fetch and return an array of results

<!-- TODO: document default query -->
<!-- TODO: recommend debounce -->

### `search: (input?: string, query?: ACQuery | undefined) => Promise<ACResult[]>`

Calling this method will search for places matching the input.

### `searchNearby: (input?: string, radius?: number, query?: ACQuery | undefined) => Promise<ACResult[]>`

Calling this method will search for nearby places matching the input in a given radius.
The default radius is 1000m / 1km.

### `getPlaceDetails: (placeid?: string, query?: PDQuery | undefined) => Promise<PDResult>`

Calling this method will get certain details for a place based on a query.

## Types

For up-to-date information about Autocomplete queries look [here](https://developers.google.com/places/web-service/autocomplete#place_autocomplete_requests), for Place Details queries look [here](https://developers.google.com/places/web-service/details#PlaceDetailsRequests).

```ts
export interface ACQuery {
  sessiontoken?: string;
  offset?: number;
  location?: string;
  radius?: number;
  language?: string;
  types?: string;
  components?: string;
  strictbounds?: boolean;
}

export interface PDQuery {
  language?: string;
  region?: string;
  sessiontoken?: string;
  fields?: string;
}

export interface Options {
  key: string;
}

export interface MSubstring {
  length: number;
  offset: number;
}
export type MSubstrings = Array<MSubstring>

export interface SFormat {
  main_text: string;
  main_text_matched_substrings: MSubstrings;
  secondary_text: string;
}
export type SFormatting = Array<SFormat>

export interface Term {
  offset: number;
  value: string;
}
export type Terms = Array<Term>

export interface ACResult {
  id: string;
  place_id: string;
  reference: string;
  description: string;
  matched_substrings: MSubstrings;
  structured_formatting: SFormatting;
  terms: Terms;
  types: Array<string>;
}
export type ACResults = Array<ACResult>

export type Types = Array<string>
export type HTMLAttrs = Array<string>

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: Types;
}
export type AddressComponents = Array<AddressComponent>

export interface Photo {
  height: number;
  html_attributions: HTMLAttrs;
  photo_reference: string;
  width: number;
}
export type Photos = Array<Photo>

export interface Location {
  lat: string;
  lng: string;
}
export interface Viewport {
  northeast: Location;
  southwest: Location;
}
export interface Geometry {
  location: Location;
  viewport: Viewport;
}

export interface PDResult {
  address_components: AddressComponents;
  adr_address: string;
  formatted_address: string;
  geometry: Geometry;
  icon: string;
  id: string;
  name: string;
  photos: Photos;
  place_id: string;
  reference: string;
  scope: string;
  types: Types;
  url: string;
  utc_offset: number;
  vicinity: string;
}
```
