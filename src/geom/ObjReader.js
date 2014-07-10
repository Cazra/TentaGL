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
 * An API for reading models from Wavefront .obj files.
 */
TentaGL.Model.ObjReader = {
  
  
  _numLoading: 0,
  
  
  /** 
   * Asynchronously produces a set of models from a .obj file at some URL. 
   * @param {string} path
   * @param {func( modelMap : {map: string -> TentaGL.Model})} 
   *      callback    This should process the models created from the file.
   *                  Each element in models is a name, model pair.
   */
  fromURL: function(path, callback) {
    var self = this;
    
    var req = new XMLHttpRequest();
    req.open("get", path);
    req.onerror = function(err) {
      console.log("AJAX error: ", err);
      self._numLoading--;
    };
    req.onreadystatechange = function(e) {
      if (this.readyState == 4 && this.status == 200) {
        self._processResponse(req.responseText, callback);
        self._numLoading--;
      }
    };
    req.send();
    
    this._numLoading++;
  },
  
  
  _processResponse: function(response, callback) {
    var modelMap = [];
    var curGroup = "";
    var curModel = new TentaGL.Model();
    
    var index = 0;
    var prevToken = "";
    
    var lines = response.split("\n");
    for(var i = 0; i < lines.length; i++) {
      var line = lines[i].trim();
      
      // Remove excess whitespace.
      line = line.replace("\t", " ");
      while(line.indexOf("  ") != -1) {
        line = line.replace("  ", " ");
      }
      
      if(line != "" && line.charAt(0) != "#") {
        var toks = line.split(" ");
        
        if(toks[0] != prevToken) {
          index = 0;
        }
        
        // New model
        if(toks[0] == "g") {
          modelMap[curGroup] = curModel;
          curModel = new TentaGL.Model();
          curGroup = toks[1];
        }
        
        // New vertex
        else if(toks[0] == "v") {
          var x = parseFloat(toks[1]);
          var y = parseFloat(toks[2]);
          var z = parseFloat(toks[3]);
          curModel.addVertex(new TentaGL.Vertex(x, y, z));
        }
        
        // Vertex normal
        else if(toks[0] == "vn") {
          var vertex = curModel.getVertex(index);
          var x = parseFloat(toks[1]);
          var y = parseFloat(toks[2]);
          var z = parseFloat(toks[3]);
          vertex.setNormal(x, y, z);
        }
        
        // Vertex texture coordinates
        else if(toks[0] == "vt") {
          var vertex = curModel.getVertex(index);
          var s = parseFloat(toks[1]);
          var t = parseFloat(toks[2]);
          vertex.setTexST(s, t);
        }
        
        // New face
        else if(toks[0] == "f") {
          var v1 = parseInt(toks[1]) - 1;
          var v2 = parseInt(toks[2]) - 1;
          var v3 = parseInt(toks[3]) - 1;
          
          if(toks.length == 5) {
            var v4 = parseInt(toks[4]) - 1;
            curModel.addFaceQuad(v1, v2, v3, v4);
          }
          else {
            curModel.addFace(v1, v2, v3);
          }
        }
        
        // usemtl is ignored.
        else if(toks[0] == "usemtl") {
          // do nothing.
        }
        
        else {
          throw new Error("Could not read wavefront object. Error at line " + (i+1));
        }
        
        index++;
        prevToken = toks[0];
        
      }
    }
    modelMap[curGroup] = curModel;
    
    callback(modelMap);
  },
  
  
  /** 
   * Returns true if some models are still busy loading.
   */
  isLoading: function() {
    return (this._numLoading > 0);
  },
  
  
  getNumLoading: function() {
    return this._numLoading;
  }
  
};

