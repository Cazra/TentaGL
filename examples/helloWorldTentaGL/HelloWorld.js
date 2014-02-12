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
  var shaderProgram = TentaGL.ShaderLib.add(gl, "simpleShader", vertSrc, fragSrc);
  
  shaderProgram.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
  shaderProgram.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.getNormal);
  shaderProgram.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.getTexST);
}


/** Initialize the materials used by the application. */
function initMaterials(gl) {
  TentaGL.MaterialLib.put("myColor", TentaGL.Color.RGBA(1, 0, 0, 1));
  
  var coinBlock = TentaGL.Texture.Image(gl, "../../images/sampleTex.png");
  TentaGL.MaterialLib.put("coinBlock", coinBlock);
}


/** Sets the uniform variables in the shader program for the projection and model-view matrices. */
function setMatrixUnis(gl, shaderProgram, mvMatrix, pMatrix) {
  shaderProgram.setUniValue(gl, "pMatrix", pMatrix);
  shaderProgram.setUniValue(gl, "mvMatrix", mvMatrix);
}


function createTriangle() {
  var triangle = TentaGL.Model.Triangle([ 0, 1, 0],
                                        [-1,-1, 0],
                                        [ 1,-1, 0]);
  return triangle;
}


function createSquare() {
  var flipY = mat4.create(); //mat4.scale(mat4.create(), mat4.create(), [1, -1, 1]);
  var square = TentaGL.Model.Cube(2, 2, 2).cloneCentered().transform(flipY);
  
  return square;
}


/** Waits for all resources to finish loading before starting the application. */
function launchWhenReady(gl) {
  if(TentaGL.MaterialLib.allLoaded()) {
    console.log("ready!");
    drawScene(gl);
  }
  else {
    console.log("not ready.");
    setTimeout(function(){launchWhenReady(gl);}, 100);
  }
}



/** Draws the scene with the triangle and square. */
function drawScene(gl) {
  
  var shaderProgram = TentaGL.ShaderLib.use(gl, "simpleShader");
  TentaGL.MaterialLib.use(gl, "coinBlock");
  
  // Clear the background. 
  gl.clearColor(0, 0, 0, 1); // Black
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  
//  gl.enable(gl.CULL_FACE);
  
  // Get the models for our shapes.
  var triangle = createTriangle();
  var square = createSquare();
  
  // Construct the perspective matrix.
  var pMatrix = mat4.create();
  mat4.perspective(pMatrix, 45, gl.viewWidth/gl.viewHeight, 0.1, 100);
  
  // Construct the model-view matrix.
  var mvMatrix = mat4.create();
  mat4.identity(mvMatrix);
  
  // Draw the triangle.
  mat4.translate(mvMatrix, mvMatrix, [-1.5, 0, -7]);
  setMatrixUnis(gl, shaderProgram, mvMatrix, pMatrix);
  TentaGL.VBORenderer.render(gl, triangle);
  
  // Draw the square.
  mat4.translate(mvMatrix, mvMatrix, [3, 0, 0]);
  setMatrixUnis(gl, shaderProgram, mvMatrix, pMatrix);
  TentaGL.VBORenderer.render(gl, square);
}


/** 
 * Initializes and runs the WebGL Hello World program.
 */
function webGLStart() {
//  var canvas = document.getElementById("glCanvas");
  var gl = TentaGL.createGL("container");
  initShaderProgram(gl);
  initMaterials(gl);
  
  console.log(gl.canvas);
  var keyboard = new TentaGL.Keyboard(document.getElementById("container"));
  
  //setTimeout(function(){drawScene(gl)}, 1000);
  launchWhenReady(gl);
}
