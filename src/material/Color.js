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
 * If a ShaderProgram uses a Color as a Material, that Shader must have a 
 * uniform vec4 "color" to store the Color's RGBA values.
 * @constructor
 */
TentaGL.Color = function() {
  this._rgba = vec4.fromValues(0, 0, 0, 1);
};


TentaGL.Color.prototype = {
  
  constructor:TentaGL.Color,
  
  
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
   * Returns a copy of the color's normalized RGBA components. 
   * @return {vec4}
   */
  getRGBA:function() {
    return vec4.clone(this._rgba);
  },
  
  
  /** 
   * Returns the color's normalized red component.
   * @return {Number}
   */
  getRed:function() {
    return this._rgba[0];
  },
  
  /** 
   * Returns the color's normalized green component.
   * @return {Number}
   */
  getGreen:function() {
    return this._rgba[1];
  },
  
  /** 
   * Returns the color's normalized blue component.
   * @return {Number}
   */
  getBlue:function() {
    return this._rgba[2];
  },
  
  /** 
   * Returns the color's normalized alpha component.
   * @return {Number}
   */
  getAlpha:function() {
    return this._rgba[3];
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
    var a = ((argb >>> 24) & 0x000000FF);
    var r = ((argb >>> 16) & 0x000000FF);
    var g = ((argb >>> 8) & 0x000000FF);
    var b = (argb & 0x000000FF);
    
    return this.setRGBA(r, g, b, a);
  },
   
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
    var hp = (h-Math.floor(h))*6.0;
    var chroma = s*b;
    var x = chroma*(1-Math.abs(hp % 2 - 1));
    var m = b-chroma;
    
    if(hp >= 0 && hp < 1) {
      return this.setRGBA(chroma + m, x + m, m, a);
    }
    else if(hp >= 1 && hp < 2) {
      return this.setRGBA(x + m, chroma + m, m, a);
    }
    else if(hp >= 2 && hp < 3) {
      return this.setRGBA(m, chroma + m, x + m, a);
    }
    else if(hp >= 3 && hp < 4) {
      return this.setRGBA(m, x + m, chroma + m, a);
    }
    else if(hp >= 4 && hp < 5) {
      return this.setRGBA(x + m, m, chroma + m, a);
    }
    else if(hp >= 5 && hp < 6) {
      return this.setRGBA(chroma + m, m, x + m, a);
    }
    else {
      return this.setRGBA(m, m, m, a);
    }
  },
  
  
  /**
   * Returns a representation of this color in the HSBA 
   * (Hue, Saturation, Brightness, Alpha) color model.
   * @return {Array} The normalized HSBA components.
   */
  toHSBA:function() {
    var r = this.getRed();
    var g = this.getGreen();
    var b = this.getBlue();
    var a = this.getAlpha();
    
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
  },
  
  /** 
   * Returns the hue of this color in the HSBA color model. 
   * @return {Number}
   */
  getHue:function() {
    return this.getHSBA()[0];
  },
  
  /** 
   * Returns the saturation of this color in the HSBA color model. 
   * @return {Number}
   */
  getSaturation:function() {
    return this.getHSBA()[1];
  },
  
  /** 
   * Returns the brightness of this color in the HSBA color model. 
   * @return {Number}
   */
  getBrightness:function() {
    return this.getHSBA()[2];
  },
  
  
  /** 
   * Sets up the currently bound ShaderProgram so that its vec4
   * uniform variable "color" is set to this color's RGBA values.
   * @param {WebGLRenderingContext} gl
   */
  useMe:function(gl) {
    TentaGL.ShaderLib.current(gl).setUniValue(gl, "color", this._rgba);
  }

};


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
}


