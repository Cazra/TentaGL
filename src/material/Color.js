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
 * Constructs an opaque, black Color. See the auxillary constructor methods 
 * for creating other colors using various color models.
 * For a shader program to be able to use a color as a material, you must
 * bind its uniform variable used to store the color's RGBA values using 
 * its bindColorUni method when the program is initialized.
 * @constructor
 * @param {vec4} rgba   Optional. The color's components in normalized RGBA format.
 *      If not provided the default value [0,0,0,1] will be used (opaque black).
 */
TentaGL.Color = function(rgba) {
  if(!rgba) {
    rgba = [0, 0, 0, 1];
  }
  this._rgba = rgba;
};


TentaGL.Color.prototype = {
  
  constructor:TentaGL.Color,
  
  isaColor: true,
  
  /** 
   * Materials are required to provide a clean({WebGLRenderingContext}) method. 
   * For Color, no GL resources are used though, so this does nothing.
   */
  clean:function(gl) {
    // No clean-up needed.
  },
  
  /** 
   * Returns true.
   * @return {Boolean}
   */
  isLoaded:function() {
    return true;
  },
  
  
  /** 
   * Returns a cloned copy of this color.
   * @return {TentaGL.Color}
   */
  clone: function() {
    return TentaGL.Color.RGBA(this.r(), this.g(), this.b(), this.a());
  },
  
  
  //////// RGBA color space
  
  
  /** 
   * Setter/getter for the color's components in normalized RGBA format.
   * @param {vec4 || vec3} rgba   Optional. If given as a vec3, A will be assumed to be 1 (opaque).
   * @return {vec4}
   */
  rgba: function(rgba) {
    if(rgba !== undefined) {
      if(rgba[3] === undefined) {
        rgba[3] = 1;
      }
      this._rgba = vec4.copy([], rgba);
    }
    return this._rgba.slice(0);
  },
  
  
  /** 
   * Setter/getter for the normalized red component.
   * @param {float} r   Optional.
   * @return {float}
   */
  r: function(r) {
    if(r !== undefined) {
      this._rgba[0] = r;
    }
    return this._rgba[0];
  },
  
  
  /** 
   * Setter/getter for the normalized green component.
   * @param {float} g   Optional.
   * @return {float}
   */
  g: function(g) {
    if(g !== undefined) {
      this._rgba[1] = g;
    }
    return this._rgba[1];
  },
  
  
  /** 
   * Setter/getter for the normalized blue component.
   * @param {float} b   Optional.
   * @return {float}
   */
  b: function(b) {
    if(b !== undefined) {
      this._rgba[2] = b;
    }
    return this._rgba[2];
  },
  
  
  /** 
   * Setter/getter for the normalized alpha component.
   * @param {float} a   Optional.
   * @return {float}
   */
  a: function(a) {
    if(a !== undefined) {
      this._rgba[3] = a;
    }
    return this._rgba[3];
  },
  
  
  /** 
   * Setter/getter for the color's components in uint8 format. 
   * @param {vec4} rgba   Optional.
   * @return {vec4}
   */
  rgbaBytes: function(rgba) {
    if(rgba) {
      vec4.scale(this._rgba, rgba, 1/255);
      return rgba;
    }
    else {
      return [this.getRedByte(), this.getGreenByte(), this.getBlueByte(), this.getAlphaByte()];
    }
  },
  
  
  /** 
   * Returns the color's red component as a uint8 value.
   * @return {uint8}
   */
  getRedByte:function() {
    return (this._rgba[0]*255) & 0xFF;
  },
  
  
  /** 
   * Returns the color's green component as a uint8 value.
   * @return {uint8}
   */
  getGreenByte:function() {
    return (this._rgba[1]*255) & 0xFF;
  },
  
  
  /** 
   * Returns the color's blue component as a uint8 value.
   * @return {uint8}
   */
  getBlueByte:function() {
    return (this._rgba[2]*255) & 0xFF;
  },
  
  
  /** 
   * Returns the color's alpha component as a uint8 value.
   * @return {uint8}
   */
  getAlphaByte:function() {
    return (this._rgba[3]*255) & 0xFF;
  },
  
  
  //////// Hex color conversion
  
  
  /** 
   * Setter/getter for the color's components in 32-bit ARGB hexadecimal format. 
   * Bits 31-24 contain the color's alpha component. 
   * Bits 23-16 contain the color's red component. Bits 15-8 contain
   * the color's green component. Bits 7-0 contain the color's blue
   * component. The alpha bits are NOT optional. Alpha will be 0 (transparent).
   * @param {uint32} argb   Optional.
   * @return {uint32}
   */
  hex: function(argb) {
    if(argb !== undefined) {
      var a = ((argb >>> 24) & 0x000000FF)/255;
      var r = ((argb >>> 16) & 0x000000FF)/255;
      var g = ((argb >>> 8) & 0x000000FF)/255;
      var b = (argb & 0x000000FF)/255;
      
      this.rgba([r, g, b, a]);
      return argb;
    }
    else {
      var hex = Math.floor(this.a()*255)<<24;
      hex += Math.floor(this.r()*255)<<16;
      hex += Math.floor(this.g()*255)<<8;
      hex += Math.floor(this.b()*255);
      return hex>>>0;
    }
  },
  
  
  //////// HSBA color space
  
  /** 
   * Constructs a color from normalized HSBA (hue, saturation, brightness, alpha)
   * color components.
   * @param {Number} h  hue
   * @param {Number} s  saturation
   * @param {Number} b  brightness
   * @param {Number} a  alpha (Optional. Default 1 if not provided.)
   * @return {TentaGL.Color} this
   */
  setHSBA:function(h, s, b, a) {  
    if(a === undefined) {
      a = 1;
    }
    var rgba = TentaGL.Color.HSBAtoRGBA(h, s, b, a);
    this.rgba(rgba);
  },
  
  
  /**
   * Returns a representation of this color in the HSBA 
   * (Hue, Saturation, Brightness, Alpha) color model.
   * @return {Array} The normalized HSBA components.
   */
  getHSBA:function() {
    var r = this.r();
    var g = this.g();
    var b = this.b();
    var a = this.a();
    
    return TentaGL.Color.RGBAtoHSBA(r, g, b, a);
  },
  
  
  /** 
   * Setter/getter for the color's components in the HSBA color model
   * (Hue, Saturation, Brightness, Alpha), in normalized format.
   * @param {vec4} hsba   Optional.
   * @return {vec4}
   */
  hsba: function(hsba) {
    if(hsba) {
      if(hsba[3] === undefined) {
        hsba[3] = 1;
      }
      
      var h = hsba[0];
      var s = hsba[1];
      var b = hsba[2];
      var a = hsba[3];
      
      var hp = (h-Math.floor(h))*6.0;
      var chroma = s*b;
      var x = chroma*(1-Math.abs(hp % 2 - 1));
      var m = b-chroma;
      
      if(hp >= 0 && hp < 1) {
        this.rgba([chroma + m, x + m, m, a]);
      }
      else if(hp >= 1 && hp < 2) {
        this.rgba([x + m, chroma + m, m, a]);
      }
      else if(hp >= 2 && hp < 3) {
        this.rgba([m, chroma + m, x + m, a]);
      }
      else if(hp >= 3 && hp < 4) {
        this.rgba([m, x + m, chroma + m, a]);
      }
      else if(hp >= 4 && hp < 5) {
        this.rgba([x + m, m, chroma + m, a]);
      }
      else if(hp >= 5 && hp < 6) {
        this.rgba([chroma + m, m, x + m, a]);
      }
      else {
        this.rgba([m, m, m, a]);
      }
      
      return hsba;
    }
    else {
      var r = this.r();
      var g = this.g();
      var b = this.b();
      var a = this.a();
      
      var max = Math.max(r,g,b);
      var min = Math.min(r,g,b);
      var chroma = max-min;
      
      // compute the hue
      var hue = 0;
      if(chroma == 0) {
        hue = 0;
      }
      else if(max == r) {
        hue = ((g - b)/chroma) % 6;
      }
      else if(max = g) {
        hue = ((b-r)/chroma) + 2;
      }
      else {
        hue = ((r-g)/chroma) + 4;
      }
      hue /= 6.0;
      
      // compute the brightness/value
      var brightness = max;
      
      // compute the saturation
      var saturation = 0;
      if(chroma != 0) {
        saturation = chroma/brightness;
      }
          
      return [hue, saturation, brightness, a];
    }
  },
  
  
  /** 
   * Setter/getter for the color's normalized hue. 
   * @param {float} h   Optional.
   * @return {float}
   */
  hue: function(h) {
    var hsba = this.hsba();
    if(h !== undefined) {
      hsba[0] = h;
      this.hsba(h, hsba[1], hsba[2], hsba[3]);
    }
    return hsba[0];
  },
  
  
  /** 
   * Setter/getter for the color's normalized saturation.
   * @param {float} s   Optional.
   * @return {float}
   */
  saturation: function(s) {
    var hsba = this.hsba();
    if(s !== undefined) {
      hsba[1] = s;
      this.hsba(hsba[0], s, hsba[2], hsba[3]);
    }
    return hsba[1];
  },
  
  /** 
   * Setter/getter for the color's normalized brightness.
   * @param {float} b   Optional.
   * @return {float}
   */
  brightness: function(b) {
    var hsba = this.hsba();
    if(b !== undefined) {
      hsba[2] = b;
      this.hsba(hsba[0], hsba[1], b, hsba[3]);
    }
    return hsba[2];
  },
  
  //////// GL state
  
  /** 
   * Sets up the currently bound ShaderProgram so that its bound vec4 color
   * uniform variable is set to this color's RGBA values.
   * @param {WebGLRenderingContext} gl
   */
  useMe:function(gl) {
    var program = TentaGL.ShaderLib.current(gl);
    if(program.setColor) {
      program.setColor(gl, this._rgba);
    }
  },
  
  
  
  //////// Misc.
  
  /** 
   * A color is equal to another color if their RGBA values are the same. 
   * @param {TentaGL.Color} other
   * @return {Boolean}
   */
  equals:function(other) {
    return (  this.r() == other.r() && 
              this.g() == other.g() &&
              this.b() == other.b() &&
              this.a() == other.a());
  },
  
  
  /** 
   * Returns a CSS string representation of this color. 
   * @return {string}
   */
  toCSS:function() {
    return "rgb(" + this.getRedByte() + "," + this.getGreenByte() + "," + this.getBlueByte() + ")";
  }

};


Util.Inheritance.inherit(TentaGL.Color, TentaGL.Material);


//////// Convenience constructors


/** 
 * Returns a new color from normalized RGBA (red, green, blue, alpha) 
 * color components.
 * @param {Number} r  red
 * @param {Number} g  green
 * @param {Number} b  blue
 * @param {Number} a  alpha (Optional, will be set to 1 if not provided)
 */
TentaGL.Color.RGBA = function(r, g, b, a) {
  return new TentaGL.Color([r, g, b, a]);
};


/** 
 * Returns a new color from RGBA (red, green, blue, alpha) 
 * color component uint8 values.
 * @param {Number} r  red
 * @param {Number} g  green
 * @param {Number} b  blue
 * @param {Number} a  alpha (Optional, will be set to 255 if not provided)
 */
TentaGL.Color.RGBABytes = function(r, g, b, a) {
  if(a === undefined) {
    a = 255;
  }
  return new TentaGL.Color([r/255, g/255, b/255, a/255]);
};


/**
 * Retuns a new Color, given a 32-bit unsigned integer representing its ARGB
 * (alpha, red, green, blue) color components.
 * @param {int} argb  Bits 31-24 contain the color's alpha component. 
 *      Bits 23-16 contain the color's red component. Bits 15-8 contain
 *      the color's green component. Bits 7-0 contain the color's blue
 *      component. The alpha component is NOT optional.
 */
TentaGL.Color.Hex = function(argb) {
  var color = new TentaGL.Color();
  color.hex(argb);
  return color;
};


/** 
 * Returns a new Color, given its normalized HSBA 
 * (hue, saturation, brightness, alpha) color components.
 * @param {vec3 || vec4} hsba   If given as a vec3, a will be set to 1.
 * @return {TentaGL.Color}
 */
TentaGL.Color.HSBA = function(hsba) {
  var color = new TentaGL.Color();
  color.hsba([h, s, b, a]);
  return color;
};


//////// Color format conversions


/** 
 * Returns the ARGB hex representation of the color defined by the given 
 * uint8 rgba color components. 
 * @param {uint8} r
 * @param {uint8} g
 * @param {uint8} b
 * @param {uint8} a
 * @return {uint32}
 */
TentaGL.Color.rgba2Hex = function(r, g, b, a) {
    var hex = (a)<<24;
    hex += (r)<<16;
    hex += (g)<<8;
    hex += b;
    return hex>>>0;
};



/**
   * Returns a representation of this color in the HSBA 
   * (Hue, Saturation, Brightness, Alpha) color model.
   * @param {Number} r
   * @param {Number} g
   * @param {Number} b
   * @param {Number} a
   * @return {Array} The normalized HSBA components.
   */
TentaGL.Color.RGBAtoHSBA = function(r, g, b, a) {
  if(a === undefined) {
    a = 1;
  }
  
  var max = Math.max(r,g,b);
  var min = Math.min(r,g,b);
  var chroma = max-min;
  
  // compute the hue
  var hue = 0;
  if(chroma == 0) {
    hue = 0;
  }
  else if(max == r) {
    hue = ((g - b)/chroma) % 6;
  }
  else if(max = g) {
    hue = ((b-r)/chroma) + 2;
  }
  else {
    hue = ((r-g)/chroma) + 4;
  }
  hue /= 6.0;
  
  // compute the brightness/value
  var brightness = max;
  
  // compute the saturation
  var saturation = 0;
  if(chroma != 0) {
    saturation = chroma/brightness;
  }
      
  return [hue, saturation, brightness, a];
};



/** 
 * Constructs a color from normalized HSBA (hue, saturation, brightness, alpha)
 * color components.
 * @param {Number} h  hue
 * @param {Number} s  saturation
 * @param {Number} b  brightness
 * @param {Number} a  alpha
 * @return {Array{Number}} this
 */
TentaGL.Color.HSBAtoRGBA = function(h, s, b, a) { 
  if(a === undefined) {
    a = 1;
  }
  
  var hp = (h-Math.floor(h))*6.0;
  var chroma = s*b;
  var x = chroma*(1-Math.abs(hp % 2 - 1));
  var m = b-chroma;
  
  if(hp >= 0 && hp < 1) {
    return [chroma + m, x + m, m, a];
  }
  else if(hp >= 1 && hp < 2) {
    return [x + m, chroma + m, m, a];
  }
  else if(hp >= 2 && hp < 3) {
    return [m, chroma + m, x + m, a];
  }
  else if(hp >= 3 && hp < 4) {
    return [m, x + m, chroma + m, a];
  }
  else if(hp >= 4 && hp < 5) {
    return [x + m, m, chroma + m, a];
  }
  else if(hp >= 5 && hp < 6) {
    return [chroma + m, m, x + m, a];
  }
  else {
    return [m, m, m, a];
  }
};


/** 
 * Converts an ARGB hex value for a color to a vec4 containing the equivalent 
 * normalized RGBA components.
 * @param {uint32} hex    Bits 31-24 contain the color's alpha component. 
 *      Bits 23-16 contain the color's red component. Bits 15-8 contain
 *      the color's green component. Bits 7-0 contain the color's blue
 *      component. The alpha bits are NOT optional. Alpha will be 0 (transparent).
 * @return {vec4}
 */
TentaGL.Color.hexToRGBA = function(hex) {
  var a = ((hex >>> 24) & 0x000000FF)/255;
  var r = ((hex >>> 16) & 0x000000FF)/255;
  var g = ((hex >>> 8) & 0x000000FF)/255;
  var b = (hex & 0x000000FF)/255;
  
  return vec4.fromValues(r, g, b, a);
};



//////// Some commonly used colors

TentaGL.Color.BLACK = TentaGL.Color.Hex(0xFF000000);
TentaGL.Color.BLUE = TentaGL.Color.Hex(0xFF0000FF);
TentaGL.Color.CYAN = TentaGL.Color.Hex(0xFF00FFFF);
TentaGL.Color.GREEN = TentaGL.Color.Hex(0xFF00FF00);
TentaGL.Color.GREY = TentaGL.Color.Hex(0xFF888888);
TentaGL.Color.MAGENTA = TentaGL.Color.Hex(0xFFFF00FF);
TentaGL.Color.RED = TentaGL.Color.Hex(0xFFFF0000);
TentaGL.Color.WHITE = TentaGL.Color.Hex(0xFFFFFFFF);
TentaGL.Color.YELLOW = TentaGL.Color.Hex(0xFFFFFF00);


