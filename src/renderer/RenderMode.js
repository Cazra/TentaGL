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
 * Rendering modes are functions that set up the state of the gl context
 * for some specific mode of rendering. Each rendering mode function
 * accepts a WebGLRenderingContext as an argument.
 */ 
TentaGL.RenderMode = {};


/** A 3D rendering mode for opaque objects. */
TentaGL.RenderMode.set3DOpaque = function(gl) {
  TentaGL.Blend.setEnabled(gl, false);
  TentaGL.Depth.setEnabled(gl, true);
  TentaGL.Cull.setMode(gl, GL_NONE);
};


/** A 3D rendering mode for translucent objects. */
TentaGL.RenderMode.set3DTrans = function(gl) {
  TentaGL.Blend.setEnabled(gl, true);
  TentaGL.Blend.setEquation(gl, GL_FUNC_ADD, GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
  
  TentaGL.Depth.setEnabled(gl, false);
  TentaGL.Cull.setMode(gl, GL_NONE);
};



/** a 2D rendering mode for opaque and translucent objects. */
TentaGL.RenderMode.set2D = function(gl) {
  TentaGL.Blend.setEnabled(gl, true);
  TentaGL.Blend.setEquation(gl, GL_FUNC_ADD, GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);
  
  TentaGL.Depth.setEnabled(gl, false);
  TentaGL.Cull.setMode(gl, GL_NONE);
};

