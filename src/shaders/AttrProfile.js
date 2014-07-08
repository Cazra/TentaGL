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
 * @constructor
 * @param {ProfileEnum} id  The enumeration constant used to identify the attribute.
 *      If this is TentaGL.UNKNOWN, then it will try to determine its actual ID
 *      from TentaGL.AttrProfiles.
 * @param {GLenum} unitType   The unit type of the variable. 
 *      E.g. GL_INT, GL_FLOAT, etc., but not types such as GL_FLOAT_VEC3.
 * @param {int} sizeUnits   The size of the variable in terms of its unit type.
 *      E.g. GL_FLOAT_VEC3 would be 3 since it is the size of 3 GL_FLOATs.
 * @param {function} getterFunc   The Vertex prototype function that should be 
 *      called to get the relevant data for the attribute.
 */
TentaGL.AttrProfile = function(id, unitType, sizeUnits, getterFunc) {
  if(!getterFunc) {
    throw new Error("Could not create AttrProfile without getter.");
  }
  
  this._unitType = unitType;
  this._sizeUnits = sizeUnits;
  this._getterFunc = getterFunc;
  
  // If the ID is unknown, find a registered profile that is equal to this and
  // use its ID. This is how attributes from shader programs learn their IDs.
  if(id === TentaGL.UNKNOWN) {
    var found = false;
    
    for(var i in TentaGL.AttrProfiles) {
      if(this.equals(TentaGL.AttrProfiles[i])) {
        this._id = i;
        found = true;
        break;
      }
    }
    
    if(!found) {
      throw new Error("AttrProfile doesn't match any registered profiles: " + this.toString());
    }
  }
  else {
    this._id = id;
  }
};

TentaGL.AttrProfile.prototype = {
  constructor:TentaGL.AttrProfile, 
  
  /** 
   * Returns the ProfileEnum constant that serves as an ID for matching the
   * AttrProfile to its byte offset in VBO data.
   * @return {ProfileEnum}
   */
  id:function() {
    return this._id;
  },
  
  /**
   * Returns the unit GL primitive type for the attribute.
   * e.g. gl.INT, gl.FLOAT, etc., but not anything like gl.FLOAT_VEC3.
   * @return {GLenum}
   */
  unitType:function() {
    return this._unitType;
  },
  
  /** 
   * Returns the size of the attribute in terms of its attribute type.
   * e.g. For a gl.FLOAT_VEC3 attribute this would return 3.
   * @return {int}
   */
  sizeUnits:function() {
    return this._sizeUnits;
  },
  
  /** 
   * Returns the size of this attribute in bytes.
   * @return {int}
   */
  sizeBytes:function() {
    return this._sizeUnits*TentaGL.glSizeBytes(this._unitType);
  },
  
  /** 
   * Returns the Vertex prototype function used to get the relevant data for
   * this attribute.
   * @return {function}
   */
  getterFunc:function() {
    return this._getterFunc;
  },
  
  /**
   * Tests if this AttrProfile is equal to another one. Two
   * AttrProfiles are considered equal if they call the same getter function.
   * @return {Boolean}
   */
  equals:function(other) {
    return (this._getterFunc === other._getterFunc);
  },
  
  /** 
   * Calls the attribute's getter function on a vertex and returns the results.
   * @param {TentaGL.Vertex} vertex   The vertex we're getting attribute data for.
   * @return {typed array}
   */
  getValues:function(vertex) {
    var result = this._getterFunc.call(vertex);
  
    if(result.length != this.sizeUnits()) {
      throw new Error("Vertex attribute is wrong size: " + result.length + ". Expected: " + this.sizeUnits());
    }
    
    return result;
  },
  
  /** 
   * Produces a string respresentation of the AttrProfile.
   * @return {string}
   */
  toString:function() {
    return "AttrProfile(Unit type: " + TentaGL.glTypeName(this._unitType) + ", Units Size: " + this._sizeUnits + ", Getter Function: " + this._getterFunc + ")";
  }
};

// ProfileEnums

/** ID constant for unknown attributes. */
TentaGL.UNKNOWN = 0;

/** ID constant for homogeneous 3D XYZ coordinates. */
TentaGL.POS_4F = 1;

/** ID constant for surface normal vectors. */
TentaGL.NORMAL_3F = 2;

/** ID constant for 2D texture map coordinates. */
TentaGL.TEX_2F = 3;

/** ID constant for surface tangental vectors. */
TentaGL.TANG_3F = 4;


// The master list of available AttrProfiles, keyed by their enumeration constants.
// The default set of AttrProfiles provides these. If you would like to 
// use different custom attributes, just create ProfileEnum constants for them
// (like those above) and add them into TentaGL.AttrProfiles, keyed by their
// constants. 
// That should be done before any models are loaded into the ModelLib!
TentaGL.AttrProfiles = {};
TentaGL.AttrProfiles[TentaGL.POS_4F] = new TentaGL.AttrProfile( TentaGL.POS_4F, 
                                                                GL_FLOAT, 
                                                                4, 
                                                                TentaGL.Vertex.prototype.getXYZ);
TentaGL.AttrProfiles[TentaGL.NORMAL_3F] = new TentaGL.AttrProfile(TentaGL.NORMAL_3F, 
                                                                  GL_FLOAT, 
                                                                  3, 
                                                                  TentaGL.Vertex.prototype.getNormal);
TentaGL.AttrProfiles[TentaGL.TEX_2F] = new TentaGL.AttrProfile( TentaGL.TEX_2F, 
                                                                GL_FLOAT, 
                                                                2, 
                                                                TentaGL.Vertex.prototype.getTexST);
TentaGL.AttrProfiles[TentaGL.TANG_3F] = new TentaGL.AttrProfile(TentaGL.TANG_3F, 
                                                                GL_FLOAT, 
                                                                3, 
                                                                TentaGL.Vertex.prototype.getTangental);


/** 
 * Returns the default set of Attribute profiles: 
 * POS_4F, NORMAL_3F, TEX_2F, and TANG_3F. 
 * @return {associative array: {ProfileEnum}->{AttrProfile}}
 */
TentaGL.getDefaultAttrProfileSet = function() {
  if(!TentaGL._defaultAttrProfileSet) {
    TentaGL._defaultAttrProfileSet = TentaGL.AttrProfiles.createSet([ TentaGL.POS_4F, 
                                                                      TentaGL.NORMAL_3F, 
                                                                      TentaGL.TEX_2F, 
                                                                      TentaGL.TANG_3F]);
  }
  return TentaGL._defaultAttrProfileSet;
};


/** 
 * Produces a set of AttrProfiles, given a list of the profile enum constants 
 * identifying them. 
 */
TentaGL.AttrProfiles.createSet = function(profileEnumArray) {
  var result = {};
  for(var i = 0; i < profileEnumArray.length; i++) {
    var profileEnum = profileEnumArray[i];
    result[profileEnum] = TentaGL.AttrProfiles[profileEnum];
  }
  return result;
};


/** Computes the total byte stride for a set of AttrProfiles. */
TentaGL.AttrProfiles.getStride = function(attrProfileSet) {
  var stride = 0;
  for(var i in attrProfileSet) {
    stride += attrProfileSet[i].sizeBytes();
  }
  return stride;
};
