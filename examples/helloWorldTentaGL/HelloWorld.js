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
  
  shaderProgram.bindMVPTransUni("mvpTrans");
  shaderProgram.bindNormalTransUni("normalTrans");
//  shaderProgram.bindOpacityUni("opacity");
}


/** Initialize the materials used by the application. */
function initMaterials(gl) {
  TentaGL.MaterialLib.put("myColor", TentaGL.Color.RGBA(1, 0, 0, 1));
  
  var coinBlock = TentaGL.Texture.Image(gl, "../../images/sampleTex.png");
  TentaGL.MaterialLib.put("coinBlock", coinBlock);
}


/** Initializes and returns the Camera for the scene. */
function initCamera() {
  var camera = new TentaGL.Camera([0, 0, 10], [0, 0, 0]);
  return camera;
}



function createTriangleSprite(xyz) {
  var triangle = new TentaGL.Sprite(xyz);
  triangle.model = TentaGL.Model.Triangle([ 0, 1, 0],
                                        [-1,-1, 0],
                                        [ 1,-1, 0]);
  triangle.draw = function(gl) {
    TentaGL.VBORenderer.render(gl, this.model);
  };
  return triangle;
}


function createSquareSprite(xyz) {
  var square = new TentaGL.Sprite(xyz);
  square.model = TentaGL.Model.Cube(2, 2, 2).cloneCentered();
  square.draw = function(gl) {
    TentaGL.VBORenderer.render(gl, this.model);
  };
  
//  square.setAngleX(TentaGL.TAU/8);
//  square.setAngleY(TentaGL.TAU/8);
//  square.setAngleZ(TentaGL.TAU/8);
  
  square.setScaleUni(2);
  
  square.setOpacity(1);
  
  return square;
}


/** Waits for all resources to finish loading before starting the application. */
function launchWhenReady(gl, camera) {
  if(TentaGL.MaterialLib.allLoaded()) {
    console.log("ready!");
    drawScene(gl, camera);
  }
  else {
    console.log("not ready.");
    setTimeout(function(){launchWhenReady(gl, camera);}, 100);
  }
}



/** Draws the scene with the triangle and square. */
function drawScene(gl, camera) {
  
  var shaderProgram = TentaGL.ShaderLib.use(gl, "simpleShader");
  TentaGL.MaterialLib.use(gl, "coinBlock");
  
  var aspect = gl.canvas.width/gl.canvas.height;
  camera.useMe(gl, aspect);
  
  // Clear the background. 
  gl.clearColor(0, 0, 0, 1); // Black
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  
//  gl.enable(gl.CULL_FACE);
  
  // Get the models for our shapes.
  var triangleSprite = createTriangleSprite([-1.5, 0, 0]);
  var squareSprite = createSquareSprite([1.5, 0, 0]);
  
  // Draw the triangle.
  triangleSprite.render(gl);
  
  // Draw the square.
  squareSprite.render(gl);
}


/** 
 * Initializes and runs the WebGL Hello World program.
 */
function webGLStart() {
  
  
  var container = document.getElementById("container");
  
  var canvas = TentaGL.createCanvas(container);
  var gl = TentaGL.createGL(canvas);
  initShaderProgram(gl);
  initMaterials(gl);
  
  var keyboard = new TentaGL.Keyboard(document.getElementById("container"));
  var camera = initCamera();
  
  //setTimeout(function(){drawScene(gl)}, 1000);
  launchWhenReady(gl, camera);
  
  
  
  /*
  var app = new TentaGL.Application(container);
  
  app.initShaders = function() {
    var vertSrc = extractSrc("vshader");
    var fragSrc = extractSrc("fshader");
    var shaderProgram = TentaGL.ShaderLib.add(this.getGL(), "simpleShader", vertSrc, fragSrc);
    
    shaderProgram.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
    shaderProgram.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.getNormal);
    shaderProgram.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.getTexST);
    
    shaderProgram.bindMVPTransUni("mvpTrans");
    shaderProgram.bindNormalTransUni("normalTrans");
  //  shaderProgram.bindOpacityUni("opacity");
  };
  
  app.initMaterials = function() {
    TentaGL.MaterialLib.put("myColor", TentaGL.Color.RGBA(1, 0, 0, 1));
    
    var coinBlock = TentaGL.Texture.Image(this.getGL(), "../../images/sampleTex.png");
    TentaGL.MaterialLib.put("coinBlock", coinBlock);
  };
  
  this.
  
  app.start();
  */
}
