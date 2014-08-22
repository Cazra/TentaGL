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
 * A small API for metadata about the user's browser.
 */
Util.Browser = {
  
  /** 
   * Detects and caches the running browser's metadata.
   */
  _loadData: function() {
    
    var ua = navigator.userAgent;
    
    // Detect browser type
    this._chrome = this._getVersion("chrome", ua);
    this._safari = this._getVersion("safari", ua);
    this._firefox = this._getVersion("firefox", ua);
    this._opera = this._getVersion("opera", ua);
    this._webkit = this._getVersion("webkit", ua);
    this._gecko = this._getVersion("gecko", ua);
    
    // Detecting Internet Explorer is different... of course...
    var msie = /msie [^;]+/i.exec(ua);
    if(msie) {
      this._ie = msie[0].substring(match[0].indexOf(" ") + 1);
    }
    
    
    // Detect operating system
    var windows = /windows[^;]*|win32[^;]*|win64[^;]*/i.exec(ua);
    if(windows) {
      this._os = this._windows = windows[0];
    }
    
    var mac = /macintosh[^;]*|mac os x[^;]*/i.exec(ua);
    if(mac) {
      this._os = this._mac = mac[0];
    }
    
    var linux = /linux[^;]*/i.exec(ua);
    if(linux) {
      this._os = this._linus = linux[0];
    }
    
    
    // Is this page running in a secure connection?
    this._isSecure = /^https/i.test(window.location.protocol);
  },
  
  
  _getVersion: function(name, ua) {
    var match = new RegExp(name + "\/[^ ]+", "i").exec(ua);
    if(match) {
      return match[0].substring(match[0].indexOf("/") + 1);
    }
    else {
      return undefined;
    }
  },
  
  
  //////// Browser type
  
  
  /** 
   * Returns the browser's type and version. If it could not be determined, 
   * undefined is returned.
   * @return {string}
   */
  type: function() {
    if(this.chrome()) {
      return "Chrome " + this.chrome();
    }
    else if(this.safari()) {
      return "Safari " + this.safari();
    }
    else if(this.firefox()) {
      return "Firefox " + this.firefox();
    }
    else if(this.opera()) {
      return "Opera " + this.opera();
    }
    else if(this.ie()) {
      return "Internet Explorer " + this.ie();
    }
    else {
      return undefined;
    }
  },
  
  
  
  /** 
   * Determines whether we are running in a Chrome browser. If we are, this 
   * returns the Chrome version number. Otherwise, undefined is returned.
   * @return {string}
   */
  chrome: function() {
    return this._chrome;
  },
  
  
  /** 
   * Deteremines whether we are running in a Safari browser. If we are, this 
   * returns the Safari version number. Otherwise, undefined is returned.
   * @return {string}
   */
  safari: function() {
    return this._safari;
  },
  
  
  /** 
   * Deteremines whether we are running in a Firefox browser. If we are, this 
   * returns the Firefox version number. Otherwise, undefined is returned.
   * @return {string}
   */
  firefox: function() {
    return this._firefox;
  },
  
  
  /** 
   * Deteremines whether we are running in an Opera browser. If we are, this 
   * returns the Opera version number. Otherwise, undefined is returned.
   * @return {string}
   */
  opera: function() {
    return this._opera;
  },
  
  
  /** 
   * Deteremines whether we are running in a Internet Explorer browser. If we are, this 
   * returns the Internet Explorer version number. Otherwise, undefined is returned.
   * @return {string}
   */
  ie: function() {
    return this._ie;
  },
  
  
  
  //////// Javascript engine
  
  
  /** 
   * Returns the name and version of the browser's Javascript engine.
   * If it could not be determined, undefined is returned.
   * @return {string}
   */
  jsEngine: function() {
    if(this.webkit()) {
      return "Webkit " + this.webkit();
    }
    else if(this.gecko()) {
      return "Gecko " + this.gecko();
    }
    else {
      return undefined;
    }
  },
  
  
  /** 
   * Deteremines whether we are running in a Webkit browser. If we are, this 
   * returns the Webkit version number. Otherwise, undefined is returned.
   * @return {string}
   */
  webkit: function() {
    return this._webkit;
  },
  
  
  /** 
   * Deteremines whether we are running in a Gecko browser. If we are, this 
   * returns the Gecko version number. Otherwise, undefined is returned.
   * @return {string}
   */
  gecko: function() {
    return this._gecko;
  },
  
  
  //////// Operating system
  
  /** 
   * Returns the name of the operating system the browser is running in.
   * @return {string}
   */
  os: function() {
    return this._os;
  },
  
  
  /** 
   * If the browser is running in a Windows operating system, this returns
   * the version of Windows.
   * @return {string}
   */
  windows: function() {
    return this._windows;
  },
  
  
  /** 
   * If the browser is running in a Macintosh operating system, this returns
   * the version of Macintosh.
   * @return {string}
   */
  mac: function() {
    return this._mac;
  },
  
  
  /** 
   * If the browser is running in a Linux operating system, this returns
   * the version of Linux.
   * @return {string}
   */
  linux: function() {
    return this._linux;
  },
  
  
  //////// browser security
  
  /** 
   * Returns whether the connection to this page is secure.
   * @return {boolean}
   */
  isSecure: function() {
    return this._isSecure;
  }
  
};

Util.Browser._loadData();
