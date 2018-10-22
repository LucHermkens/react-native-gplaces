import { Platform } from 'react-native'
import * as Qs from 'qs'

/** Autocomplete Query */
interface Query {
  /** A random string which identifies an autocomplete session for billing purposes. If this parameter is omitted from an autocomplete request, the request is billed independently. See the pricing sheet for details. */
  sessiontoken: string;
  /** The position, in the input term, of the last character that the service uses to match predictions. For example, if the input is 'Google' and the offset is 3, the service will match on 'Goo'. The string determined by the offset is matched against the first word in the input term only. For example, if the input term is 'Google abc' and the offset is 3, the service will attempt to match against 'Goo abc'. If no offset is supplied, the service will use the whole term. The offset should generally be set to the position of the text caret. */
  offset: number;
  /** The point around which you wish to retrieve place information. Must be specified as "latitude,longitude". */
  location: string;
  /** The distance (in meters) within which to return place results. Note that setting a radius biases results to the indicated area, but may not fully restrict results to the specified area. See Location Biasing and Location Restrict below. */
  radius: number;
  /** The language code, indicating in which language the results should be returned, if possible. Searches are also biased to the selected language; results in the selected language may be given a higher ranking. See the list of supported languages and their codes. Note that we often update supported languages so this list may not be exhaustive. If language is not supplied, the Place Autocomplete service will attempt to use the native language of the domain from which the request is sent. */
  language: string;
  /** The types of place results to return. See Place Types below. If no type is specified, all types will be returned. */
  types: string;
  /** A grouping of places to which you would like to restrict your results. Currently, you can use components to filter by up to 5 countries. Countries must be passed as a two character, ISO 3166-1 Alpha-2 compatible country code. For example: components=country:fr would restrict your results to places within France. Multiple countries must be passed as multiple country:XX filters, with the pipe character (|) as a separator. For example: components=country:us|country:pr|country:vi|country:gu|country:mp would restrict your results to places within the United States and its unincorporated organized territories. */
  components: string;
  /** Returns only those places that are strictly within the region defined by location and radius. This is a restriction, rather than a bias, meaning that results outside this region will not be returned even if they match the user input. */
  strictbounds: boolean;
}
/** API Options */
interface Options {
  /** Your application's API key. This key identifies your application for purposes of quota management. See Get a key for more information. Google Maps APIs Premium Plan customers must use the API project created for them as part of their Premium Plan purchase. */
  key: string;
  /** Certain parameters are required to initiate a Place Autocomplete request. As is standard in URLs, all parameters are separated using the ampersand (&) character. The list of parameters and their possible values are enumerated above. */
  query: Query;
}

/** Matched Substring */
interface MSubstring {
  /** length of substring in text */
  length: number;
  /** position of substring in text */
  offset: number;
}
/** Matched Substrings */
type MSubstrings = Array<MSubstring>

/** Structured Format */
interface SFormat {
  /** contains the main text of a prediction, usually the name of the place */
  main_text: string;
  /** contains an array with offset value and length */
  main_text_matched_substrings: MSubstrings;
  /** contains the secondary text of a prediction, usually the location of the place */
  secondary_text: string;
}
/** Structured Formatting */
type SFormatting = Array<SFormat>

/** Term */
interface Term {
  /** position of term in text */
  offset: number;
  /** value of term in text */
  value: string;
}
/** Terms */
type Terms = Array<Term>

/** Autocomplete Result */
interface ACResult {
  /** unique id for the search result */
  id: string;
  /** textual identifier that uniquely identifies a place */
  place_id: string;
  /** same as place_id */
  reference: string;
  /** contains the human-readable name for the returned result (for establishment results, this is usually the business name) */
  description: string;
  /** contains an array with offset value and length */
  matched_substrings: MSubstring;
  /** contains the following subfields: main_text, main_text_matched_substrings, secondary_text */
  structured_formatting: SFormatting;
  /** contains an array of terms identifying each section of the returned description */
  terms: Terms;
  /** contains an array of types that apply to this place (for example: ["political", "locality"] or ["establishment", "geocode"]) */
  types: Array<string>;
}
/** Autocomplete Results */
type ACResults = Array<ACResult>

/** Class containing methods to get results from Google Places */
// TODO: add nearby search without input
export default class GPlaces {
  options: Options
  /**
   * Create an instance of the GPlaces class.
   * @param   {Options} options
   *          Options for creating the handler
   */
  constructor (options: Options) {
    this.options = options
  }

  /**
   * Make a request expecting a JSON response
   * @param   {string} url
   *          Request URL for Google Maps
   * @private
   */
  request = (url: string = '') => new Promise<any>((resolve, reject) => {
    if (!url || typeof url !== 'string') {
      reject(new Error('Invalid request URL.'))
    }

    fetch(url)
      .then(r => r.json())
      .then(resolve)
      .catch(reject)
  })

  /**
   * Search for places using specified options
   * @param   {string} options
   *          Options string for the API call
   * @returns {Promise<ACResults>}
   *          Returns an unaltered array of results from the Google Places API
   */
  autocompleteRequest = (options: string = '') => new Promise<ACResults>((resolve, reject) => {
    this.request(`https://maps.googleapis.com/maps/api/place/autocomplete/json?${options}`)
      .then(res => {
        if (!res || !res.predictions || !Array.isArray(res.predictions)) {
          return reject(new Error('Invalid response from server'))
        }
        resolve(res.predictions)
      })
      .catch(reject)
  })

  /**
   * Search for places matching input
   * @param   {string} input
   *          Input string for the search
   * @returns {Promise<ACResults>}
   *          Returns an unaltered array of results from the Google Places API
   */
  search = (input: string = '') => new Promise<ACResults>(async (resolve, reject) => {
    if (!input || typeof input !== 'string') {
      reject(new Error('Invalid input string given.'))
    }

    const options = Qs.stringify({
      input,
      language: 'en',
      key: this.options.key,
      types: 'establishment',
      ...this.options.query
    })

    this.autocompleteRequest(options)
      .then(resolve)
      .catch(reject)
  })

  /**
   * Search for places matching input
   * @param   {string} input
   *          Input string for the search
   * @param   {number} radius
   *          Radius in meters to look for places
   * @returns {Promise<ACResults>}
   *          Returns an unaltered array of results from the Google Places API
   */
  searchNearby = (input: string = '', radius: number = 1000) => new Promise<ACResults>(async (resolve, reject) => {
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude = 0, longitude = 0 } = (position || { coords: null, timestamp: null }).coords || {}

      if (!latitude || !longitude) {
        reject(new Error('No latitude/longtitude for current location found.'))
      }

      if (!input || typeof input !== 'string') {
        reject(new Error('Invalid input string given.'))
      }

      if (!radius || typeof radius !== 'number') {
        reject(new Error('Invalid radius given.'))
      }

      const options = Qs.stringify({
        input,
        radius,
        language: 'en',
        key: this.options.key,
        types: 'establishment',
        strictbounds: true,
        location: `${latitude},${longitude}`,
        ...this.options.query
      })

      this.autocompleteRequest(options)
        .then(resolve)
        .catch(reject)
    }, reject, {
      enableHighAccuracy: Platform.OS === 'android',
      timeout: 10000,
      maximumAge: 1000
    })
  })
}
