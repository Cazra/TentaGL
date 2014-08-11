/** 
 * An API for defining a 2D clipping region on the screen using the 
 * stencil buffer. This supports up to 255 intersections of clipping areas.
 */
TentaGL.ClippingArea = {
  
  reset: function(gl) {
    gl._clipLevel = 0;
    gl._clipFuncs = [];
    
    gl._clipFuncsStack = [];
  },
  
  
  /** 
   * Sets the clipping rendering function as the intersection of the current 
   * area and the argument area. After the intersection is created, the 
   * stencil buffer is enabled for clipping in the intersection.
   */
  clip: function(gl, renderFunc) {
    TentaGL.ColorBuffer.push(gl);
    TentaGL.DepthBuffer.push(gl);
    TentaGL.Stencil.push(gl);
    
    gl._clipLevel++;
    
    TentaGL.DepthBuffer.clear(gl);
    TentaGL.Stencil.enabled(gl, true);
    TentaGL.Stencil.func(gl, GL_GREATER, gl._clipLevel);
    TentaGL.Stencil.op(gl, GL_KEEP, GL_INCR, GL_INCR);
    TentaGL.Stencil.mask(gl, 0xFF);
    TentaGL.ColorBuffer.mask(gl, false, false, false, false);
    TentaGL.DepthBuffer.mask(gl, false);
    
    renderFunc(gl);
    
    gl._clipFuncs.push(renderFunc);
    
    TentaGL.Stencil.pop(gl);
    TentaGL.DepthBuffer.pop(gl);
    TentaGL.ColorBuffer.pop(gl);
    
    TentaGL.Stencil.enabled(gl, true);
    TentaGL.Stencil.func(gl, GL_EQUAL, gl._clipLevel);
    TentaGL.Stencil.mask(gl, 0x00);
  },
  
  
  /** 
   * Gets the set of functions defining the current clipping area. 
   * The stencil buffer is then enabled for clipping in that area.
   * @param {WebGLRenderingContext} gl
   */
  getClip: function(gl) {
    return gl._clipFuncs.slice(0);
  },
  
  
  /** 
   * Sets the current clipping render function, or clipping render function set. 
   */
  setClip: function(gl, renderFunc) {
    this.clear(gl);
    
    if(Object.prototype.toString.call(renderFunc) === "[object Array]") {
      for(var i=0; i<renderFunc.length; i++) {
        this.clip(gl, renderFunc[i]);
      }
    }
    else {
      this.clip(gl, renderFunc);
    }
  },
  
  
  /** 
   * Clears the stencil buffer and resets the clipping area.
   * @param {WebGLRenderingContext}
   */
  clear: function(gl) {
    TentaGL.Stencil.push(gl);
    
    TentaGL.Stencil.enabled(gl, true);
    TentaGL.Stencil.mask(gl, 0xFF);
    TentaGL.Stencil.clear(gl, 0);
    
    TentaGL.Stencil.pop(gl);
    
    gl._clipLevel = 0;
    gl._clipFuncs = [];
  },
  
  
  /** 
   * Saves the stencilled clipping area state to the stack. 
   * @param {WebGLRenderingContext} gl
   */
  push: function(gl) {
    gl._clipFuncsStack.push(gl._clipFuncs);
  },
  
  /** 
   * Restores the stencilled clipping area state from the stack. 
   * @param {WebGLRenderingContext} gl
   */
  pop: function(gl) {
    var funcs = gl._clipFuncsStack.pop();
    this.setClip(gl, funcs);
  }
};


