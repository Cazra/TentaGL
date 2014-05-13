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
 */
TentaGL.Color = function() {
  this._rgba = vec4.create();
  this.setRGBA(0, 0, 0, 1);
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
  
  
  
  //////// RGBA color space
  
  /** 
   * Returns a copy of the color's normalized RGBA components. 
   * @return {vec4}
   */
  getRGBA:function() {
    return vec4.clone(this._rgba);
  },
  
  /** 
   * Returns a copy of the color's uint8 RGBA components. 
   * @return {vec4}
   */
  getRGBABytes:function() {
    return vec4.fromValues(this.getRedByte(), this.getGreenByte(), this.getBlueByte(), this.getAlphaByte());
  },
  
  /** 
   * Returns the color's normalized red component.
   * @return {Number}
   */
  getRed:function() {
    return this._rgba[0];
  },
  
  /** 
   * Returns the color's red component as a uint8 value.
   * @return {uint8}
   */
  getRedByte:function() {
    return (this._rgba[0]*255) & 0xFF;
  },
  
  /** 
   * Returns the color's normalized green component.
   * @return {Number}
   */
  getGreen:function() {
    return this._rgba[1];
  },
  
  /** 
   * Returns the color's green component as a uint8 value.
   * @return {uint8}
   */
  getGreenByte:function() {
    return (this._rgba[1]*255) & 0xFF;
  },
  
  
  /** 
   * Returns the color's normalized blue component.
   * @return {Number}
   */
  getBlue:function() {
    return this._rgba[2];
  },
  
  
  /** 
   * Returns the color's blue component as a uint8 value.
   * @return {uint8}
   */
  getBlueByte:function() {
    return (this._rgba[2]*255) & 0xFF;
  },
  
  /** 
   * Returns the color's normalized alpha component.
   * @return {Number}
   */
  getAlpha:function() {
    return this._rgba[3];
  },
  
  
  /** 
   * Returns the color's alpha component as a uint8 value.
   * @return {uint8}
   */
  getAlphaByte:function() {
    return (this._rgba[3]*255) & 0xFF;
  },
  
  /** 
   * Sets the RGBA color components for this color. 
   * @param {Number} r  red
   * @param {Number} g  green
   * @param {Number} b  blue
   * @param {Number} a  alpha (Optional, will keep previous value if not provided)
   * @return {TentaGL.Color} this
   */
  setRGBA:function(r, g, b, a) {
    this._rgba[0] = r;
    this._rgba[1] = g;
    this._rgba[2] = b;
    
    if(a !== undefined) {
      this._rgba[3] = a;
    }
    return this;
  },
  
  /** 
   * Sets the normalized red component of this color. 
   * @param {Number} red
   * @return {TentaGL.Color} this
   */
  setRed:function(red) {
    this._rgba[0] = red;
    return this;
  },
  
  /** 
   * Sets the normalized green component of this color. 
   * @param {Number} green
   * @return {TentaGL.Color} this
   */
  setGreen:function(green) {
    this._rgba[1] = green;
    return this;
  },
  
  /** 
   * Sets the normalized blue component of this color. 
   * @param {Number} blue
   * @return {TentaGL.Color} this
   */
  setBlue:function(blue) {
    this._rgba[2] = blue;
    return this;
  },
  
  /** 
   * Sets the normalized alpha component of this color. 
   * @param {Number} alpha
   * @return {TentaGL.Color} this
   */
  setAlpha:function(alpha) {
    this._rgba[3] = alpha;
    return this;
  },
  
  
  //////// Hex color conversion
  
  /**
   * Sets the RGBA components of this color, given a 32-bit unsigned integer 
   * representing them in ARGB (alpha, red, green, blue) form.
   * @param {int} argb  Bits 31-24 contain the color's alpha component. 
   *      Bits 23-16 contain the color's red component. Bits 15-8 contain
   *      the color's green component. Bits 7-0 contain the color's blue
   *      component. The alpha bits are NOT optional. Alpha will be 0 (transparent).
   * @return {TentaGL.Color} this
   */
  setHex:function(argb) {
    var a = ((argb >>> 24) & 0x000000FF)/255;
    var r = ((argb >>> 16) & 0x000000FF)/255;
    var g = ((argb >>> 8) & 0x000000FF)/255;
    var b = (argb & 0x000000FF)/255;
    
    return this.setRGBA(r, g, b, a);
  },
  
  
  /** Returns the ARGB hex representation of this color. */
  getHex:function() {
    return TentaGL.Color.rgba2Hex(this.getRed(), this.getGreen(), this.getBlue(), this.getAlpha());
  },
  
  
  //////// HSBA color space
  
  /** 
   * Constructs a color from normalized HSBA (hue, saturation, brightness, alpha)
   * color components.
   * @param {Number} h  hue
   * @param {Number} s  saturation
   * @param {Number} b  brightness
   * @param {Number} a  alpha (Optional, will keep previous value if not provided)
   * @return {TentaGL.Color} this
   */
  setHSBA:function(h, s, b, a) {  
    if(a === undefined) {
      a = this.getAlpha();
    }
    var rgba = TentaGL.Color.HSBAtoRGBA(h, s, b, a);
    this.setRGBA(rgab[0], rgba[1], rgba[2], rgba[3]);
  },
  
  
  /**
   * Returns a representation of this color in the HSBA 
   * (Hue, Saturation, Brightness, Alpha) color model.
   * @return {Array} The normalized HSBA components.
   */
  getHSBA:function() {
    var r = this.getRed();
    var g = this.getGreen();
    var b = this.getBlue();
    var a = this.getAlpha();
    
    return TentaGL.Color.RGBAtoHSBA(r, g, b, a);
  },
  
  /** 
   * Returns the hue of this color in the HSBA color model. 
   * @return {Number}
   */
  getHue:function() {
    return this.getHSBA()[0];
  },
  
  
  /** Sets the hue of this color. */
  setHue:function(hue) {
    var hsba = this.getHSBA();
    this.setHSBA(hue, hsba[1], hsba[2], hsba[3]);
  },
  
  
  /** 
   * Returns the saturation of this color in the HSBA color model. 
   * @return {Number}
   */
  getSaturation:function() {
    return this.getHSBA()[1];
  },
  
  /** Sets the saturation of this color. */
  setSaturation:function(sat) {
    var hsba = this.getHSBA();
    this.setHSBA(hsba[0], sat, hsba[2], hsba[3]);
  },
  
  
  /** 
   * Returns the brightness of this color in the HSBA color model. 
   * @return {Number}
   */
  getBrightness:function() {
    return this.getHSBA()[2];
  },
  
  
  /** Sets the brightness of this color. */
  setBrightness:function(bright) {
    var hsba = this.getHSBA();
    this.setHSBA(hsba[0], hsba[1], bright, hsba[3]);
  },
  
  
  
  //////// GL state
  
  /** 
   * Sets up the currently bound ShaderProgram so that its bound vec4 color
   * uniform variable is set to this color's RGBA values.
   * @param {WebGLRenderingContext} gl
   */
  useMe:function(gl) {
    TentaGL.ShaderLib.current(gl).setColorUniValue(gl, this._rgba);
  },
  
  
  
  //////// Misc.
  
  /** 
   * A color is equal to another color if their RGBA values are the same. 
   * @param {TentaGL.Color} other
   * @return {Boolean}
   */
  equals:function(other) {
    return (  this.getRed() == other.getRed() && 
              this.getGreen() == other.getGreen() &&
              this.getBlue() == other.getBlue() &&
              this.getAlpha() == other.getAlpha());
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
  return (new TentaGL.Color()).setRGBA(r, g, b, a);
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
  return (new TentaGL.Color()).setRGBA(r/255, g/255, b/255, a/255);
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
  return (new TentaGL.Color()).setHex(argb);
};


/** 
 * Returns a new Color, given its normalized HSBA 
 * (hue, saturation, brightness, alpha) color components.
 * @param {Number} h  hue
 * @param {Number} s  saturation
 * @param {Number} b  brightness
 * @param {Number} a  alpha (Optional, will be set to 1 if not provided)
 */
TentaGL.Color.HSBA = function(h, s, b, a) {
  return (new TentaGL.Color()).setHSBA(h, s, b, a);
};


/** 
 * Returns a copy of an existing Color.
 * @param {TentaGL.Color} color
 */
TentaGL.Color.clone = function(color) {
  return (new TentaGL.Color()).setRGBA(color.getRed(), color.getGreen(), color.getBlue(), color.getAlpha());
};


/** 
 * Returns the ARGB hex representation of the color defined by the given 
 * normalized rgba color components. 
 * @param {Number} r
 * @param {Number} g
 * @param {Number} b
 * @param {Number} a
 * @return {uint32}
 */
TentaGL.Color.nrgba2Hex = function(r, g, b, a) {
    var hex = (a*255)<<24;
    hex += (r*255)<<16;
    hex += (g*255)<<8;
    hex += b*255;
    return hex;
};

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
    return hex;
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




