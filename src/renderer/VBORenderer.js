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


TentaGL.VBORenderer = {
  
  _mode:GL_TRIANGLES,
  
  /** 
   * Returns the preferred drawing mode for primitives. 
   * @return {GLenum}   Either GL_LINES or GL_TRIANGLES.
   */
  getDrawMode:function() {
    return this._mode;
  },
  
  /** 
   * Sets the preferred drawing mode for primitives. 
   * @param {GLenum} mode   Either GL_LINES or GL_TRIANGLES.
   */
  setDrawMode:function(mode) {
    this._mode = mode;
  },
  
  
  /** 
   * Renders a Model with the ShaderProgram and Material currently in use. 
   * @param {WebGLRenderingContext} gl
   * @param {TentaGL.VBOData} vboData   The VBOData of the model to be rendered.
   */
  render:function(gl, vboData) {
    var program = TentaGL.ShaderLib.current(gl);
    
    // Get the data buffers for the model and program, creating them if necessary.
    var attrBuffer = vboData.getAttrBuffer();
    var elemBuffer = vboData.getElemBuffer();
    var stride = vboData.getStride();
    
    // Bind the vertex data.
    gl.bindBuffer(GL_ARRAY_BUFFER, attrBuffer);
    var attrs = program.getAttributes();
    for(var i=0; i < attrs.length; i++) {
      var attr = attrs[i];
      var offset = vboData.getOffset(attr.getProfile());
//      console.log("binding attr: " + attr.getName() + ", loc: " + attr.getLocation() + ", unitSize: " + attr.getSizeUnits() + ", unitType: " + TentaGL.glTypeName(attr.getUnitType()) + ", stride: " + stride + ", offset: " + offset);
      
      
      gl.vertexAttribPointer( attr.getLocation(), 
                              attr.getSizeUnits(), attr.getUnitType(), 
                              false, 
                              stride, offset);
    }
    
    var mode = this._mode;
    if(vboData.getDrawMode() == GL_LINES) {
      mode = GL_LINES;
    }
    TentaGL.Cull.setMode(gl, vboData.getCullMode());
    
    // Bind the index data and draw.
    gl.bindBuffer(GL_ELEMENT_ARRAY_BUFFER, elemBuffer);
  //  console.log(model.numIndices());
    gl.drawElements(mode, vboData.numIndices(), GL_UNSIGNED_SHORT, 0);
  }
  
};


