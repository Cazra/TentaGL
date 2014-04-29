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
 * An interface for a WebGL rendering mode. When a RenderMode is loaded by  
 * TentaGL for a gl context, it updates the context's gl state appropriately 
 * for that mode.
 *
 * TODO
 */ 
TentaGL.RenderMode = function() {};

TentaGL.RenderMode.prototype = {
  
  constructor: TentaGL.RenderMode, 
  
  isaRenderMode = true,
  
  
  /** 
   * Sets the state of the gl context for this RenderMode. 
   * @param {WebGLRenderingContext} gl
   */
  useMe:function(gl) {}

};


/** A 3D rendering mode for opaque objects. */
TentaGL.RenderMode.MODE_3D_OPAQUE = {};
TentaGL.RenderMode.MODE_3D_OPAQUE.prototype = {
  
  useMe:function(gl) {
    TentaGL.Blend.setEnabled(gl, false);
    TentaGL.Depth.setEnabled(gl, true);
    TentaGL.Cull.setEnabled(gl, false);
  }
  
}
TentaGL.Inheritance.inherit(TentaGL.RenderMode.MODE_3D_OPAQUE, TentaGL.RenderMode);


/** A 3D rendering mode for translucent objects. */
TentaGL.RenderMode.MODE_3D_TRANS = {};
TentaGL.RenderMode.MODE_3D_TRANS.prototype = {
  
  useMe:function(gl) {
    TentaGL.Blend.setEnabled(gl, true);
    TentaGL.Blend.setEquation(gl, TentaGL.GL_FUNC_ADD, TentaGL.GL_SRC_ALPHA, TentaGL.GL_ONE_MINUS_SRC_ALPHA);
    
    TentaGL.Depth.setEnabled(gl, false);
    TentaGL.Cull.setEnabled(gl, false);
  }
  
}
TentaGL.Inheritance.inherit(TentaGL.RenderMode.MODE_3D_TRANS, TentaGL.RenderMode);

