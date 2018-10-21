import { Platform } from 'react-native'
import Qs from 'qs'

interface Query {
  sessiontoken: String; // A random string which identifies an autocomplete session for billing purposes. If this parameter is omitted from an autocomplete request, the request is billed independently. See the pricing sheet for details.
  offset: Number; // The position, in the input term, of the last character that the service uses to match predictions. For example, if the input is 'Google' and the offset is 3, the service will match on 'Goo'. The string determined by the offset is matched against the first word in the input term only. For example, if the input term is 'Google abc' and the offset is 3, the service will attempt to match against 'Goo abc'. If no offset is supplied, the service will use the whole term. The offset should generally be set to the position of the text caret.
  location: String; // The point around which you wish to retrieve place information. Must be specified as "latitude,longitude".
  radius: Number; // The distance (in meters) within which to return place results. Note that setting a radius biases results to the indicated area, but may not fully restrict results to the specified area. See Location Biasing and Location Restrict below.
  language: String; // The language code, indicating in which language the results should be returned, if possible. Searches are also biased to the selected language; results in the selected language may be given a higher ranking. See the list of supported languages and their codes. Note that we often update supported languages so this list may not be exhaustive. If language is not supplied, the Place Autocomplete service will attempt to use the native language of the domain from which the request is sent.
  types: String; // The types of place results to return. See Place Types below. If no type is specified, all types will be returned.
  components: String; // A grouping of places to which you would like to restrict your results. Currently, you can use components to filter by up to 5 countries. Countries must be passed as a two character, ISO 3166-1 Alpha-2 compatible country code. For example: components=country:fr would restrict your results to places within France. Multiple countries must be passed as multiple country:XX filters, with the pipe character (|) as a separator. For example: components=country:us|country:pr|country:vi|country:gu|country:mp would restrict your results to places within the United States and its unincorporated organized territories.
  strictbounds: Boolean; // Returns only those places that are strictly within the region defined by location and radius. This is a restriction, rather than a bias, meaning that results outside this region will not be returned even if they match the user input.
}
interface Options {
  key: String; // Your application's API key. This key identifies your application for purposes of quota management. See Get a key for more information. Google Maps APIs Premium Plan customers must use the API project created for them as part of their Premium Plan purchase.
  query: Query; // Certain parameters are required to initiate a Place Autocomplete request. As is standard in URLs, all parameters are separated using the ampersand (&) character. The list of parameters and their possible values are enumerated above.
}

interface MSubstring {
  length: Number; // length of substring in text
  offset: Number; // position of substring in text
}
type MSubstrings = Array<MSubstring>

interface SFormat {
  main_text: String; // contains the main text of a prediction, usually the name of the place.
  main_text_matched_substrings: MSubstrings; // contains an array with offset value and length. These describe the location of the entered term in the prediction result text, so that the term can be highlighted if desired.
  secondary_text: String; // contains the secondary text of a prediction, usually the location of the place.
}
type SFormatting = Array<SFormat>

interface Term {
  offset: Number; // position of term in text
  value: String; // value of term in text
}
type Terms = Array<Term>

interface Result {
  id: String; // unique id for the search result
  place_id: String; // is a textual identifier that uniquely identifies a place. To retrieve information about the place, pass this identifier in the placeId field of a Places API request. For more information about place IDs, see the place ID overview.
  reference: String; // same as place_id
  description: String; // contains the human-readable name for the returned result. For establishment results, this is usually the business name
  matched_substrings: MSubstring; // contains an array with offset value and length. These describe the location of the entered term in the prediction result text, so that the term can be highlighted if desired.
  structured_formatting: SFormatting; // contains the following subfields: main_text, main_text_matched_substrings, secondary_text
  terms: Terms; // contains an array of terms identifying each section of the returned description (a section of the description is generally terminated with a comma). Each entry in the array has a value field, containing the text of the term, and an offset field, defining the start position of this term in the description, measured in Unicode characters.
  types: Array<String>; // contains an array of types that apply to this place. For example: [ "political", "locality" ] or [ "establishment", "geocode" ].
}
type Results = Array<Result>

/** Class containing methods to get results from Google Places */
// TODO: add nearby search without input
export default class GooglePlaces {
  options: Options
  /**
   * Create an instance of the GooglePlaces class.
   * @param {Options} options
   *        Options for creating the handler
   */
  constructor (options: Options) {
    this.options = options
  }

  /**
   * Make a request expecting a JSON response
   * @param {String} url
   *        Request URL for Google Maps
   * @private
   */
  request = (url: String) => new Promise((resolve, reject) => {
    if (!url || typeof url !== 'string') {
      reject(new Error('Invalid request URL.'))
    }

    fetch(url)
      .then(r => r.json())
      .then(resolve)
      .catch(reject)
  })

  /**
   * Search for places matching input
   * @param {String} input
   *        Input string for the search
   * @returns {Promise<Results>}
   *          Returns an unaltered array of results from the Google Places API
   */
  search = (input: String) => new Promise<Results>(async (resolve, reject) => {
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

    const response = await this.request(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?${options}`
      // `https://maps.googleapis.com/maps/api/geocode/json?${options}`
    ).catch(reject)

    resolve((response || {}).predictions || [])
  })

  /**
   * Search for places matching input
   * @param {String} input
   *        Input string for the search
   * @param {Number} radius
   *        Radius in meters to look for places
   * @returns {Promise<Results>}
   *          Returns an unaltered array of results from the Google Places API
   */
  searchNearby = (input: String, radius: Number = 1000) => new Promise<Results>(async (resolve, reject) => {
    navigator.geolocation.getCurrentPosition(async position => {
      const { latitude, longitude } = (position || {}).coords || {}

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

      const response = await this.request(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json?${options}`
        // `https://maps.googleapis.com/maps/api/geocode/json?${options}`
      ).catch(reject)

      resolve((response || {}).predictions || [])
    }, reject, {
      enableHighAccuracy: Platform.OS === 'android',
      timeout: 10000,
      maximumAge: 1000
    })
  })
}
