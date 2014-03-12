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
 * Constructs an object representing a vertex attribute in a ShaderProgram.
 * @constructor
 * @param {WebGLActiveInfo } info   Information about the variable returned 
 *      return from a getActiveAttrib or getActiveUniform call.
 * @param {WebGLProgram} glProg   The program containing the variable.
 * @param {GLint} location   The location of the variable in 
 *      the WebGL context.
 */
TentaGL.Attribute = function(info, glProg, location) {
  TentaGL.ShaderVar.call(this, info, glProg);
  this._location = location;
};

TentaGL.Attribute.prototype = {
  
  constructor:TentaGL.Attribute,
  
  /** 
   * Returns the location of the Attribute in the WebGL context. 
   * @return {WebGLUniformLocation}
   */
  getLocation:function() {
    return this._location;
  },


  /** 
   * Sets the attribute to use the currently bound array buffer.
   * @param {WebGLRenderingContext} gl
   * @param {GLint} bufferStride    The byte offset between consecutive 
   *      attributes of this type in the bound buffer. If 0, then the attributes
   *      are understood to be sequential.
   * @param {GLint} bufferOffset    The offset of the first attribute of this 
   *      type in the bound buffer.
   */
  set:function(gl, bufferStride, bufferOffset) {
    gl.vertexAttribPointer(this._location, this.getSizeUnits(),  
                          this.getUnitType(), false, 
                          bufferStride, bufferOffset);
  },


  /** 
   * Assigns which Vertex prototype function for returns the typed data array   
   * for this Attribute. E.G.: If this is an attribute for the vertex's position,
   * the user should call thisAttribute.setGetter(TentaGL.Vertex.prototype.getXYZ).
   * For each Attribute in a ShaderProgram, this method should be used to 
   * specify the corresponding Vertex getter function for the Attribute after the
   * ShaderProgram is loaded, but before it is used to render anything.
   * @param {Function} getter  The Vertex prototype getter function that
   *      returns a typed array corresponding to this Attribute.
   */
  setGetter:function(getter) {
    this._getterFunc = getter;
  },


  /** 
   * Extracts this attribute's values from a Vertex. 
   * @param {TentaGL.Vertex} vertex
   * @return {Typed Array} A typed array of the appropriate size and type for 
   *      this attribute.
   */
  getValues:function(vertex) {
    var result = this._getterFunc.call(vertex);
    
    if(result.length != this.getSizeUnits()) {
      throw Error("Vertex attribute " + this.getName() + " is wrong size: " + result.length + ". Expected: " + this.getSizeUnits());
    }
    
    return result;
  },



  /** 
   * Returns the profile data for this attribute. 
   * @return {TentaGL.AttrProfile}
   */
  getProfile:function() {
    if(!this._profile) {
      this._profile = new TentaGL.AttrProfile(TentaGL.UNKNOWN,
                                              this.getUnitType(),
                                              this.getSizeUnits(),
                                              this._getterFunc);
    }
    return this._profile;
  }



};


TentaGL.Inheritance.inherit(TentaGL.Attribute, TentaGL.ShaderVar);




