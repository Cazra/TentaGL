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
 * An API for managing and rendering VBO data for 3D models loaded in a gl context.
 */
TentaGL.ModelLib = {
  
  /** 
   * Removes all the cached VBO data from GL memory and from this library. 
   * @return {WebGLRenderingContext} gl
   */
  clean:function(gl) {
    for(var id in gl._vboData) {
      gl._vboData[id].clean(gl);
    }
    gl._vboData = {};
  },
  
  
  /** 
   * Cleans the library and then preloads it with the following built-in 
   * common models:
   * "unitPlane" - a 1x1 square whose lower-left corner is at (0,0,0) and whose
   *               upper-right corner is at (1,1,0).
   * "unitLine" - a line extending from (0,0,0) to (1,1,1).
   * "unitCube" - a 1x1x1 cube whose origin is in its lower-left-back corner.
   * "unitSphere" - an approximated sphere with a radius of 1.
   * "unitSprite" - a unitPlane whose T texture axis is inverted. Intended for
   *                drawing images in 2D mode so that they won't appear upside-down.
   * "unitCone" - an approximated cone with a base radius of 1 and a height of 1.
   */
  reset:function(gl) {
    this.clean(gl);
    this.add(gl, "unitPlane", new TentaGL.Model.Plane(1,1));
    this.add(gl, "unitLine", new TentaGL.Model.Line([0,0,0], [1,1,1]));
    this.add(gl, "unitCube", new TentaGL.Model.Cube(1,1,1));
    this.add(gl, "unitSphere", new TentaGL.Model.Sphere(1));
    this.add(gl, "unitSprite", (new TentaGL.Model.Plane(1,1)).flipTexT());
    this.add(gl, "unitCone", new TentaGL.Model.Cone(1,1));
  },
  
  
  
  /** 
   * Creates and adds the VBO data for a model to the library.
   * @param {WebGLRenderingContext} gl
   * @param {string} modelID  The uniqueID that identifies the VBO data for the 
   *      model in this library.
   * @param {TentaGL.Model} model   The model that the VBO data will be 
   *      produced from.
   * @param {map: int -> TentaGL.AttrProfile} attrProfileSet    Optional.
   *      The set of attributes to be stored in the model's VBO data.
   *      A model's VBO data can be rendered by a shader program only
   *      by a shader program only if the program's AttrProfile is a subset 
   *      of the VBO data's AttrProfile.
   *      If this isn't provided, it will automatically use the default set from
   *      TentaGL.getDefaultAttrProfileSet().
   * @return {TentaGL.VBOData} The VBO data produced for the model.
   */
  add:function(gl, modelID, model, attrProfileSet) {
  //  console.log("Creating VBO for " + modelID + " with profiles set ");
  //  console.log(attrProfileSet);
  
    if(!attrProfileSet) {
      attrProfileSet = TentaGL.getDefaultAttrProfileSet();
    }
    
    var vbo = new TentaGL.VBOData(gl, model, attrProfileSet);
    gl._vboData[modelID] = vbo;
    
    return vbo;
  },
  
  
  /** 
   * Returns the VBOData for the specified model ID. 
   * @param {WebGLRenderingContext} gl
   * @param {string} modelID
   * @return {TentaGL.VBOData}
   */
  get:function(gl, modelID) {
    if(gl._vboData[modelID] === undefined) {
      throw new Error("ModelLib does not contain VBOData for " + modelID + ".");
    }
    return gl._vboData[modelID];
  },
  
  
  /** 
   * Removes the VBO data for the specified model from the 
   * ModelLib and GL memory. 
   * @param {WebGLRenderingContext} gl
   * @param {string} modelID
   */
  remove:function(gl, modelID) {
    var vbo = gl._vboData[modelID];
    vbo.clean(gl);
    delete gl._vboData[modelID];
  },
  
  
  /** 
   * Renders a model from this library. 
   * @param {WebGLRenderingContext} gl
   * @param {string} modelID
   */
  render:function(gl, modelID) {
    TentaGL.ViewTrans.updateMVPUniforms(gl);
    
    var vboData = this.get(gl, modelID);
    TentaGL.VBORenderer.render(gl, vboData);
  }
  
};

