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
 * Defines a matchable profile for a vertex attribute variable.
 */
TentaGL.AttributeProfile = function(unitType, sizeUnits, getterFunc) {
  if(!getterFunc) {
    throw Error("Could not create AttributeProfile without getter.");
  }
  
  this._unitType = unitType;
  this._sizeUnits = sizeUnits;
  this._getterFunc = getterFunc;
};

TentaGL.AttributeProfile.prototype = {
  constructor:TentaGL.AttributeProfile, 
  
  unitType:function() {
    return this._unitType;
  },
  
  sizeUnits:function() {
    return this._sizeUnits;
  },
  
  getterFunc:function() {
    return this._getterFunc;
  },
  
  equals:function(other) {
    return (this._unitType === other._unitType && this.sizeUnits === other.size && this._getterFun === other._getterFunc);
  }
};




TentaGL.AttributeProfile.Pos4f = new TentaGL.AttributeProfile(TentaGL.GL_FLOAT, 4, TentaGL.Vertex.prototype.getXYZ);

TentaGL.AttributeProfile.Normal3f = new TentaGL.AttributeProfile(TentaGL.GL_FLOAT, 3, TentaGL.Vertex.prototype.getNormal);

TentaGL.AttributeProfile.Tex2f = new TentaGL.AttributeProfile(TentaGL.GL_FLOAT, 2, TentaGL.Vertex.prototype.getTexST);

TentaGL.AttributeProfile.Tang3f = new TentaGL.AttributeProfile(TentaGL.GL_FLOAT, 3, TentaGL.Vertex.prototype.getTangental);


TentaGL.getDefaultAttributeProfileSet = function() {
  if(!TentaGL._defaultAttributeProfileSet) {
    TentaGL._defaultAttributeProfileSet = [ 
                                            TentaGL.AttributeProfile.Pos4f, 
                                            TentaGL.AttributeProfile.Normal3f,
                                            TentaGL.AttributeProfile.Tex2f,
                                            TentaGL.AttributeProfile.Tang3f];
  }
  return TentaGL._defaultAttributeProfileSet;
};


