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
  var square = new TentaGL.IconSprite(xyz, camera, "iconNew");
  
//  square.draw = function(gl) {
//    TentaGL.MaterialLib.use(gl, "coinBlock");
//    TentaGL.VBORenderer.render(gl, "cube");
//  };
  
  square.setScaleUni(0.5);
  
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
  var gl = this.getGL();

  TentaGL.MaterialLib.add("myColor", TentaGL.Color.RGBA(1, 0, 0, 1));
  
  var coinBlock = TentaGL.Texture.Image(gl, "../../images/sampleTex.png");
  TentaGL.MaterialLib.add("coinBlock", coinBlock);
  
  var icon = new TentaGL.Texture(gl);
  TentaGL.PixelData.loadImage("../../images/iconNew.png", function(pixelData) {
    pixelData = pixelData.filter(TentaGL.RGBAFilter.TransparentColor.RGBBytes(255,200,255));
    pixelData = pixelData.crop(7,6, 17,21);
    
  //  TentaGL.PixelData.loadImage("../../images/iconNewAlpha.png", function(alphaImg) {
  //    alphaImg = alphaImg.crop(7,6, 17,21);
  //    
  //    pixelData = pixelData.filter(new TentaGL.RGBAFilter.AlphaMap(alphaImg));
  //    icon.setPixelData(gl, pixelData);
  //  });
    
    icon.setPixelData(gl, pixelData);
  });
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


function appReset() {
  this.camera = new TentaGL.ArcballCamera([0, 0, 10], [0, 0, 0]);
  this.rX = 0;
  this.drX = 0;
  this.rY = 0;
  this.drY = 0.01;
  this.rZ = 0;
  this.drZ = 0;
  
  this.spriteGroup = new TentaGL.SceneGroup();
  for(var i = -5; i < 5; i++) {
    for(var j = -5; j < 5; j++) {
      for(var k = -5; k < 5; k++) {
        var sprite = createSquareSprite([i, j, k], this.camera);
        this.spriteGroup.add(sprite);
      }
    }
  }
  
  this.picker = new TentaGL.Picker(this.getWidth(), this.getHeight());
};




function appUpdate() {
  var gl = this.getGL();
  
  // Reset the GL states for this iteration.
  TentaGL.resetTransform();
  TentaGL.resetProjection();
  TentaGL.resetRenderFilter();
  
  // Scene application code
  updateScene.call(this, gl);
  
  // Picker test
  if(this._mouse.isLeftPressed()) {
    this.picker.update(gl, drawScene.bind(this), true);
    
    var mx = this._mouse.getX();
    var my = this.getHeight() - this._mouse.getY()
    var pixel = this.picker.getPixelAt(mx, my);
    var sprite = this.picker.getSpriteAt(mx, my);
    console.log(pixel);
    console.log(sprite);
  }
  else {
    drawScene.call(this, gl);
  }
};


function updateScene(gl) {
  gl.clearColor(0.1, 0.1, 0.3, 1); // Black
  
  // Group rotation
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
  
  
  // Camera reset
  if(this._keyboard.justPressed(KeyCode.R)) {
    this.camera.resetOrientation();
  }
  
  // Click count test
  if(this._mouse.justLeftReleased() && this._mouse.leftClickCount() > 1) {
    console.log(this._mouse.leftClickCount());
  }
  
  // Camera control
  this.camera.controlWithMouse(this._mouse, this.getWidth(), this.getHeight());
};


/** Draws the scene. */
function drawScene(gl) {
  TentaGL.ShaderLib.use(gl, "simpleShader");
  TentaGL.BlendStateLib.useNone(gl);
//  TentaGL.BlendStateLib.use(gl, "AlphaComposite");
  
  var aspect = gl.canvas.width/gl.canvas.height;
  this.camera.useMe(gl, aspect);
  
  // Clear the background. 
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Draw the spinning cubes.
  var camEye = this.camera.getEye();
  var viewTrans = this.camera.getViewTransform();
  
  var sprites = this.spriteGroup.getChildren();
  for(var i = 0; i < sprites.length; i++) {
    var sprite = sprites[i];
    
    // spin slowly around their local group's Y axis.
    //sprite.rotate([0, 1, 0], 0.01);
    //sprite.billboardWorldAxis(camEye);
  }
  
  this.spriteGroup.render(gl, this.camera);
};


/** Creates and returns the application, all set up and ready to start. */
function createApp(container) {
  var app = new TentaGL.Application(container);
  app.initShaders = initShaders;
  app.initMaterials = initMaterials;
  app.initModels = initModels;
  app.update = appUpdate;
  app.reset = appReset;
  
  
  return app;
}



/** 
 * Initializes and runs the WebGL Hello World program.
 */
function webGLStart() {
  var app = createApp(document.getElementById("container"));
  app.start();
}
