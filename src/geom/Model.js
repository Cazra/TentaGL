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
 * @param {GLenum} drawMode   Optional. Either GL_LINES or GL_TRIANGLES. 
 *      Default GL_TRIANGLES.
 * @param {GLenum} cullMode    Optional. Either GL_NONE, GL_FRONT, GL_BACK, 
 *      or GL_FRONT_AND_BACK. Default GL_NONE.
 */
TentaGL.Model = function(drawMode, cullMode) {
  if(!drawMode) {
    drawMode = GL_TRIANGLES;
  }
  if(!cullMode) {
    cullMode = GL_NONE;
  }
  
  
  this._mode = drawMode;
  this._cull = cullMode;
  this._vertices = [];
  this._indices = [];
};


TentaGL.Model.prototype = {

  constructor:TentaGL.Model,
  
  //////// ID data
  
  /** 
   * Gets the unique ID for caching this model in a map. 
   * If the model didn't have an Id already assigned to it, a unique anonymous
   * ID is created.
   * @return {string}
   */
  getID:function() {
    if(this._id === undefined) {
      this._id = TentaGL.Model.createID();
    }
    return this._id;
  },
  
  /** 
   * Sets the unique ID for caching this model in a map. 
   * @param {string} id
   * @return {TentaGL.Model} this
   */
  setID:function(id) {
    this._id = id;
    return this;
  },
  
  
  //////// Mode
  
  /** 
   * Returns the mode used to draw this model by the VBORenderer. If undefined,
   * then the VBORenderer will use its default drawing mode.
   * @return {GLenum}
   */
  getDrawMode:function() {
    return this._mode;
  },
  
  
  /** 
   * Returns the face culling mode used to draw this model. 
   * @return {GLenum}
   */
  getCullMode:function() {
    return this._cull;
  },
  
  //////// Element index data
  
  /** 
   * Returns the number of vertex indices defining the faces of this model. 
   * @return {int}
   */
  numIndices:function() {
    return this._indices.length;
  },
  
  /** Returns a copy of this model's element index array. */
  getIndices:function() {
    return this._indices.slice(0, this._indices.length);
  },
  
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
      throw new Error(msg);
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
  
  
  /** 
   * Returns the index of a vertex in this model. If not found, -1 is returned.
   * @param {TentaGL.Vertex} vertex
   * @return {uint}
   */
  indexOfVertex: function(vertex) {
    for(var i=0; i < this._vertices.length; i++) {
      if(this._vertices[i] == vertex) {
        return i;
      }
    }
    
    return -1;
  },
  
  
  //////// Line index operations
  
  /** Returns the number of lines defining this model. */
  numLines:function() {
    return Math.floor(this._indices.length/2);
  },
  
  
  /** 
   * Adds indices to the model to define a line.
   * @param {int} v1  The index of the line's start vertex.
   * @param {int} v2  The index of the line's end vertex.
   */
  addLine:function(v1, v2) {
    if(v1 < 0 || v1 >= this._vertices.length) {
      throw new Error("Index " + v1 + " out of bounds.");
    }
    if(v2 < 0 || v2 >= this._vertices.length) {
      throw new Error("Index " + v2 + " out of bounds.");
    }
    
    this._indices.push(v1);
    this._indices.push(v2);
    
    var vert1 = this._vertices[v1];
    var vert2 = this._vertices[v2];
    vert1.setTangental(vert1.computeTangental(vert2, vert2));
    vert2.setTangental(vert2.computeTangental(vert1, vert1));
  },
  
  
  /** 
   * Adds indices to the model to define a line strip. Internally though, the 
   * line strip is composed of a series of individual lines.
   * @param {Array of ints} An array of line strip indices to vertices.
   */
  addLineStrip:function(v) {
    if(v.length < 2) {
      throw new Error("Not enough indices in line strip array.");
    }
    
    var prev = v[0];
    for(var i=1; i<v.length; i++) {
      var cur = v[i];
      
      this.addLine(prev, cur);
    }
  },
  
  
  /** 
   * Adds indices to the model to define a line loop. Internally though, the 
   * line loop is composed of a series of individual lines.
   * @param {Array of ints} An array of line strip indices to vertices.
   */
  addLineLoop:function(v) {
    if(v.length < 2) {
      throw new Error("Not enough indices in line strip array.");
    }
    
    var prev = v[0];
    for(var i=1; i<v.length; i++) {
      var cur = v[i];
      
      this.addLine(prev, cur);
    }
    this.addLine(v[v.length-1], v[0]);
  },
  
  
  /** 
   * Returns an array of lines for this model. 
   * Each element is a length-2 array containing the start and end vertex 
   * indices for a line.
   * @return {Array{Array{int}}}
   */
  getLines:function() {
    var result = [];
    
    for(var i=1; i<v.length; i+=2) {
      var v1 = this._indices[i-1];
      var v2 = this._indices[i];
      result.push([v1, v2]);
    }
    
    return result;
  },
  
  
  
  //////// Face index operations
  
  
  /**
   * Returns the number of faces defined in this model.
   * @return {int}
   */
  numFaces:function() {
    return Math.floor(this._indices.length/3);
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
      throw new Error("Index " + v1 + " out of bounds.");
    }
    if(v2 < 0 || v2 >= this._vertices.length) {
      throw new Error("Index " + v2 + " out of bounds.");
    }
    if(v3 < 0 || v3 >= this._vertices.length) {
      throw new Error("Index " + v3 + " out of bounds.");
    }
    
    this._indices.push(v1);
    this._indices.push(v2);
    this._indices.push(v3);
    
    // compute the tangentals for each vertex in this face.
    var vert1 = this._vertices[v1];
    var vert2 = this._vertices[v2];
    var vert3 = this._vertices[v3];
    vert1.setTangental(vert1.computeTangental(vert2, vert3));
    vert2.setTangental(vert2.computeTangental(vert3, vert1));
    vert3.setTangental(vert3.computeTangental(vert1, vert2));
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
      throw new Error("Not enough indices in triangle strip array.");
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
      throw new Error("Not enough indices in triangle strip array.");
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
  
  
  /** 
   * Returns the array of triangular faces that use the nth vertex in this 
   * model. 
   * @param {uint} n  The index of the vertex.
   * @return {array: uint}
   */
  getFacesContainingVertex: function(n) {
    var result = [];
    
    var faces = this.getFaces();
    
    for(var i=0; i<faces.length; i++) {
      var face = faces[i];
      
      if(face[0] == n || face[1] == n || face[2] == n) {
        result.push(i);
      }
    }
    
    return result;
  },
  
  
  /** 
   * Automatically generates the normal vector for each vertex by normalizing
   * the sum of the normals of adjacent faces.
   */
  generateVertexNormals: function() {
    var faceNormals = this.getFaceNormals();
    
    for(var i=0; i<this._vertices.length; i++) {
      var vertex = this._vertices[i];
      var adjFaces = this.getFacesContainingVertex(i);
      
      var n = [0,0,0];
      
      for(var j=0; j<adjFaces.length; j++) {
        var faceIndex = adjFaces[j];
        vec3.add(n, n, faceNormals[faceIndex])
      }
      
      vec3.normalize(n, n);
      vertex.setNormal(n[0], n[1], n[2]);
    }
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
   * Gets the surface normal vector for the specified face in the model.
   * @param {int} index   The index for the face in the model.
   * @return {vec3} 
   */
  getFaceNormal:function(index) {
    if(index < 0 || index >= this.numFaces()) {
      throw new Error("Face index out of bounds: " + index);
    }
    
    return this.getFaceNormals()[index];
  },
  
  
  
  /**
   * Returns the model's centroid point. This is simply the average of all the 
   * model's vertex points' xyz coordinates, and may not necessarily also be
   * its center of volume.
   * @return {vec4} The centroid point, with the 4th coordinate being 1 to
   *      allow it to be transformed by affine translation transformations.
   */
  getModelCentroid:function() {
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
   * @return {Array: vec4} The centroid points, in xyz coordinates with a fourth
   *    coordinate set to 1 to allow translation affine transformations.
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
  },
  
  /** 
   * Returns the centroid point for the specified face in the model. 
   * @param {int} index   The index of the face in the model.
   * @return {vec4} The centroid point, with the 4th coordinate being 1 to
   *      allow it to be transformed by affine translation transformations.
   */
  getFaceCentroid:function(index) {
    if(index < 0 || index >= this.numFaces()) {
      throw new Error("Face index out of bounds: " + index);
    }
    
    return this.getFaceCentroids()[index];
  },
  
  
  //////// Instance operations
  
  /** 
   * Returns a clone of this model. 
   * @return {TentaGL.Model}
   */
  clone:function() {
    return this.transform(mat4.create());
  },
  
  
  /** 
   * Returns a clone of this model transformed by some affine 
   * transformation matrix. 
   * @param {mat4} transform
   * @return {TentaGL.Model}
   */
  transform:function(transform) {
    var model = new TentaGL.Model();
    
    // transform-clone vertices
    for(var i=0; i<this._vertices.length; i++) {
      model.addVertex(this._vertices[i].transform(transform));
    }
    
    // clone faces
    for(var i=0; i<this._indices.length; i+=3) {
      model.addFace(this._indices[i], this._indices[i+1], this._indices[i+2]);
    }
    
    return model;
  },
  
  
  /** 
   * Returns a clone of this model with its origin at the original model's 
   * centroid.
   * @return {TentaGL.Model}
   */
  cloneCentered:function() {
    var xyz = this.getModelCentroid();
    return this.transform(mat4.translate(mat4.create(), mat4.create(), [-xyz[0], -xyz[1], -xyz[2]]));
  },
  
  
  
  /**  
   * Returns a clone of this model with all the vertices translated.
   * @param {vec3} xyz
   * @return {TentaGL.Model}
   */
  translate:function(xyz) {
    var t = mat4.create();
    mat4.translate(t, t, xyz);
    return this.transform(t);
  },
  
  
  /** 
   * Returns a clone of this model with all the vertices scaled relative 
   * to the origin.
   * @param {vec3} xyz  The amount to scale the model by on the 3 axes.
   * @return {TentaGL.Model}
   */
  scale:function(xyz) {
    var t = mat4.create();
    mat4.scale(t, t, xyz);
    return this.transform(t);
  },
  
  
  /**
   * Returns a clone of this model with all the vertices rotated around 
   * some axis.
   * @param {vec3} axis
   * @param (number} radians
   * @return {TentaGL.Model}
   */
  rotate:function(axis, radians) {
    var q = quat.setAxisAngle(quat.create(), axis, radians);
    return this.transform(mat4.fromQuat(mat4.create(), q));
  },
  
  
  /** 
   * Returns a clone of this model whose texture coordinates are scaled.
   * @return {TentaGL.Model}
   */
  scaleTexST:function(s, t) {
    var result = this.clone();
    for(var i in result._vertices) {
      var v = result._vertices[i];
      var st = v.getTexST();
      v.setTexST(st[0]*s, st[1]*t);
    }
    return result;
  },
  
  
  /** 
   * Returns a clone of this model where all T tex coordinates are 1 minus
   * their original value. This will make the textures for the model become
   * upside down. 
   * @return {TentaGL.Model}
   */
  flipTexT:function() {
    var result = this.clone();
    for(var i in result._vertices) {
      var v = result._vertices[i];
      var st = v.getTexST();
      v.setTexST(st[0], 1-st[1]);
    }
    return result;
  },
  
  
  
  /** 
   * Returns a clone of this model merged with another model. 
   * @param {TentaGL.Model} model
   * @return {TentaGL.Model}
   */
  merge:function(model) {
    var result = this.clone();
    
    var indexOffset = result.numVertices();
    
    for(var i=0; i<model._vertices.length; i++) {
      result.addVertex(model._vertices[i]);
    }
    
    for(var i=0; i<model._indices.length; i+=3) {
      var i1 = indexOffset + model._indices[i];
      var i2 = indexOffset + model._indices[i+1];
      var i3 = indexOffset + model._indices[i+2];
      
      result.addFace(i1, i2, i3);
    }
    
    return result;
  }
};

TentaGL.Model._nextID = 0;

/**
 * Creates a unique string ID that can be assigned to a model 
 * via Model.setID({string}).
 * @return {string}
 */
TentaGL.Model.createID = function() {
  var id = "anonID" + TentaGL.Model._nextID;
  TentaGL.Model._nextID++;
  return id;
};


