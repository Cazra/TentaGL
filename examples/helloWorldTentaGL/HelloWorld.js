// WebGL Hello World program displays a square and a triangle.

/** Returns the string for a DOM script element's text content. */
function extractSrc(scriptID) {
  var shaderScript = document.getElementById(scriptID);
  if(!shaderScript) {
    throw Error("Script ID " + scriptID + " doesn't exist in the document.");
  }
  
  // Extract the shader source code from the DOM script element.
  var str = "";
  var k = shaderScript.firstChild;
  console.log(shaderScript);
  while(k) {
    if(k.nodeType == Node.TEXT_NODE) {
      str += k.textContent;
    }
    k = k.nextSibling;
  }
  
  return str;
}



//////// Program-specific stuff.


/** Initializes and returns the shader program for this program. */
function initShaderProgram(gl) {
  var vertSrc = extractSrc("vshader");
  var fragSrc = extractSrc("fshader");
  TentaGL.ShaderLib.add(gl, "simpleShader", vertSrc, fragSrc);
}



/** Sets the uniform variables in the shader program for the projection and model-view matrices. */
function setMatrixUnis(gl, shaderProgram, mvMatrix, pMatrix) {
  shaderProgram.setUniValue(gl, "pMatrix", pMatrix);
  shaderProgram.setUniValue(gl, "mvMatrix", mvMatrix);
}


/** Inits and returns the buffer data for the triangle's vertex position data. */
function initTriangleBuffer(gl) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  var vertices = [
     0,  1,  0,
    -1, -1,  0,
     1, -1,  0
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  buffer.itemSize = 3;
  buffer.numItems = 3;
  buffer.primType = gl.TRIANGLES;
  
  return buffer;
}


/** Inits and returns the buffer data for the square's vertex position data. */
function initSquareBuffer(gl) {
  var buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  var vertices = [
     1,  1,  0,
    -1,  1,  0,
     1, -1,  0,
    -1, -1,  0
  ];
  
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  buffer.itemSize = 3;
  buffer.numItems = 4;
  buffer.primType = gl.TRIANGLE_STRIP;
  
  return buffer;
}


/** Draws the scene with the triangle and square. */
function drawScene(gl) {
  
  var shaderProgram = TentaGL.ShaderLib.use(gl, "simpleShader");
  
  // Clear the background. 
  gl.clearColor(0, 0, 0, 1); // Black
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  
  // Get the vertex buffers for our shapes.
  var triangle = initTriangleBuffer(gl);
  var square = initSquareBuffer(gl);
  
  // Construct the perspective matrix.
  var pMatrix = mat4.create();
  mat4.perspective(45, gl.viewWidth/gl.viewHeight, 0.1, 100, pMatrix);
  
  // Construct the model-view matrix.
  var mvMatrix = mat4.create();
  mat4.identity(mvMatrix);
  
  // Draw the triangle.
  mat4.translate(mvMatrix, [-1.5, 0, -7]);
  setMatrixUnis(gl, shaderProgram, mvMatrix, pMatrix);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, triangle);
  shaderProgram.setAttrValue(gl, "vertexPos", 0, 0);
  gl.drawArrays(triangle.primType, 0, triangle.numItems);
  
  // Draw the square.
  mat4.translate(mvMatrix, [3, 0, 0]);
  setMatrixUnis(gl, shaderProgram, mvMatrix, pMatrix);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, square);
  shaderProgram.setAttrValue(gl, "vertexPos", 0, 0);
  gl.drawArrays(square.primType, 0, square.numItems);
}


/** 
 * Initializes and runs the WebGL Hello World program.
 */
function webGLStart() {
//  var canvas = document.getElementById("glCanvas");
  var gl = TentaGL.createGL("container");
  initShaderProgram(gl);
  
  drawScene(gl);
}
