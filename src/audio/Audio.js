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
 * An object used to play an audio file. 
 * @param {string} url        The URL of the audio file.
 * @param {boolean} looping   Optional. Whether the audio should loop. Default false.
 */
TentaGL.Audio = function(url, looping, loopStart) {
  if(!looping) {
    looping = false;
  }
  if(!loopStart) {
    loopStart = 0;
  }
  
  this._loop = looping;
  this._loopStart = loopStart;
  
  var audio = this._audio = new Audio();
  audio.src = url;
  audio.preload = true;
  
  if(looping) {
    audio.onended = function(e) {
      this.currentTime = loopStart;
      this.play();
    };
  }
  
  audio.load();
};


TentaGL.Audio.prototype = {

  constructor: TentaGL.Audio,
  
  isaAudio: true,
  
  /** 
   * Returns whether the audio is ready for playing.
   * @return {boolean}
   */
  isReady: function() {
    return (this._audio.readyState == 4);
  },
  
  
  /** 
   * Sets whether the audio is paused. 
   * @param {boolean} paused
   * @param {boolean}
   */
  paused: function(paused) {
    if(paused !== undefined) {
      this._audio.paused = paused;
    }
    return this._audio.paused;
  },
  
  
  /** 
   * Plays the audio.
   */
  play: function() {
    this._audio.play();
  },
  
  
  
  /** 
   * Setter/getter for whether the audio loops.
   * @param {boolean} loop    Optional. Whether the audio should loop.
   * @param {uint} loopStart  Optional. The start position of the audio loop.
   * @return {boolean}
   */
  loop: function(loop, loopStart) {
    var self = this;
    
    if(loop !== undefined) {
      this._loop = loop;
      
      if(loop) {
        if(loopStart !== undefined) {
          this._loopStart = loopStart;
        }
        
        audio.onended = function(e) {
          this.currentTime = self._loopStart;
          this.play();
        };
      }
      else {
        audio.onended = function(e) {};
      }
    }
    return this._loop;
  }
};



