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


/** Interface for materials that can be used to color texels in a model. */
TentaGL.Material = {
  
  /** 
   * Cleans up any GL resources associated with the Material. 
   * The resources are deleted from GL memory using the appropriate WebGL
   * context function calls.
   * @param {WebGLRenderingContext} gl
   */
  clean:function(gl) {},
  
  /**
   * Binds the GL context to use this material for rendering models.
   * @param {WebGLRenderingContext} gl
   */
  useMe:function(gl) {},
  
  /** 
   * Returns true if all resources for this material (such as external images)
   * have finished loading. Returns true by default.
   * @return Boolean
   */
  isLoaded:function() {}
};