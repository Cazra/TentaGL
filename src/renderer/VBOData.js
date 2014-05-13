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
 * A VBOData object encapsulates cached vertex attribute and element index 
 * data for a model for VBO rendering. 
 * @constructor
 * @param {WebGLContextRenderer} gl
 * @param {TentaGL.Model} model  The model we're creating the data for.
 * @param {associative arry: {int} -> {TentaGL.AttrProfile}} attrProfileSet
 */
TentaGL.VBOData = function(gl, model, attrProfileSet) {
  
//  console.log("Creating VBO data");
  
  var attrData = [];
  this._byteOffsets = {};
  var vertices = model.getVertices();
  
//  console.log(vertices.length);
  
  for(var i=0; i < vertices.length; i++) {
    var vertex = vertices[i];
    
  //  console.log(vertex);
    var offset = 0;
    for(var j in attrProfileSet) {
      var attr = attrProfileSet[j];
      var values = attr.getValues(vertex);
      
    //  console.log("  " + attr.id() + " : " + Util.Debug.arrayString(values));
      
      this._byteOffsets[j] = offset;
      offset += attr.sizeBytes();
      
      for(var k=0; k<values.length; k++) {
        attrData.push(values[k]);
      }
    }
    
  }
  
  this._attrBuffer = gl.createBuffer();
  gl.bindBuffer(GL_ARRAY_BUFFER, this._attrBuffer);
  gl.bufferData(GL_ARRAY_BUFFER, new Float32Array(attrData), GL_STATIC_DRAW);
//  console.log("Attr data array: " + attrData);
  
  var elemData = model.getIndices();
  
  this._numIndices = model.numIndices();
  this._elemBuffer = gl.createBuffer();
  gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, this._elemBuffer);
  gl.bufferData(GL_ELEMENT_ARRAY_BUFFER, new Uint16Array(elemData), GL_STATIC_DRAW);
  
//  console.log("Elem data array: " + elemData);
  
  this._attrSet = attrProfileSet;
  this._stride = TentaGL.AttrProfiles.getStride(attrProfileSet);
  
  this._mode = model.getDrawMode();
  this._cull = model.getCullMode();
};




TentaGL.VBOData.prototype = {
  constructor: TentaGL.VBOData,
  
  /** 
   * Returns the buffer of vertex attribute data. 
   * @return {WebGLBuffer}
   */
  getAttrBuffer:function() {
    return this._attrBuffer;
  },
  
  /** 
   * Returns the buffer of element indices. 
   * @return {WebGLBuffer}
   */
  getElemBuffer:function() {
    return this._elemBuffer;
  },
  
  
  /** Returns the number of indices in the element index buffer. */
  numIndices:function() {
    return this._numIndices;
  },
  
  
  /** 
   * Gets the byte offset for an AttrProfile in this data.
   * An Error is thrown if data is not available in the VBO for the AttrProfile.
   * @param {TentaGL.AttrProfile} attrProfile
   */
  getOffset:function(attrProfile) {
    var id = attrProfile.id();
    if(this._byteOffsets[id] === undefined) {
      throw Error("VBOData does not contain data for AttrProfile: " + attrProfile.toString());
    }
    else {
      return this._byteOffsets[id];
    }
  },
  
  
  /** Returns the byte stride for this VBO data. */
  getStride:function() {
    return this._stride;
  },
  
  
  /**
   * Returns the ShaderProgram used to fill the vertex data.
   * @return {TentaGL.ShaderProgram}
   */
  getShader:function() {
    return this._shader;
  },
  
  
  /** 
   * Returns the primitive drawing mode preferred for rendering this model. 
   * @return {GLenum}   Either GL_LINES or GL_TRIANGLES.
   */
  getDrawMode:function() {
    return this._mode;
  },
  
  /** Returns the face culling mode for rendering this model. */
  getCullMode:function() {
    return this._cull;
  },
  
  
  /** 
   * Deletes the VBOData's buffers from GL memory.
   * @param {WebGLRenderingContext} gl
   */
  clean:function(gl) {
    gl.deleteBuffer(this._attrBuffer);
    gl.deleteBuffer(this._elemBuffer);
  }
};

