/* 
 @preserve Copyright (c) 2014 Stephen "Cazra" Lindberg

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 The Software shall be used for Good, not Evil.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
*/


/** 
 * A simple interface around the navigation.geolocation API.
 * Once the user has granted permission for the page to use this API, 
 * it continually receives updates of the user's position and makes this
 * information available without need for callbacks.
 */
Util.Geolocation = {
  
  //////// Permissions
  
  /** 
   * Requests permission from the user to allow use of the geolocation API. 
   * This method must be called and the user must accept before any other
   * Geolocation functions can be used.
   */
  requestPermission: function() {
    var self = this;
    this._watch = navigator.geolocation.watchPosition(function(position) {
      self._allowed = true;
      self._position = position;
    });
  },
  
  
  /** 
   * Returns whether the user has agreed to allow use of the geolocation API.
   * @return {boolean}
   */
  hasPermission: function() {
    return this._allowed;
  },
  
  
  
  //////// Position data
  
  /** 
   * Returns the user's current positioning information. 
   * An error is thrown if the user has not granted permission to use 
   * geolocation.
   * @return {Position}
   */
  getPosition: function() {
    if(!this._allowed) {
      throw new Error("Geolocation has not been authorized.");
    }
    return this._position;
  },
  
  
  /** 
   * Returns the accuracy of the geolocation coordinates, in meters.
   * An error is thrown if the user has not granted permission to use 
   * geolocation.
   * @return {number}
   */
  getAccuracy: function() {
    if(!this._allowed) {
      throw new Error("Geolocation has not been authorized.");
    }
    return this._position.coords.accuracy;
  },
  
  /** 
   * Returns the user's altitude, in meters above the WGS 84 ellipsoid 
   * (see http://earth-info.nga.mil/GandG/publications/tr8350.2/wgs84fin.pdf section 3).
   * If this information is unavailable for the user's device, 
   * then null is returned.
   * An error is thrown if the user has not granted permission to use 
   * geolocation.
   * @return {number}
   */
  getAltitude: function() {
    if(!this._allowed) {
      throw new Error("Geolocation has not been authorized.");
    }
    return this._position.coords.altitude;
  },
  
  /** 
   * Returns the accuracy of the user's altitude, in meters. 
   * If this information is unavailable for the user's device, 
   * then null is returned.
   * An error is thrown if the user has not granted permission to use 
   * geolocation.
   * @return {number}
   */
  getAltitudeAccuracy: function() {
    if(!this._allowed) {
      throw new Error("Geolocation has not been authorized.");
    }
    return this._position.coords.altitudeAccuracy;
  },
  
  
  /** 
   * Returns the user's direction of travel in degrees in the range [0, 360), 
   * clockwise from true north.
   * If this information is unavailable for the user's device, 
   * then null is returned.
   * If the user's speed is 0, then this returns NaN.
   * An error is thrown if the user has not granted permission to use 
   * geolocation.
   * @return {number}
   */
  getHeading: function() {
    if(!this._allowed) {
      throw new Error("Geolocation has not been authorized.");
    }
    return this._position.coords.heading;
  },
  
  
  /** 
   * Returns the user's latitude, longitude coordinates, in decimal degrees. 
   * An error is thrown if the user has not granted permission to use 
   * geolocation.
   * @return {[latitude: number, longitude: number]}
   */
  getCoords: function() {
    if(!this._allowed) {
      throw new Error("Geolocation has not been authorized.");
    }
    return [this._position.coords.latitude, this._position.coords.longitude];
  },
  
  
  /** 
   * Returns the user's latitude, in decimal degrees.
   * An error is thrown if the user has not granted permission to use 
   * geolocation.
   * @return {number}
   */
  getLatitude: function() {
    if(!this._allowed) {
      throw new Error("Geolocation has not been authorized.");
    }
    return this._position.coords.latitude;
  },
  
  
  /** 
   * Returns the user's longitude, in decimal degrees.
   * An error is thrown if the user has not granted permission to use 
   * geolocation.
   * @return {number}
   */
  getLongitude: function() {
    if(!this._allowed) {
      throw new Error("Geolocation has not been authorized.");
    }
    return this._position.coords.longitude;
  },
  
  
  /** 
   * Returns the user's horizontal speed, in meters per second. 
   * If this information is unavailable for the user's device, 
   * then null is returned.
   * An error is thrown if the user has not granted permission to use 
   * geolocation.
   * @return {number}
   */
  getSpeed: function() {
    if(!this._allowed) {
      throw new Error("Geolocation has not been authorized.");
    }
    return this._position.coords.speed;
  },
  
  
  /** 
   * Returns the timestamp of the last geolocation update. 
   * An error is thrown if the user has not granted permission to use 
   * geolocation.
   * @return {uint}
   */
  getTimestamp: function() {
    if(!this._allowed) {
      throw new Error("Geolocation has not been authorized.");
    }
    return this._position.timestamp;
  }
  
};
