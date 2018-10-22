import { Platform } from 'react-native'
import * as Qs from 'qs'
import {
  ACQuery,
  PDQuery,
  Options,
  PDResult,
  ACResults
} from './types'

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
  request = (
    url: string = ''
  ) => new Promise<any>((resolve, reject) => {
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
  autocompleteRequest = (
    options: string = ''
  ) => new Promise<ACResults>((resolve, reject) => {
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
   * @param   {ACQuery} query
   *          Query object for the search
   * @returns {Promise<ACResults>}
   *          Returns an unaltered array of results from the Google Places API
   */
  search = (
    input: string = '',
    query: ACQuery = {}
  ) => new Promise<ACResults>(async (resolve, reject) => {
    if (!input || typeof input !== 'string') {
      reject(new Error('Invalid input string given.'))
    }

    const options = Qs.stringify({
      input,
      language: 'en',
      key: this.options.key,
      types: 'establishment',
      ...query
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
   * @param   {ACQuery} query
   *          Query object for the search
   * @returns {Promise<ACResults>}
   *          Returns an unaltered array of results from the Google Places API
   */
  searchNearby = (
    input: string = '',
    radius: number = 1000,
    query: ACQuery = {}
  ) => new Promise<ACResults>(async (resolve, reject) => {
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
        ...query
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

  /**
   * Search for places matching input
   * @param   {string} placeid
   *          Place ID string of the requested place
   * @param   {PDQuery} query
   *          Place ID string of the requested place
   * @returns {Promise<PDResult>}
   *          Returns an unaltered result object from the Google Places API
   */
  getPlaceDetails = (placeid: string = '', query: PDQuery = {}) => new Promise<PDResult>(async (resolve, reject) => {
    if (!placeid || typeof placeid !== 'string') {
      reject(new Error('Invalid Place ID string given.'))
    }

    const options = Qs.stringify({
      placeid,
      language: 'en',
      fields: 'geometry',
      key: this.options.key,
      ...query
    })

    this.request(`https://maps.googleapis.com/maps/api/place/details/json?${options}`)
      .then(res => {
        if (!res || !res.result || (typeof res !== 'object')) {
          return reject(new Error('Invalid response from server'))
        }
        resolve(res.result)
      })
      .catch(reject)
  })
}
