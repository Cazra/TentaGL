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
 * An API for fetching and loading audios. 
 * TODO: There are sometimes issues with loading the audio due to browser 
 * compatibility. I'm still looking for some way to universally call the 
 * success callback once its loaded.
 */
TentaGL.AudioLoader = {
  
  _numLoading: 0,
  
  
  /** 
   * Fetches and loads an audio from a URL.
   * @param {string} url    The URL path to the audio file.
   * @param {function(audio: Audio) : undefined} successCB    Callback for when the audio is successfully loaded.
   * @param {function() : undefined} errorCB    Optional. Callback for when there is an error loading the audio.
   */
  load: function(url, successCB, errorCB) {
    var self = this;
    this._numLoading++;
    
    if(!errorCB) {
      errorCB = function() {
        self._numLoading--;
        throw new Error("Could not load image at " + url + ".");
      }
    }
    
    var audio = new Audio();
    audio.oncanplaythrough = function() {
      successCB(audio);
      self._numLoading--;
    };
    audio.src = url;
    audio.load();
  },
  
  
  /** 
   * Returns true iff the AudioLoader is still loading 1 or more audios. 
   * @return {boolean}
   */
  isLoading: function() {
    return (this._numLoading > 0);
  }
  
  
  
};
