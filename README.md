# react-native-gplaces

React Native library for utilizing Google's Autocomplete for Places.

## Install

### using npm

```sh
npm install --save react-native-gplaces
```

### using yarn

```sh
yarn add rn-fetch-blob react-native-gplaces
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

### `search(input: string): Promise<Results>`

Calling this method will search for places matching the input.

### `searchNearby(input: string, radius: number): Promise<Results>`

Calling this method will search for nearby places matching the input in a given radius.
The default radius is 1000m / 1km.

## Types

See [here](https://developers.google.com/places/web-service/autocomplete#place_autocomplete_requests) for up-to-date information.

```ts
interface Query {
  sessiontoken: string; // A random string which identifies an autocomplete session for billing purposes. If this parameter is omitted from an autocomplete request, the request is billed independently. See the pricing sheet for details.
  offset: number; // The position, in the input term, of the last character that the service uses to match predictions. For example, if the input is 'Google' and the offset is 3, the service will match on 'Goo'. The string determined by the offset is matched against the first word in the input term only. For example, if the input term is 'Google abc' and the offset is 3, the service will attempt to match against 'Goo abc'. If no offset is supplied, the service will use the whole term. The offset should generally be set to the position of the text caret.
  location: string; // The point around which you wish to retrieve place information. Must be specified as "latitude,longitude".
  radius: number; // The distance (in meters) within which to return place results. Note that setting a radius biases results to the indicated area, but may not fully restrict results to the specified area. See Location Biasing and Location Restrict below.
  language: string; // The language code, indicating in which language the results should be returned, if possible. Searches are also biased to the selected language; results in the selected language may be given a higher ranking. See the list of supported languages and their codes. Note that we often update supported languages so this list may not be exhaustive. If language is not supplied, the Place Autocomplete service will attempt to use the native language of the domain from which the request is sent.
  types: string; // The types of place results to return. See Place Types below. If no type is specified, all types will be returned.
  components: string; // A grouping of places to which you would like to restrict your results. Currently, you can use components to filter by up to 5 countries. Countries must be passed as a two character, ISO 3166-1 Alpha-2 compatible country code. For example: components=country:fr would restrict your results to places within France. Multiple countries must be passed as multiple country:XX filters, with the pipe character (|) as a separator. For example: components=country:us|country:pr|country:vi|country:gu|country:mp would restrict your results to places within the United States and its unincorporated organized territories.
  strictbounds: boolean; // Returns only those places that are strictly within the region defined by location and radius. This is a restriction, rather than a bias, meaning that results outside this region will not be returned even if they match the user input.
};
interface Options {
  key: string; // Your application's API key. This key identifies your application for purposes of quota management. See Get a key for more information. Google Maps APIs Premium Plan customers must use the API project created for them as part of their Premium Plan purchase.
  query: Query; // Certain parameters are required to initiate a Place Autocomplete request. As is standard in URLs, all parameters are separated using the ampersand (&) character. The list of parameters and their possible values are enumerated above.
};

interface MSubstring {
  length: number; // length of substring in text
  offset: number; // position of substring in text
};
type MSubstrings = Array<MSubstring>; // array of matched substrings

interface SFormat {
  main_text: string; // contains the main text of a prediction, usually the name of the place.
  main_text_matched_substrings: MSubstrings; // contains an array with offset value and length. These describe the location of the entered term in the prediction result text, so that the term can be highlighted if desired.
  secondary_text: string; // contains the secondary text of a prediction, usually the location of the place.
};
type SFormatting = Array<SFormat>; // array of substring formats

interface Term {
  offset: number; // position of term in text
  value: string; // value of term in text
};
type Terms = Array<Term>; // array of terms

interface Result {
  id: string; // unique id for the search result
  place_id: string; // is a textual identifier that uniquely identifies a place. To retrieve information about the place, pass this identifier in the placeId field of a Places API request. For more information about place IDs, see the place ID overview.
  reference: string; // same as place_id
  description: string; // contains the human-readable name for the returned result. For establishment results, this is usually the business name
  matched_substrings: MSubstring; // contains an array with offset value and length. These describe the location of the entered term in the prediction result text, so that the term can be highlighted if desired.
  structured_formatting: SFormatting; // contains the following subfields: main_text, main_text_matched_substrings, secondary_text
  terms: Terms; // contains an array of terms identifying each section of the returned description (a section of the description is generally terminated with a comma). Each entry in the array has a value field, containing the text of the term, and an offset field, defining the start position of this term in the description, measured in Unicode characters.
  types: Array<string>; // contains an array of types that apply to this place. For example: [ "political", "locality" ] or [ "establishment", "geocode" ].
};
type Results = Array<Result>; // array of results
```
