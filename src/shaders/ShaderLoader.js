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
 * An API for asynchronously loading shader programs.
 */
TentaGL.ShaderLoader = {
  
  _numLoading: 0,
  
  
  /** 
   * Asynchronously loads the vertex and fragment shader source code for a 
   * shader program. 
   * @param {string} vertURL    The URL of the vertex shader's source code.
   * @param {string} fragURL    The URL of the fragment shader's source code.
   * @param {function(vertSrc: string, fragSrc: string)} callback
   */
  load: function(vertURL, fragURL, callback) {
    var self = this;
    this._numLoading++;
    
    var req = new XMLHttpRequest();
    req.open("get", vertURL);
    req.onerror = function(err) {
      console.log("AJAX error: ", err);
      self._numLoading--;
    };
    req.onreadystatechange = function(e) {
      if (this.readyState == 4 && this.status == 200) {
        var vertSrc = req.responseText;
        self._loadFragSrc(vertSrc, fragURL, callback)
      }
    };
    req.send();
  },
  
  
  
  _loadFragSrc: function(vertSrc, fragURL, callback) {
    var self = this;
    
    var req = new XMLHttpRequest();
    req.open("get", fragURL);
    req.onerror = function(err) {
      console.log("AJAX error: ", err);
      self._numLoading--;
    };
    req.onreadystatechange = function(e) {
      if (this.readyState == 4 && this.status == 200) {
        var fragSrc = req.responseText;
        callback(vertSrc, fragSrc);
        self._numLoading--;
      }
    };
    req.send();
  },
  
  
  /** 
   * Returns true if some shaders are still busy loading.
   */
  isLoading: function() {
    return (this._numLoading > 0);
  },
  
  
  getNumLoading: function() {
    return this._numLoading;
  }
  
};
