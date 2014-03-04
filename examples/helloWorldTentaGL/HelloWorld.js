/** 
 * A sandbox application used to test features of TentaGL. 
 * @constructor
 * @mixes {TentaGL.Application}
 * @param {DOM div element} container
 */
var HelloWorldApp = function(container) {
  TentaGL.Application.call(this, container);
};

HelloWorldApp.prototype = {
  
  constructor:HelloWorldApp,
  
  
  /** 
   * Produces a test sprite. 
   * @param {vec4} xyz  The sprite's position in local space.
   * @param {TentaGL.Camera} camera   Optional. Camera object for 
   *      icon/billboard sprites to face.
   * @return {TentaGL.Sprite}
   */
  createTestSprite:function(xyz, camera) {
    var gl = this.getGL();
    
    var font = new TentaGL.Font("Arial", "sans-serif", 24);
    font.setBold(true);
    var color = TentaGL.Color.RGBA(0.5, 0.5, 0.5, 1);
    
    var sprite = new TentaGL.TextIconSprite(xyz, "Hello World!\nHow are you?", font, color); //new TentaGL.TextIconSprite(xyz, "Hello World!\nHow are you?", font, color); //new TentaGL.IconSprite(xyz, "iconNew");
  //  sprite.scaleToWidth(1);
  //  sprite.draw = function(gl) {
  //    TentaGL.MaterialLib.use(gl, "coinBlock");
  //    TentaGL.VBORenderer.render(gl, "cube");
  //  };
    
    sprite.setScaleUni(0.25);
    
    return sprite;
  },
  
  
  
  /** Overrides TentaGL.Application.initShaders */
  initShaders:function() {
    var vertSrc = TentaGL.DOM.extractScriptText("vshader");
    var fragSrc = TentaGL.DOM.extractScriptText("fshader");
    var shaderProgram = TentaGL.ShaderLib.add(this.getGL(), "simpleShader", vertSrc, fragSrc);
    
    shaderProgram.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
    shaderProgram.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.getNormal);
    shaderProgram.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.getTexST);
    
    shaderProgram.bindMVPTransUni("mvpTrans");
    shaderProgram.bindNormalTransUni("normalTrans");
    shaderProgram.bindTex0Uni("tex");
  },
  
  
  /** Overrides TentaGL.Application.initMaterials */
  initMaterials:function() {
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
  },
  
  
  /** Overrides TentaGL.Application.initModels */
  initModels:function() {
    var cubeModel = TentaGL.Model.Cube(2, 2, 2).cloneCentered();
    TentaGL.ModelLib.add(this.getGL(), "cube", cubeModel, TentaGL.getDefaultAttrProfileSet());
    
    var lineModel = TentaGL.Model.Line([0,0,0],[1,1,0]);
    TentaGL.ModelLib.add(this.getGL(), "line", lineModel, TentaGL.getDefaultAttrProfileSet());
    
    var polyLineModel = TentaGL.Model.PolyLine([[0,0,0],[1,1,0],[1,0,1]], true);
    TentaGL.ModelLib.add(this.getGL(), "polyline", polyLineModel, TentaGL.getDefaultAttrProfileSet());
  },
  
  
  /** Overrides TentaGL.Application.reset */
  reset:function() {
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
          var sprite = this.createTestSprite([i, j, k], this.camera);
          this.spriteGroup.add(sprite);
        }
      }
    }
    
    this.picker = new TentaGL.Picker(this.getWidth(), this.getHeight());
  },
  
  
  
  /** Overrides TentaGL.Application.update */
  update:function() {
    var gl = this.getGL();
    
    // Scene application code
    this.updateScene(gl);
    
    // Picker test
    if(this._mouse.isLeftPressed()) {
      this.picker.update(gl, this.drawScene.bind(this), true);
      
      var mx = this._mouse.getX();
      var my = this.getHeight() - this._mouse.getY()
      var pixel = this.picker.getPixelAt(mx, my);
      var sprite = this.picker.getSpriteAt(mx, my);
      console.log(pixel);
      console.log(sprite);
      
    //  if(sprite && sprite.setText) {
    //    sprite.setColor(new TentaGL.Color.RGBA(1,0,0,1));
    //    sprite.setText("X__X You clicked me...\nI am dead now.");
    //    sprite.scaleToHeight(1);
    //  }
    }
    else {
      this.drawScene(gl);
    }
  },
  
  
  /** Runs the scene application logic. */
  updateScene:function(gl) {
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
  },
  
  
  
  
  /** Draws the scene. */
  drawScene:function(gl) {
    TentaGL.ShaderLib.use(gl, "simpleShader");
    TentaGL.BlendStateLib.useNone(gl);
  //  TentaGL.BlendStateLib.use(gl, "AlphaComposite");
    
    var aspect = gl.canvas.width/gl.canvas.height;
    TentaGL.setCamera(this.camera, aspect); //this.camera.useMe(aspect);
    
    // Clear the scene. 
    TentaGL.clearColorBuffer(gl, [0.1, 0.1, 0.3, 1]);
    TentaGL.clearDepthBuffer(gl);

    // Draw the spinning cubes.
    var camEye = this.camera.getEye();
    var viewTrans = this.camera.getViewTransform();
    
    var sprites = this.spriteGroup.getChildren();
    for(var i = 0; i < sprites.length; i++) {
      var sprite = sprites[i];
      
      // spin slowly around their local group's Y axis.
      sprite.rotate([0, 1, 0], 0.01);
      //sprite.billboardWorldAxis(camEye);
    }
    
    this.spriteGroup.render(gl, this.camera);
  },
  
  
};


TentaGL.Inheritance.inherit(HelloWorldApp.prototype, TentaGL.Application.prototype);


/** 
 * Returns the singleton instance for this app, creating it if necessary. 
 * @return {HelloWorldApp}
 */
HelloWorldApp.getInstance = function() {
  if(!HelloWorldApp._instance) {
    HelloWorldApp._instance = new HelloWorldApp(document.getElementById("container"));
  }
  return HelloWorldApp._instance;
};





/** 
 * Initializes and runs the WebGL Hello World program.
 */
function webGLStart() {
  HelloWorldApp.getInstance().start();
}
