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
 * Constructs a model with empty vertex and face index arrays.
 * @constructor
 */
TentaGL.Model = function() {
  this._vertices = [];
  this._indices = [];
};


TentaGL.Model.prototype = {

  constructor:TentaGL.Model,
  
  
  //////// Vertex operations
  
  /**
   * Adds a vertex to the model at the end of its internal vertex array.
   * @param {TentaGL.Vertex} vertex
   * @return this
   */
  addVertex:function(vertex) {
    this._vertices.push(vertex);
    return this;
  },
  
  /**
   * Returns the number of vertices in this model.
   * @return {Number}
   */
  numVertices:function() {
    return this._vertices.length;
  },
  
  /** 
   * Obtains the vertex at the specified index in the model's internal 
   * vertex array. 
   * @param (int} index
   * @return {TentaGL.Vertex}
   */
  getVertex:function(index) {
    if(index < 0 || index >= this._vertices.length) {
      var msg = "Index " + index + " out of bounds.";
      throw Error(msg);
    }
    return this._vertices[index];
  },
  
  /** 
   * Returns a shallow copy of the model's vertices array.
   * @return {Array: TentaGL.Vertex}
   */
  getVertices:function() {
    return this._vertices.slice(0, this._vertices.length);
  },
  
  
  //////// Face index operations
  
  /** 
   * Returns a copy of the model's face indices array.
   * @return {Array: int}
   */
  getFaceIndices:function() {
    return this._indices.slice(0, this._indices.length);
  },
  
  /** 
   * Returns the specified face index for this model.
   * @param {int} i   The index of the face index in the model's face indices
   *      array.
   * @return {int}
   */
  getFaceIndex:function(i) {
    if(i < 0 || i >= this._indices.length) {
      throw Error("Index " + i + " out of bounds.");
    }
    return this._indices[i];
  },
  
  
  /** 
   * Adds 3 indices to the model's list of indices to describe a triangular 
   * face. 
   * Generally, the vertex indices specified should be in CCW order.
   * @param {int} v1  The index of the first vertex making up the face.
   * @param {int} v2  The second
   * @param {int} v3  The third
   */
  addFace:function(v1, v2, v3) {
    if(v1 < 0 || v1 >= this._vertices.length) {
      throw Error("Index " + v1 + " out of bounds.");
    }
    if(v2 < 0 || v2 >= this._vertices.length) {
      throw Error("Index " + v2 + " out of bounds.");
    }
    if(v3 < 0 || v3 >= this._vertices.length) {
      throw Error("Index " + v3 + " out of bounds.");
    }
    
    this._indices.push(v1);
    this._indices.push(v2);
    this._indices.push(v3);
  },
  
  
  /** 
   * Adds 4 indices to the model's list of indices to describe a 
   * quadrilateral face. The vertices are expected in be provided in CCW order.
   * @param {int} v1  The index of the first vertex making up the face.
   * @param {int} v2  The second
   * @param {int} v3  The third
   * @param {int} v4  The fourth
   */
  addFaceQuad:function(v1, v2, v3, v4) {
    this.addFace(v1, v2, v3);
    this.addFace(v1, v3, v4);
  },
  
  
  /** 
   * Adds indices to the model as if we are specifying a triangle strip.
   * Internally though, they are added as though they are describing 
   * individual triangle faces. 
   * @param {Array: int} v  An array of indices specifying vertices 
   *      comprising a triangle strip.
   */
  addFaceStrip:function(v) {
    if(v.length < 3) {
      throw Error("Not enough indices in triangle strip array.");
    }
    
    var inorder = true;
    for(var i = 2; i < v.length; i++) {
      if(inorder) {
        this.addFace(v[i-2], v[i-1], v[i]);
      }
      else {
        this.addFace(v[i-1], v[i-2], v[i]);
      }
      inorder = !inorder;
    }
  },
  
  
  /**
   * Adds indices to the model as if we are specifying a triangle fan strip.
   * Internally though, they are added as though they are describing 
   * individual triangle faces. 
   * @param {Array: int} v  An array of indices specifying vertices 
   *      comprising a triangle strip.
   */
  addFaceFan:function(v) {
    if(v.length < 3) {
      throw Error("Not enough indices in triangle strip array.");
    }
    
    for(var i = 2; i < v.length; i++) {
      this.addFace(v[0], v[i-1], v[i]);
    }
  },
  
  
  /** 
   * Returns the array of triangular faces for this model.
   * @return {Array: Array: int} An array of length-3 arrays each describing
   *      the vertex indices describing a face in the model.
   */
  getFaces:function() {
    if(this._faces === undefined) {
      this._faces = [];
      
      for(var i = 2; i < this._indices.length; i+= 3) {
        var v1 = this._indices[i-2];
        var v2 = this._indices[i-1];
        var v3 = this._indices[i];
        
        this._faces.push([v1, v2, v3]);
      }
    }
    return this._faces;
  },
  
  //////// Properties computations
  
  
  /** 
   * Returns an array containing all the unit surface normal vectors for this
   * model's triangle faces, computing them the first time this is called.
   * @return {Array: vec3}
   */
  getFaceNormals:function() {
    if(this._faceNormals === undefined) {
      this._faceNormals = [];
      
      for(var i = 2; i < this._indices.length; i+= 3) {
        var v1 = this._vertices[this._indices[i-2]];
        var v2 = this._vertices[this._indices[i-1]];
        var v3 = this._vertices[this._indices[i]];
        
        var u = vec3.fromValues(v2.getX() - v1.getX(),
                                v2.getY() - v1.getY(),
                                v2.getZ() - v1.getZ());
        var v = vec3.fromValues(v3.getX() - v1.getX(),
                                v3.getY() - v1.getY(),
                                v3.getZ() - v1.getZ());
        var n = vec3.cross(vec3.create(), u, v);
        this._faceNormals.push(n);
      }
    }
    
    return this._faceNormals;
  },
  
  /**
   * Computes the tangental vectors for each vertex in the model.
   * The texture coordinates for the vertices must be defined, or this 
   * will produce an error.
   */
  computeVertexTangentals:function() {
    for(var i = 2; i < this._indices.length; i++) {
      var v1 = this._vertices[this._indices[i-2]];
      var v2 = this._vertices[this._indices[i-1]];
      var v3 = this._vertices[this._indices[i]];
      
      v1.computeTangental(v2, v3);
      v2.computeTangental(v3, v1);
      v3.computeTangental(v1, v2);
    }
  },
  
  
  
  /** 
   * Sets the color for all the vertices in the model.
   * @param {TentaGL.Color} color
   */
  setColor:function(color) {
    for(var i = 0; i < this._vertices.length; i++) {
      this._vertices[i].setColor(color);
    }
  },
  
  
  /**
   * Returns the model's centroid point. This is simply the average of all the 
   * model's vertex points' xyz coordinates.
   * @return {vec4} The centroid point, with the 4th coordinate being 1 to
   *      allow it to be transformed by affine translation transformations.
   */
  getCentroid:function() {
    if(this._centroid === undefined) {
      var x = 0;
      var y = 0;
      var z = 0;
      
      for(var i = 0; i < this._vertices.length; i++) {
        var v = this._vertices[i];
        x += v.getX();
        y += v.getY();
        z += v.getZ();
      }
      
      x /= this._vertices.length;
      y /= this._vertices.length;
      z /= this._vertices.length;
      
      this._centroid = vec4.fromValues(x, y, z, 1);
    }
    return this._centroid;
  },
  
  
  /** 
   * Returns the centroid points for each face in the model.
   * @return {Array: vec4}
   */
  getFaceCentroids:function() {
    if(this._faceCentroids === undefined) {
      this._faceCentroids = [];
      
      for(var i = 2; i < this._indices.length; i+= 3) {
        var v1 = this._vertices[this._indices[i-2]];
        var v2 = this._vertices[this._indices[i-1]];
        var v3 = this._vertices[this._indices[i]];
        
        var x = (v1.getX() + v2.getX() + v3.getX())/3;
        var y = (v1.getY() + v2.getY() + v3.getY())/3;
        var z = (v1.getZ() + v2.getZ() + v3.getZ())/3;
        
        this._faceCentroids.push(vec4.fromValues(x, y, z, 1));
      }
    }
    return this._faceCentroids;
  }
};

