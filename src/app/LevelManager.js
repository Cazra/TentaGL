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
 * An object for managing which level is currently running.
 */
TentaGL.LevelManager = function() {
  this._curLevel = undefined;
  this._nextLevel = undefined;
};

TentaGL.LevelManager.prototype = {
  constructor: TentaGL.LevelManager,
  
  isaLevelManager: true,
  
  
  /**  
   * Returns the level currently loaded in the level manager. 
   * @return {TentaGL.Level}
   */
  get: function() {
    return this._curLevel;
  },
  
  
  /** 
   * Schedules a new level to start running on the next frame. 
   * @param {TentaGL.Level} level
   */
  set: function(level) {
    this._nextLevel = level;
  },
  
  
  /** 
   * Runs the current level. If the level was switched last frame, then it first 
   * cleans the current level, resets the new level, and sets the new level as
   * the current level.
   * @param {WebGLRenderingContext} gl
   */
  run: function(gl) {
    if(this._nextLevel) {
      if(this._curLevel) {
        this._curLevel.clean(gl);
      }
      this._nextLevel.reset(gl);
      
      this._curLevel = this._nextLevel;
      this._nextLevel = undefined;
    }
    
    this._curLevel.update(gl);
    this._curLevel.render(gl);
  }
};  


