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
   * @return {TentaGL.Sprite}
   */
  createTestSprite:function(xyz) {
    var gl = this.getGL();

    var sprite = new TentaGL.Sprite(xyz); //new TentaGL.IconSprite(xyz, "iconNew");
    sprite.draw = function(gl) {
      TentaGL.MaterialLib.use(gl, "testCircle");
      TentaGL.ModelLib.render(gl, "cylinder");
    };
  //  sprite.setAnchorXYZ([1,1,1]);
    sprite.setScaleUni(0.25);
    
    return sprite;
  },
  
  
  /**
   * Produces a test text sprite that always billboards towards the camera.
   * @param {vec4} xyz  The sprite's position in local space.
   * @param {string} str    The text displayed by the sprite.
   * @return {TentaGL.TextIconSprite}
   */
  createTestTextSprite: function(xyz, str) {
    var gl = this.getGL();
    
    var font = new TentaGL.Font("Arial", "sans-serif", 24);
    font.setBold(true);
    var color = TentaGL.Color.RGBA(0.5, 0.5, 0.5, 1);
    
    var sprite = new TentaGL.TextIconSprite(xyz, str, font, color); 
    sprite.scaleToHeight(1);
    
    return sprite;
  },
  
  
  
  /** 
   * Produces a spherical sprite with some specified material.
   * @param {vec4} xyz  The sprite's position in local space.
   * @param {string} materialName   The name of the material.
   * @return {TentaGL.Sprite}
   */
  createSphereSprite:function(xyz, materialName) {
    var gl = this.getGL();
    
    var sprite = new TentaGL.Sprite(xyz); 
    sprite.draw = function(gl) {
      TentaGL.MaterialLib.use(gl, materialName);
      TentaGL.ModelLib.render(gl, "unitSphere");
    };
    sprite.setScaleUni(0.5);
    
    return sprite;
  },
  
  
  /** Overrides TentaGL.Application.initShaders */
  initShaders:function() {
    var gl = this.getGL();
    
    var simpleShader = TentaGL.ShaderProgram.fromURL(gl, "../../shaders/simple.vert", "../../shaders/simple.frag");
    TentaGL.ShaderLib.add(gl, "simpleShader", simpleShader);
    
    simpleShader.setAttrGetter("vertexPos", TentaGL.Vertex.prototype.getXYZ);
    simpleShader.setAttrGetter("vertexNormal", TentaGL.Vertex.prototype.getNormal);
    simpleShader.setAttrGetter("vertexTexCoords", TentaGL.Vertex.prototype.getTexST);
    
    simpleShader.bindMVPTransUni("mvpTrans");
    simpleShader.bindNormalTransUni("normalTrans");
    simpleShader.bindTex0Uni("tex");
  },
  
  
  /** Overrides TentaGL.Application.initMaterials */
  initMaterials:function() {
    var gl = this.getGL();

    TentaGL.MaterialLib.add(gl, "myColor", TentaGL.Color.RGBA(1, 0, 0, 1));
    
    var coinBlock = TentaGL.Texture.fromURL(gl, "../../images/sampleTex.png");
    TentaGL.MaterialLib.add(gl, "coinBlock", coinBlock);
    
    
    var icon = TentaGL.Texture.fromURL(gl, "../../images/iconNew.png", 
      function(pixelData) {
        pixelData = pixelData.filter(TentaGL.RGBAFilter.TransparentColor.RGBBytes(255,200,255));
        pixelData = pixelData.crop(7,6, 17,21);
        return pixelData;
      }
    );
    TentaGL.MaterialLib.add(gl, "iconNew", icon);
    
    
    // Canvas doodling
    var canvas = TentaGL.Canvas2D.createRoundedRect(100, 100, 32,TentaGL.Color.RGBA(0.5,0,0,1), 5, TentaGL.Color.RGBA(1,0,0,1)); // TentaGL.Canvas2D.createCircle(100, TentaGL.Color.RGBA(0.5,0,0,1), 5, TentaGL.Color.RGBA(1,0,0,1));
    TentaGL.Canvas2D.removeAlpha(canvas);

    var circle = TentaGL.Texture.fromCanvas(gl, canvas);
    TentaGL.MaterialLib.add(gl, "testCircle", circle);
    
    
    // green
    var canvas = TentaGL.Canvas2D.createRect(10, 10, false, 0, TentaGL.Color.RGBA(0, 1, 0, 1));
    var green = TentaGL.Texture.fromCanvas(gl, canvas);
    TentaGL.MaterialLib.add(gl, "green", green);
    
    // blue
    var canvas = TentaGL.Canvas2D.createRect(10, 10, false, 0, TentaGL.Color.RGBA(0, 0, 1, 1));
    var blue = TentaGL.Texture.fromCanvas(gl, canvas);
    TentaGL.MaterialLib.add(gl, "blue", blue);
    
    // red
    var canvas = TentaGL.Canvas2D.createRect(10, 10, false, 0, TentaGL.Color.RGBA(1, 0, 0, 1));
    var red = TentaGL.Texture.fromCanvas(gl, canvas);
    TentaGL.MaterialLib.add(gl, "red", red);
    
    // white
    var canvas = TentaGL.Canvas2D.createRect(10, 10, false, 0, TentaGL.Color.RGBA(1, 1, 1, 1));
    var white = TentaGL.Texture.fromCanvas(gl, canvas);
    TentaGL.MaterialLib.add(gl, "white", white);
    
    // black
    var canvas = TentaGL.Canvas2D.createRect(10, 10, false, 0, TentaGL.Color.RGBA(0, 0, 0, 1));
    var black = TentaGL.Texture.fromCanvas(gl, canvas);
    TentaGL.MaterialLib.add(gl, "black", black);
  },
  
  
  /** Overrides TentaGL.Application.initModels */
  initModels:function() {
    var cubeModel = TentaGL.Model.Cube(2, 2, 2);//.cloneCentered();
    TentaGL.ModelLib.add(this.getGL(), "cube", cubeModel);
    
    var lineModel = TentaGL.Model.Line([0,0,0],[1,1,0]);
    TentaGL.ModelLib.add(this.getGL(), "line", lineModel);
    
    var polyLineModel = TentaGL.Model.PolyLine([[0,0,0],[1,1,0],[1,0,1]], true);
    TentaGL.ModelLib.add(this.getGL(), "polyline", polyLineModel);
    
    var cylinderModel = TentaGL.Model.Cylinder(1,2).rotate([1,0,0],TentaGL.TAU/4);
    TentaGL.ModelLib.add(this.getGL(), "cylinder", cylinderModel);
  },
  
  
  /** Overrides TentaGL.Application.reset */
  reset:function() {
    this.camera = new TentaGL.ArcballCamera([10, 10, 10], [0, 0, 0]);
    this.rX = 0;
    this.drX = 0;
    this.rY = 0;
    this.drY = 0.01;
    this.rZ = 0;
    this.drZ = 0;
    
    this.spriteGroup = new TentaGL.SceneGroup([0,0,0]);
    /*
    for(var i = -5; i < 5; i++) {
      for(var j = -5; j < 5; j++) {
        for(var k = -5; k < 5; k++) {
          var sprite = this.createTestSprite([i, j, k]);
          this.spriteGroup.add(sprite);
        }
      }
    }
    */
    
    
    var group = this.spriteGroup;
    group.add(this.createTestSprite([0,0,0]));
    for(var i=0; i < 10; i++) {
      var prevGroup = group;
      
      group = new TentaGL.SceneGroup([1,0,0]);
      group.rotate([0,0,1],0.1);
      group.add(this.createTestSprite([0,0,0]));
      
      prevGroup.add(group);
    }
    
    
    
    this.axesGroup = new TentaGL.SceneGroup();
    this.axesGroup.add(this.createSphereSprite([10,0,0], "red"));
    this.axesGroup.add(this.createSphereSprite([0,10,0], "green"));
    this.axesGroup.add(this.createSphereSprite([0,0,10], "blue"));
    this.axesGroup.add(this.createSphereSprite([0,0,0], "white"));
    this.axesGroup.add(this.createSphereSprite([0,0,0], "black"));
    
    this.camGroup = new TentaGL.SceneGroup();
    this.camGroup.add(this.createSphereSprite([15,0,0], "black"));
    
    this.textSprite = this.createTestTextSprite([1,1,1], "Hello, \nWorld!");
  },
  
  
  
  /** Overrides TentaGL.Application.update */
  update:function() {
    var gl = this.getGL();
    
    // Scene application code
    this.updateScene(gl);
    
    // Picker test
    if(this._mouse.isLeftPressed()) {
      this.getPicker().update(gl, this.drawScene.bind(this), false);
      
      var mx = this._mouse.getX();
      var my = this.getHeight() - this._mouse.getY()
      var sprite = this.getPicker().getSpriteAt(mx, my);
      console.log(sprite);
      
      if(sprite && sprite.isaTextIconSprite) {
        sprite.setColor(new TentaGL.Color.RGBA(0.5,0,0,1));
        sprite.setText("X__X You clicked me...\nI am dead now.");
        sprite.scaleToHeight(1);
      }
    }
    else {
    //  this.drawScene(gl);
    }
    this.drawScene(gl);
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
    
    this.axesGroup.get(3).setXYZ(this.camera.getCenter());
    this.camGroup.setQuat(this.camera._orientation);
    
    var sprites = this.spriteGroup.getChildren();
    for(var i = 0; i < sprites.length; i++) {
      var sprite = sprites[i];
      
      // spin slowly around their local group's Y axis.
      sprite.rotate([0, 1, 0], 0.01);
      //sprite.billboardWorldAxis(camEye);
    }
  },
  
  
  
  
  /** Draws the scene. */
  drawScene:function(gl) {
    TentaGL.ShaderLib.use(gl, "simpleShader");
    TentaGL.RenderMode.set3DOpaque(gl);
    
    var aspect = gl.canvas.width/gl.canvas.height;
    TentaGL.Camera.set(gl, this.camera, aspect);
    
    // Clear the scene. 
    TentaGL.clear(gl, TentaGL.Color.RGBA(0.1, 0.1, 0.3, 1));

    // Draw the objects in the scene.
    this.spriteGroup.render(gl, this.camera);
    this.axesGroup.render(gl);
    this.camGroup.render(gl);
    
    this.textSprite.render(gl);
  },
  
  
};


TentaGL.Inheritance.inherit(HelloWorldApp, TentaGL.Application);


/** 
 * Returns the singleton instance for this app, creating it if necessary. 
 * @return {HelloWorldApp}
 */
HelloWorldApp.getInstance = function() {
  if(!HelloWorldApp._instance) {
    HelloWorldApp._instance = new HelloWorldApp(document.getElementById("container"));
    
    window.onresize = function(event) {
      console.log(window.innerWidth, window.innerHeight);
      HelloWorldApp._instance.resize(Math.floor(window.innerWidth*0.95), Math.floor(window.innerHeight*0.95));
    };
    
    HelloWorldApp._instance.resize(Math.floor(window.innerWidth*0.95), Math.floor(window.innerHeight*0.95));
  }
  return HelloWorldApp._instance;
};





/** 
 * Initializes and runs the WebGL Hello World program.
 */
function webGLStart() {
  HelloWorldApp.getInstance().start();
  
  /*
  var req = new XMLHttpRequest();
  req.onload = function() { // for async
    console.log("\"\"\"\n" + this.responseText + "\n\"\"\"");
  };
  req.open("get", "../../shaders/picker.frag", false);
  req.send(); 
  console.log(req.responseText); // for sync
  */
}
