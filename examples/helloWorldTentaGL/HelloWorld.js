// WebGL Hello World program displays a cube and a triangle.

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
};



//////// Program-specific stuff.



function createTriangleSprite(xyz) {
  var triangle = new TentaGL.Sprite(xyz);
  triangle.draw = function(gl) {
    TentaGL.MaterialLib.use(gl, "coinBlock");
    TentaGL.VBORenderer.render(gl, "triangle");
  };
  return triangle;
};


function createSquareSprite(xyz) {
  var square = new TentaGL.Sprite(xyz);
  square.draw = function(gl) {
    TentaGL.MaterialLib.use(gl, "coinBlock");
    TentaGL.VBORenderer.render(gl, "cube");
  };
  
//  square.setAngleX(TentaGL.TAU/8);
  square.setAngleY(TentaGL.TAU/8);
//  square.setAngleZ(TentaGL.TAU/8);
  
  square.setScaleUni(1.2);
  
  square.setOpacity(1);
  
  return square;
};


function initShaders() {
  var vertSrc = extractSrc("vshader");
  var fragSrc = extractSrc("fshader");
  var shaderProgram = TentaGL.ShaderLib.add(this.getGL(), "simpleShader", vertSrc, fragSrc);
  
  shaderProgram.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
  shaderProgram.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.getNormal);
  shaderProgram.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.getTexST);
  
  shaderProgram.bindMVPTransUni("mvpTrans");
  shaderProgram.bindNormalTransUni("normalTrans");
};



function initMaterials() {
  TentaGL.MaterialLib.add("myColor", TentaGL.Color.RGBA(1, 0, 0, 1));
  
  var coinBlock = TentaGL.Texture.Image(this.getGL(), "../../images/sampleTex.png");
  TentaGL.MaterialLib.add("coinBlock", coinBlock);
};


function initModels() {
  var triangleModel = TentaGL.Model.Triangle([ 0, 1, 0],
                                        [-1,-1, 0],
                                        [ 1,-1, 0]);
  TentaGL.ModelLib.add(this.getGL(), "triangle", triangleModel, TentaGL.getDefaultAttrProfileSet());
  
  var cubeModel = TentaGL.Model.Cube(2, 2, 2).cloneCentered();
  TentaGL.ModelLib.add(this.getGL(), "cube", cubeModel, TentaGL.getDefaultAttrProfileSet());
};


/** Draws the scene with the triangle and square. */
function drawScene() {
  var gl = this.getGL();
  
  TentaGL.ShaderLib.use(gl, "simpleShader");
  
  var aspect = gl.canvas.width/gl.canvas.height;
  this.camera.useMe(gl, aspect);
  
  // Clear the background. 
  gl.clearColor(0, 0, 0, 1); // Black
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.enable(gl.DEPTH_TEST);
  
//  gl.enable(gl.CULL_FACE);
  
  // Draw the triangle.
  this.triangleSprite.render(gl);
  
  // Draw the square.
  this.squareSprite.render(gl);
  this.squareSprite.setAngleY(this.squareSprite.getAngleY() + 0.01);
  this.squareSprite.setAngleX(this.squareSprite.getAngleX() + 0.005);
  this.squareSprite.setAngleZ(this.squareSprite.getAngleZ() + 0.001);
};


/** Creates and returns the application, all set up and ready to start. */
function createApp(container) {
  var app = new TentaGL.Application(container);
  app.initShaders = initShaders;
  app.initMaterials = initMaterials;
  app.initModels = initModels;
  
  app.camera = new TentaGL.Camera([0, 0, 10], [0, 0, 0]);
  app.triangleSprite = createTriangleSprite([-1.5, 0, 0]);
  app.squareSprite = createSquareSprite([1.5, 0, 0]);
  
  app.update = drawScene;
  
  return app;
}



/** 
 * Initializes and runs the WebGL Hello World program.
 */
function webGLStart() {
  var app = createApp(document.getElementById("container"));
  app.start();
}
