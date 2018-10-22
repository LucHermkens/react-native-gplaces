// TODO: add enums (for example: fields could have 'geometry')

/** Autocomplete Query */
export interface ACQuery {
  /** A random string which identifies an autocomplete session for billing purposes. If this parameter is omitted from an autocomplete request, the request is billed independently. See the pricing sheet for details. */
  sessiontoken?: string;
  /** The position, in the input term, of the last character that the service uses to match predictions. For example, if the input is 'Google' and the offset is 3, the service will match on 'Goo'. The string determined by the offset is matched against the first word in the input term only. For example, if the input term is 'Google abc' and the offset is 3, the service will attempt to match against 'Goo abc'. If no offset is supplied, the service will use the whole term. The offset should generally be set to the position of the text caret. */
  offset?: number;
  /** The point around which you wish to retrieve place information. Must be specified as "latitude,longitude". */
  location?: string;
  /** The distance (in meters) within which to return place results. Note that setting a radius biases results to the indicated area, but may not fully restrict results to the specified area. See Location Biasing and Location Restrict below. */
  radius?: number;
  /** The language code, indicating in which language the results should be returned, if possible. Searches are also biased to the selected language; results in the selected language may be given a higher ranking. See the list of supported languages and their codes. Note that we often update supported languages so this list may not be exhaustive. If language is not supplied, the Place Autocomplete service will attempt to use the native language of the domain from which the request is sent. */
  language?: string;
  /** The types of place results to return. See Place Types below. If no type is specified, all types will be returned. */
  types?: string;
  /** A grouping of places to which you would like to restrict your results. Currently, you can use components to filter by up to 5 countries. Countries must be passed as a two character, ISO 3166-1 Alpha-2 compatible country code. For example: components=country:fr would restrict your results to places within France. Multiple countries must be passed as multiple country:XX filters, with the pipe character (|) as a separator. For example: components=country:us|country:pr|country:vi|country:gu|country:mp would restrict your results to places within the United States and its unincorporated organized territories. */
  components?: string;
  /** Returns only those places that are strictly within the region defined by location and radius. This is a restriction, rather than a bias, meaning that results outside this region will not be returned even if they match the user input. */
  strictbounds?: boolean;
}

/** Place Details Query */
export interface PDQuery {
  /** The language code, indicating in which language the results should be returned, if possible. Note that some fields may not be available in the requested language. */
  language?: string;
  /** The region code, specified as a ccTLD (country code top-level domain) two-character value. Most ccTLD codes are identical to ISO 3166-1 codes, with some exceptions. This parameter will only influence, not fully restrict, results. If more relevant results exist outside of the specified region, they may be included. When this parameter is used, the country name is omitted from the resulting formatted_address for results in the specified region. */
  region?: string;
  /** A random string which identifies an autocomplete session for billing purposes. */
  sessiontoken?: string;
  /** One or more fields, specifying the types of place data to return, separated by a comma. */
  fields?: string;
}

/** API Options */
export interface Options {
  /** Your application's API key. This key identifies your application for purposes of quota management. See Get a key for more information. Google Maps APIs Premium Plan customers must use the API project created for them as part of their Premium Plan purchase. */
  key: string;
}

/** Matched Substring */
export interface MSubstring {
  /** length of substring in text */
  length: number;
  /** position of substring in text */
  offset: number;
}
/** Matched Substrings */
export type MSubstrings = Array<MSubstring>

/** Structured Format */
export interface SFormat {
  /** contains the main text of a prediction, usually the name of the place */
  main_text: string;
  /** contains an array with offset value and length */
  main_text_matched_substrings: MSubstrings;
  /** contains the secondary text of a prediction, usually the location of the place */
  secondary_text: string;
}
/** Structured Formatting */
export type SFormatting = Array<SFormat>

/** Term */
export interface Term {
  /** position of term in text */
  offset: number;
  /** value of term in text */
  value: string;
}
/** Terms */
export type Terms = Array<Term>

/** Autocomplete Result */
export interface ACResult {
  /** unique id for the search result */
  id: string;
  /** textual identifier that uniquely identifies a place */
  place_id: string;
  /** same as place_id */
  reference: string;
  /** contains the human-readable name for the returned result (for establishment results, this is usually the business name) */
  description: string;
  /** contains an array with offset value and length */
  matched_substrings: MSubstrings;
  /** contains the following subfields: main_text, main_text_matched_substrings, secondary_text */
  structured_formatting: SFormatting;
  /** contains an array of terms identifying each section of the returned description */
  terms: Terms;
  /** contains an array of types that apply to this place (for example: ["political", "locality"] or ["establishment", "geocode"]) */
  types: Array<string>;
}
/** Autocomplete Results */
export type ACResults = Array<ACResult>

/** Types */
export type Types = Array<string>
/** HTML Attributions */
export type HTMLAttrs = Array<string>

/** Address Component */
// TODO: add jsdoc
export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: Types;
}
/** Address Components */
export type AddressComponents = Array<AddressComponent>

/** Photo */
// TODO: add jsdoc
export interface Photo {
  height: number;
  html_attributions: HTMLAttrs;
  photo_reference: string;
  width: number;
}
/** Address Components */
export type Photos = Array<Photo>

/** Location */
export interface Location {
  /** latitude of the location */
  lat: string;
  /** longitude of the location */
  lng: string;
}
/** Viewport */
export interface Viewport {
  /** north east location of the viewport */
  northeast: Location;
  /** south west location of the viewport */
  southwest: Location;
}
/** Geometry Details */
export interface Geometry {
  /** contains the geocoded latitude,longitude value for this place */
  location: Location;
  /** contains the preferred viewport when displaying this place on a map as a Location if it is known */
  viewport: Viewport;
}

/** Place Details Result */
export interface PDResult {
  /** an array containing the separate components applicable to this address */
  address_components: AddressComponents;
  /** a representation of the place's address in the adr microformat */
  adr_address: string;
  /** a string containing the human-readable address of this place */
  formatted_address: string;
  /** geodata of the place */
  geometry: Geometry;
  /** contains the URL of a suggested icon which may be displayed to the user when indicating this result on a map */
  icon: string;
  /** unique id for the search result */
  id: string;
  /** contains the human-readable name for the returned result (for establishment results, this is usually the canonicalized business name) */
  name: string;
  /** an array of Photo objects, each containing a reference to an image (a Place Details request may return up to ten photos) */
  photos: Photos;
  /** textual identifier that uniquely identifies a place */
  place_id: string;
  /** same as place_id */
  reference: string;
  /** indicates the scope of the place_id */
  scope: string;
  /** contains an array of feature types describing the given result */
  types: Types;
  /** contains the URL of the official Google page for this place */
  url: string;
  /** contains the number of minutes this place’s current timezone is offset from UTC */
  utc_offset: number;
  /** lists a simplified address for the place, including the street name, street number, and locality, but not the province/state, postal code, or country */
  vicinity: string;
}
