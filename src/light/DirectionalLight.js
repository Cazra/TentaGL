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
 * An effectively infinitely distant light source radiating light in a single 
 * direction. 
 * @param {vec3} direction    The direction toward the light source.
 * @param {TentaGL.Color} diffuse   Optional.
 * @param {TentaGL.Color} specular  Optional.
 * @param {TentaGL.Color} ambient   Optional.
 */
TentaGL.DirectionalLight = function(direction, diffuse, specular, ambient) {
  TentaGL.Light.call(this, diffuse, specular, ambient);
  
  this._direction = direction;
};

TentaGL.DirectionalLight.prototype = {
  
  constructor: TentaGL.DirectionalLight,
  
  isaDirectionalLight: true,
  
  
  /** 
   * Setter/getter for the direction towards the light. 
   * @param {vec3} dir    Optional.
   * @return {vec3}
   */
  direction: function(dir) {
    if(dir) {
      this._direction = vec3.copy([], dir);
    }
    return this._direction;
  },
  
  
  /** 
   * Renders an object to represent the light, for debugging. 
   * @param {WebGLRenderingContext} gl
   */
  render: function(gl) {
  //  (new TentaGL.Math.Sphere(1, this._direction)).render(gl, "white");
    
    TentaGL.ViewTrans.push(gl);
    
    var q = TentaGL.Math.getQuatFromTo([0,1,0], this._direction);
    TentaGL.ViewTrans.mul(gl, mat4.fromQuat([], q));
    TentaGL.ViewTrans.scale(gl, [1, vec3.length(this._direction), 1]);
    
    TentaGL.MaterialLib.use(gl, "default");
    TentaGL.ModelLib.render(gl, "unitCylinder");
    
    TentaGL.ViewTrans.pop(gl);
  }
};

Util.Inheritance.inherit(TentaGL.DirectionalLight, TentaGL.Light);