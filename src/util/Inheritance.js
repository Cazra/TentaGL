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
 * Utility object for mimicking and testing for type inheritance.
 */
TentaGL.Inheritance = {
  
  /** 
   * Tests if an object implements an interface. 
   * This returns true iff for each method in the interface, the object
   * implements that method and accepts a number of arguments for that method
   * equal to at least the number of arguments expected by that method in the 
   * interface.
   * @param {Object} obj
   * @param {Object} interface  Some singleton object with only method fields. 
   *      This object defines what methods are expected from objects 
   *      implementing the interface.
   * @return {Boolean}
   */
  objImplements:function(obj, intf) {
    for(var i in intf) {
      if(!obj[i] || obj[i].length === undefined) {
        console.log(i + " not present.");
        console.log(obj);
        return false;
      }
      
      if(obj[i].length < intf[i].length) {
        console.log("Has " + obj[i].length + " arguments, expected " + intf[i].length);
        console.log(obj);
        return false;
      }
      
    }
    return true;
  },
  
  
  /**
   * Makes an object prototype inherit the fields of a parent prototype.
   * The derived prototype's fields override those of its parent.
   * @param {prototype} proto   The derived prototype.
   * @param {prototype} parentProto   The parent prototype.
   * @return {prototype} The derived prototype, for chaining.
   */
  inherit:function(proto, parentProto) {
    for(var i in parentProto) {
      if(!proto[i]) {
        proto[i] = parentProto[i];
      }
    }
    return proto;
  }
};
