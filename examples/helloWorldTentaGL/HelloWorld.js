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
  
  square.setScaleUni(0.25);
  
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
//  this.triangleSprite.render(gl);
  
  if(this._keyboard.isPressed(KeyCode.UP)) {
    console.log("pressed up");
    this.drX -= 0.001;
  }
  if(this._keyboard.isPressed(KeyCode.Z)) {
    console.log("pressed Z");
    this.drZ += 0.001;
  }
  
  if(this._keyboard.justPressed(KeyCode.Q)) {
    console.log("pressed Q");
    this.drX *= -1;
  }
  
  if(this._keyboard.justPressed(KeyCode.R)) {
    this.camera.resetOrientation();
  }
  
  if(this._mouse.justLeftReleased() && this._mouse.leftClickCount() > 1) {
    console.log(this._mouse.leftClickCount());
  }
  
  if(this._mouse.scrollUpAmount() > 0) {
    console.log("scroll up: " + this._mouse.scrollUpAmount());
    for(var i = 0; i < this._mouse.scrollUpAmount(); i++) {
      this.camera.setDist(this.camera.getDist() * 9/10);
    }
  }
  
  if(this._mouse.scrollDownAmount() > 0) {
    console.log("scroll down: " + this._mouse.scrollDownAmount());
    for(var i = 0; i < this._mouse.scrollDownAmount(); i++) {
      this.camera.setDist(this.camera.getDist() * 10/9);
    }
  }
  
  
  this.camera.controlWithMouse(this._mouse, this.getWidth(), this.getHeight());
  
  this.rX += this.drX;
  this.rY += this.drY;
  this.rZ += this.drZ;
  
  // Draw the square.
//  this.squareSprite.render(gl);
//  this.squareSprite.setAngleY(this.rY);
//  this.squareSprite.setAngleX(this.rX);

  for(var i = 0; i < this.sprites.length; i++) {
    var sprite = this.sprites[i];
    sprite.setAngleY(this.rY);
    sprite.setAngleX(this.rX);
    sprite.setAngleZ(this.rZ);
    sprite.render(gl);
  }
};


/** Creates and returns the application, all set up and ready to start. */
function createApp(container) {
  var app = new TentaGL.Application(container);
  app.initShaders = initShaders;
  app.initMaterials = initMaterials;
  app.initModels = initModels;
  app.update = drawScene;
  
  app.camera = new TentaGL.ArcballCamera([0, 0, 10], [0, 0, 0]);
//  app.arcball = new TentaGL.ArcballCamera([0, 0, 10], [0, 0, 0]);
  app.rX = 0;
  app.drX = 0;
  app.rY = 0;
  app.drY = 0.01;
  app.rZ = 0;
  app.drZ = 0;
//  app.triangleSprite = createTriangleSprite([-1.5, 0, 0]);
//  app.squareSprite = createSquareSprite([1.5, 0, 0]);
  app.sprites = [];
  for(var i = -5; i < 5; i++) {
    for(var j = -5; j < 5; j++) {
      for(var k = -5; k < 5; k++) {
        app.sprites.push(createSquareSprite([i, j, k]));
      //  app.sprites.push(createSquareSprite([i + 0.5, j, k]));
      //  app.sprites.push(createSquareSprite([i, j + 0.5, k]));
      //  app.sprites.push(createSquareSprite([i + 0.5, j + 0.5, k]));
      }
    }
  }
  
  
  return app;
}



/** 
 * Initializes and runs the WebGL Hello World program.
 */
function webGLStart() {
  var app = createApp(document.getElementById("container"));
  app.start();
}
