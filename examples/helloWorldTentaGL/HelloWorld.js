// TentaGL development sandbox


function createTriangleSprite(xyz) {
  var triangle = new TentaGL.Sprite(xyz);
  triangle.draw = function(gl) {
    TentaGL.MaterialLib.use(gl, "coinBlock");
    TentaGL.VBORenderer.render(gl, "triangle");
  };
  return triangle;
};


function createSquareSprite(xyz, camera) {
  var square = new TentaGL.BillboardSprite(xyz, camera);
  
  square.draw = function(gl) {
    TentaGL.MaterialLib.use(gl, "coinBlock");
    TentaGL.VBORenderer.render(gl, "unitPlane");
  };
  
  square.setScaleUni(0.25);
  
  return square;
};


function initShaders() {
  var vertSrc = TentaGL.DOM.extractScriptText("vshader");
  var fragSrc = TentaGL.DOM.extractScriptText("fshader");
  var shaderProgram = TentaGL.ShaderLib.add(this.getGL(), "simpleShader", vertSrc, fragSrc);
  
  shaderProgram.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
  shaderProgram.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.getNormal);
  shaderProgram.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.getTexST);
  
  shaderProgram.bindMVPTransUni("mvpTrans");
  shaderProgram.bindNormalTransUni("normalTrans");
  shaderProgram.bindTex0Uni("tex");
};



function initMaterials() {
  TentaGL.MaterialLib.add("myColor", TentaGL.Color.RGBA(1, 0, 0, 1));
  
  var coinBlock = TentaGL.Texture.Image(this.getGL(), "../../images/sampleTex.png");
  TentaGL.MaterialLib.add("coinBlock", coinBlock);
  
  var icon = TentaGL.Texture.Image(this.getGL(), "../../images/iconNew.png");
  TentaGL.MaterialLib.add("iconNew", icon);
};


function initModels() {
  var triangleModel = TentaGL.Model.Triangle([ 0, 1, 0],
                                        [-1,-1, 0],
                                        [ 1,-1, 0]);
  TentaGL.ModelLib.add(this.getGL(), "triangle", triangleModel, TentaGL.getDefaultAttrProfileSet());
  
  var cubeModel = TentaGL.Model.Cube(2, 2, 2).cloneCentered();
  TentaGL.ModelLib.add(this.getGL(), "cube", cubeModel, TentaGL.getDefaultAttrProfileSet());
};



function appUpdate() {
  var gl = this.getGL();
  TentaGL.resetTransform();
  TentaGL.resetProjection();
  TentaGL.resetRenderFilter();
  
  
  
  updateScene.call(this, gl);
  
  if(this._mouse.isLeftPressed()) {
    this.picker.update(gl, drawScene.bind(this), true);
    
    var mx = this._mouse.getX();
    var my = this.getHeight() - this._mouse.getY()
    var pixel = this.picker.getPixelAt(mx, my);
    var sprite = this.picker.getSpriteAt(mx, my);
    console.log(pixel);
    console.log(sprite);
    if(sprite) {
      console.log(sprite.getWorldBaseLook());
    }
  }
  else {
    drawScene.call(this, gl);
  }
};


function updateScene(gl) {

  if(this._keyboard.isPressed(KeyCode.W)) {
    this.spriteGroup.rotate([1,0,0], -0.1);
  }
  if(this._keyboard.isPressed(KeyCode.S)) {
    this.spriteGroup.rotate([1,0,0], 0.1);
  }
  
  if(this._keyboard.isPressed(KeyCode.D)) {
    this.spriteGroup.rotate([0,1,0], 0.1);
  }
  if(this._keyboard.isPressed(KeyCode.A)) {
    this.spriteGroup.rotate([0,1,0], -0.1);
  }
  
  

  if(this._keyboard.justPressed(KeyCode.R)) {
    this.camera.resetOrientation();
  }
  
  if(this._mouse.justLeftReleased() && this._mouse.leftClickCount() > 1) {
    console.log(this._mouse.leftClickCount());
  }
  
  if(this._mouse.scrollUpAmount() > 0) {
    for(var i = 0; i < this._mouse.scrollUpAmount(); i++) {
      this.camera.setDist(this.camera.getDist() * 9/10);
    }
  }
  
  if(this._mouse.scrollDownAmount() > 0) {
    for(var i = 0; i < this._mouse.scrollDownAmount(); i++) {
      this.camera.setDist(this.camera.getDist() * 10/9);
    }
  }
  
  
  this.camera.controlWithMouse(this._mouse, this.getWidth(), this.getHeight());
  
  
  // Billboarding test.
  var camEye = this.camera.getEye();
 // this.spriteGroup.billboardPoint(camEye, this.camera.getUp());
  
};


/** Draws the scene with the triangle and square. */
function drawScene(gl) {
  TentaGL.ShaderLib.use(gl, "simpleShader");
  TentaGL.BlendStateLib.useNone(gl);
//  TentaGL.BlendStateLib.useDefaultAlphaBlend(gl);
  
  var aspect = gl.canvas.width/gl.canvas.height;
  this.camera.useMe(gl, aspect);
  
  // Clear the background. 
  gl.clearColor(0, 0, 0, 1); // Black
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Draw the spinning cubes.
  var camEye = this.camera.getEye();
  var sprites = this.spriteGroup.getChildren();
  for(var i = 0; i < sprites.length; i++) {
    var sprite = sprites[i];
    
    // spin slowly around their local group's Y axis.
    //sprite.rotate([0, 1, 0], 0.01);
    //sprite.billboardWorldAxis(camEye);
  }
  
  this.spriteGroup.render(gl);
};


/** Creates and returns the application, all set up and ready to start. */
function createApp(container) {
  var app = new TentaGL.Application(container);
  app.initShaders = initShaders;
  app.initMaterials = initMaterials;
  app.initModels = initModels;
  app.update = appUpdate;
  
  app.camera = new TentaGL.ArcballCamera([0, 0, 10], [0, 0, 0]);
  app.rX = 0;
  app.drX = 0;
  app.rY = 0;
  app.drY = 0.01;
  app.rZ = 0;
  app.drZ = 0;
  
  app.spriteGroup = new TentaGL.SceneGroup();
  for(var i = -5; i < 5; i++) {
    for(var j = -5; j < 5; j++) {
      for(var k = -5; k < 5; k++) {
        var sprite = createSquareSprite([i, j, k], app.camera);
        app.spriteGroup.add(sprite);
      }
    }
  }
  
  app.picker = new TentaGL.Picker(app.getWidth(), app.getHeight());
  
  return app;
}



/** 
 * Initializes and runs the WebGL Hello World program.
 */
function webGLStart() {
  var app = createApp(document.getElementById("container"));
  app.start();
}
