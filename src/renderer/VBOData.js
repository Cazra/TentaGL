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
 * @param {TentaGL.ShaderProgram} shader  The shader program with which the 
 *      model's VBO data is being created.
 */
TentaGL.VBOData = function(gl, model, shader) {
  
  var attrData = [];
  var vertices = model.getVertices();
  for(var i=0; i < vertices.length; i++) {
    var vertex = vertices[i];
  //  console.log("vertex " + i);
    
    var attrs = shader.getAttributes();
    for(var j=0; j < attrs.length; j++) {
      var attr = attrs[j];
      var values = attr.getValues(vertex);
    //  console.log("  attr " + attr.getName() + " value: " + TentaGL.Debug.arrayString(values));
      
      for(var k=0; k<values.length; k++) {
        attrData.push(values[k]);
      }
    }
  }
  
  this._attrBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this._attrBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(attrData), gl.STATIC_DRAW);
//  console.log("Attr data array: " + attrData);
  
  var elemData = model.getIndices();
  
  this._numIndices = model.numIndices();
  this._elemBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._elemBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(elemData), gl.STATIC_DRAW);
  
//  console.log("Elem data array: " + elemData);
  
  this._shader = shader;
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
   * Returns the ShaderProgram used to fill the vertex data.
   * @return {TentaGL.ShaderProgram}
   */
  getShader:function() {
    return this._shader;
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

