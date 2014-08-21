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
 * @param {vec4 || vec3} rgba   Optional. The color's components in normalized 
 *      RGBA format. If not provided the default value [0,0,0,1] will be used 
 *      (opaque black). If provided as a vec3, the alpha component will be set
 *      to 1.
 */
TentaGL.Color = function(rgba) {
  if(!rgba) {
    rgba = [0, 0, 0, 1];
  }
  if(rgba[3] === undefined) {
    rgba[3] = 1;
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
   * Returns a cloned copy of this color.
   * @return {TentaGL.Color}
   */
  clone: function() {
    return new TentaGL.Color(this.rgba());
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
   * component. The alpha bits are NOT optional.
   * @param {uint32} hex   Optional.
   * @return {uint32}
   */
  hex: function(hex) {
    if(hex) {
      var rgba = TentaGL.Color.hex2rgba(hex);
      this.rgba(rgba);
      return hex;
    }
    else {
      return TentaGL.Color.rgba2hex(this.rgba());
    }
  },
  
  
  //////// HSBA color space
  
  
  /** 
   * Setter/getter for the color's components in the HSBA color model
   * (Hue, Saturation, Brightness, Alpha), in normalized format.
   * @param {vec3 || vec4} hsba   Optional. If provided as a vec3, alpha will be set to 1.
   * @return {vec4}
   */
  hsba: function(hsba) {
    if(hsba) {
      if(hsba[3] === undefined) {
        hsba[3] = 1;
      }
      
      var rgba = TentaGL.Color.hsba2rgba(hsba);
      this.rgba(rgba);
      return hsba;
    }
    else {
      return TentaGL.Color.rgba2hsba(this.rgba());
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
      this.hsba(hsba);
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
      this.hsba(hsba);
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
      this.hsba(hsba);
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
 * Returns a new color from uint8 RGBA (red, green, blue, alpha) 
 * color component values.
 * @param {vec3 || vec4} rgba   If provided as a vec3, alpha will be set to 255.
 * @return {TentaGL.Color}
 */
TentaGL.Color.RGBABytes = function(rgba) {
  var color = new TentaGL.Color();
  color.rgbaBytes(rgba);
  return color;
};


/** 
 * Returns a new color from uint8 RGB (red, green, blue, alpha) 
 * color component values. Alpha is set to 255.
 * @param {vec3} rgb
 * @return {TentaGL.Color}
 */
TentaGL.Color.RGBBytes = function(rgb) {
  return TentaGL.Color.RGBABytes(rgb);
},



/**
 * Retuns a new Color, given a 32-bit unsigned integer representing its ARGB
 * (alpha, red, green, blue) color components.
 * @param {uint32} hex  Bits 31-24 contain the color's alpha component. 
 *      Bits 23-16 contain the color's red component. Bits 15-8 contain
 *      the color's green component. Bits 7-0 contain the color's blue
 *      component. The alpha component is NOT optional.
 * @return {TentaGL.Color}
 */
TentaGL.Color.Hex = function(hex) {
  var color = new TentaGL.Color();
  color.hex(hex);
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
  color.hsba(hsba);
  return color;
};


/** 
 * Returns a new Color, given its normalized HSB 
 * (hue, saturation, brightness) color components. Alpha is set to 1.
 * @param {vec3} hsb
 * @return {TentaGL.Color}
 */
TentaGL.Color.HSB = function(hsb) {
  return TentaGL.Color.HSBA(hsb);
},


//////// Color format conversions


/** 
 * Returns the ARGB hex representation of the color defined by the given 
 * normalized rgba color components. 
 * Bits 31-24 contain the color's alpha component. 
 * Bits 23-16 contain the color's red component. Bits 15-8 contain
 * the color's green component. Bits 7-0 contain the color's blue
 * component. The alpha bits are NOT optional. Alpha will be 0 (transparent).
 * @param {vec3 || vec4} rgba   If provided as a vec3, alpha is assumed to be 255.
 * @return {uint32}
 */
TentaGL.Color.rgba2hex = function(rgba) {
  if(rgba[3] === undefined) {
    rgba[3] = 1;
  }
  var bytes = vec4.scale([], rgba, 255);
  
  var hex = (bytes[3])<<24;
  hex += (bytes[0])<<16;
  hex += (bytes[1])<<8;
  hex += bytes[2];
  return hex>>>0;
};



/** 
 * Returns the ARGB hex representation of the color defined by the given 
 * uint8 rgba color components. 
 * Bits 31-24 contain the color's alpha component. 
 * Bits 23-16 contain the color's red component. Bits 15-8 contain
 * the color's green component. Bits 7-0 contain the color's blue
 * component. The alpha bits are NOT optional. Alpha will be 0 (transparent).
 * @param {vec3 || vec4} rgba   If provided as a vec3, alpha is assumed to be 255.
 * @return {uint32}
 */
TentaGL.Color.rgbaBytes2hex = function(rgba) {
  if(rgba[3] === undefined) {
    rgba[3] = 255;
  }
  var hex = (rgba[3])<<24;
  hex += (rgba[0])<<16;
  hex += (rgba[1])<<8;
  hex += rgba[2];
  return hex>>>0;
};


/** 
 * Converts an ARGB hex value for a color to a vec4 containing the equivalent 
 * normalized RGBA components.
 * Bits 31-24 contain the color's alpha component. 
 * Bits 23-16 contain the color's red component. Bits 15-8 contain
 * the color's green component. Bits 7-0 contain the color's blue
 * component. The alpha bits are NOT optional. Alpha will be 0 (transparent).
 * @param {uint32} hex
 * @return {vec4}
 */
TentaGL.Color.hex2rgba = function(hex) {
  var a = ((hex >>> 24) & 0x000000FF)/255;
  var r = ((hex >>> 16) & 0x000000FF)/255;
  var g = ((hex >>> 8) & 0x000000FF)/255;
  var b = (hex & 0x000000FF)/255;
  
  return vec4.fromValues(r, g, b, a);
};




/**
 * Returns a representation of this color in the HSBA 
 * (Hue, Saturation, Brightness, Alpha) color model.
 * @param {vec3 || vec4} rgba    If provided as a vec3, alpha is assumed to be 1.
 * @return {vec4} The normalized HSBA components.
 */
TentaGL.Color.rgba2hsba = function(rgba) {
  var r = rgba[0];
  var g = rgba[1];
  var b = rgba[2];
  var a = rgba[3];
  
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
 * @param {vec3 || vec4} hsba    If provided as a vec3, alpha is assumed to be 1.
 * @return {vec4}
 */
TentaGL.Color.hsba2rgba = function(hsba) { 
  var h = hsba[0];
  var s = hsba[1];
  var b = hsba[2];
  var a = hsba[3];
  
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






//////// Some commonly used colors

TentaGL.Color.CLEAR = TentaGL.Color.Hex(0x00000000);
TentaGL.Color.BLACK = TentaGL.Color.Hex(0xFF000000);
TentaGL.Color.BLUE = TentaGL.Color.Hex(0xFF0000FF);
TentaGL.Color.CYAN = TentaGL.Color.Hex(0xFF00FFFF);
TentaGL.Color.GREEN = TentaGL.Color.Hex(0xFF00FF00);
TentaGL.Color.GREY = TentaGL.Color.Hex(0xFF888888);
TentaGL.Color.MAGENTA = TentaGL.Color.Hex(0xFFFF00FF);
TentaGL.Color.RED = TentaGL.Color.Hex(0xFFFF0000);
TentaGL.Color.WHITE = TentaGL.Color.Hex(0xFFFFFFFF);
TentaGL.Color.YELLOW = TentaGL.Color.Hex(0xFFFFFF00);


