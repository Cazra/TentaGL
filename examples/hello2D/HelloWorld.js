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
    
    var font = new TentaGL.Font("Arial", "sans-serif", 24);
    font.setBold(true);
    var color = TentaGL.Color.RGBA(0.5, 0.5, 0.5, 1);
    
    var sprite = new TentaGL.Sprite(xyz);
    sprite.draw = function(gl) {
      TentaGL.MaterialLib.use(gl, "coinBlock");
      TentaGL.ModelLib.render(gl, "cylinder");
    };
    sprite.setScaleUni(0.25);
    
    return sprite;
  },
  
  createTestSprite2D:function(xy) {
    var gl = this.getGL();
    
    xy[2] = 0;
    var sprite = new TentaGL.Sprite(xy);
    sprite.draw = function(gl) {
      TentaGL.MaterialLib.use(gl, "coinBlock");
      TentaGL.ModelLib.render(gl, "square32");
    };
    
    return sprite;
  },
  
  
  createTestTextSprite2D: function(xy, text, bFont) {
    return new TentaGL.TextSprite(xy, text, bFont, true);
  },
  
  
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
  
  
  /** We are required to override TentaGL.Application.initShaders */
  initShaders:function() {
    var gl = this.getGL();
    
    TentaGL.SimpleShader.load(gl, "simpleShader");
  },
  
  
  /** We are required to override TentaGL.Application.initMaterials */
  initMaterials:function() {
    var gl = this.getGL();
    var self = this;

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
    var canvasPixels = TentaGL.PixelData.fromCanvas(canvas);
    
    var circle = new TentaGL.Texture(gl); //TentaGL.Texture.fromCanvas(gl, canvas);
    circle.setPixelData(gl, canvasPixels);
    TentaGL.MaterialLib.add(gl, "testCircle", circle);
    
    
    // solid colors
    TentaGL.MaterialLib.add(gl, "green", TentaGL.Texture.fromColor(gl, TentaGL.Color.RGBA(0, 1, 0, 1)));
    TentaGL.MaterialLib.add(gl, "blue", TentaGL.Texture.fromColor(gl, TentaGL.Color.RGBA(0, 0, 1, 1)));
    TentaGL.MaterialLib.add(gl, "red", TentaGL.Texture.fromColor(gl, TentaGL.Color.RGBA(1, 0, 0, 1)));
    TentaGL.MaterialLib.add(gl, "white", TentaGL.Texture.fromColor(gl, TentaGL.Color.RGBA(1, 1, 1, 1)));
    TentaGL.MaterialLib.add(gl, "black", TentaGL.Texture.fromColor(gl, TentaGL.Color.RGBA(0, 0, 0, 1)));
    
    
    // blittered font: Final Fontasy
    this.blitFont = TentaGL.BlitteredFont.fromURL("../../images/finalFontasy.png", 
      false, 10, 10, 1, 1, 
      function(pixels) {
        return pixels.filter(TentaGL.RGBAFilter.TransparentColor.RGBBytes(255,0,255));
      }
    );
    
    var font = new TentaGL.Font("Arial", "sans-serif", 16);
    this.blitFont2 = TentaGL.BlitteredFont.fromFont(font, TentaGL.Color.RGBA(0.5, 0.5, 1, 1), 1, 1);
  },
  
  
  /** We are required to override TentaGL.Application.initModels */
  initModels:function() {
    var cubeModel = TentaGL.Model.Cube(2, 2, 2);//.cloneCentered();
    TentaGL.ModelLib.add(this.getGL(), "cube", cubeModel, TentaGL.getDefaultAttrProfileSet());
    
    var lineModel = TentaGL.Model.Line([0,0,0],[1,1,0]);
    TentaGL.ModelLib.add(this.getGL(), "line", lineModel, TentaGL.getDefaultAttrProfileSet());
    
    var polyLineModel = TentaGL.Model.PolyLine([[0,0,0],[1,1,0],[1,0,1]], true);
    TentaGL.ModelLib.add(this.getGL(), "polyline", polyLineModel, TentaGL.getDefaultAttrProfileSet());
    
    var cylinderModel = TentaGL.Model.Cylinder(1,2).rotate([1,0,0],TentaGL.TAU/4);
    TentaGL.ModelLib.add(this.getGL(), "cylinder", cylinderModel, TentaGL.getDefaultAttrProfileSet());
    
    var square32Model = TentaGL.Model.Plane(64, 32).flipTexT();
    TentaGL.ModelLib.add(this.getGL(), "square32", square32Model, TentaGL.getDefaultAttrProfileSet());
  },
  
  
  /** We are required to override TentaGL.Application.reset */
  reset:function() {
    this.camera = new TentaGL.Camera2D([0, 0], 320, 240, true);
    this.camera.setEye([64,32]);
  //  this.camera.setAnchor([0,0]);
  //  this.camera.setZoom(2);
  //  this.camera.setAngle(TentaGL.TAU/8);
  
    this.rX = 0;
    this.drX = 0;
    this.rY = 0;
    this.drY = 0.01;
    this.rZ = 0;
    this.drZ = 0;
    
    this.spriteGroup = new TentaGL.SceneGroup([0,0,0]);
    var group = this.spriteGroup;
    group.add(this.createTestSprite([0,0,0]));
    for(var i=0; i < 10; i++) {
      var prevGroup = group;
      
      group = new TentaGL.SceneGroup([1,0,0]);
      group.rotate([0,0,1],0.1);
      group.add(this.createTestSprite([0,0,0]));
      
      prevGroup.add(group);
    }
    
    
    this.testSprite2D = this.createTestSprite2D([64, 32]);
    
    this.textSprite1 = this.createTestTextSprite2D([0,100,0], "The quick, brown fox \njumped over the lazy dog.", this.blitFont);
    this.textSprite2 = this.createTestTextSprite2D([0,-50,0], "The quick, brown fox \njumped over the lazy dog.", this.blitFont2);
    
    this.axesGroup = new TentaGL.SceneGroup();
    this.axesGroup.add(this.createSphereSprite([10,0,0], "red"));
    this.axesGroup.add(this.createSphereSprite([0,10,0], "green"));
    this.axesGroup.add(this.createSphereSprite([0,0,10], "blue"));
    this.axesGroup.add(this.createSphereSprite([0,0,0], "white"));
    this.axesGroup.add(this.createSphereSprite([0,0,0], "black"));
    
    this.camGroup = new TentaGL.SceneGroup();
    this.camGroup.add(this.createSphereSprite([15,0,0], "black"));
  },
  
  
  
  /** We are required to override TentaGL.Application.update */
  update:function() {
    if(TentaGL.ImageLoader.isLoading()) {
      console.log("Loading images...");
      return;
    }
    var gl = this.getGL();
    
    // Scene application code
    this.updateScene(gl);
    
    
    // Camera reset
    if(this._keyboard.justPressed(KeyCode.R)) {
      this.camera.setAngle(0);
    }
    
    if(this._keyboard.isPressed(KeyCode.Q)) {
      this.camera.setAngle(this.camera.getAngle() + TentaGL.TAU/360);
    }
    
    this.camera.controlWithMouse(this._mouse, this.getWidth(), this.getHeight());
    
    // Picker test
    if(this._mouse.isLeftPressed()) {
      this.getPicker().update(gl, this.drawScene.bind(this), false);
      
      var mx = this._mouse.getX();
      var my = this.getHeight() - this._mouse.getY()
      var sprite = this.getPicker().getSpriteAt(mx, my);
      console.log(sprite);
      
      if(sprite && sprite.setText) {
        sprite.setText("X__X You clicked me...\nI am dead now.");
      }
    }
    else {
      //this.drawScene(gl);
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
  //    this.camera.resetOrientation();
    }
    
    // Click count test
    if(this._mouse.justLeftReleased() && this._mouse.leftClickCount() > 1) {
      console.log(this._mouse.leftClickCount());
    }
    
    // Camera control
  //  this.camera.controlWithMouse(this._mouse, this.getWidth(), this.getHeight());
    
    this.axesGroup.get(3).setXYZ([this.camera.getX(), this.camera.getY(), 0]);
  //  this.camGroup.setQuat(this.camera._orientation);
    
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
    TentaGL.RenderMode.set2D(gl);
    
    var aspect = gl.canvas.width/gl.canvas.height;
    TentaGL.ViewTrans.setCamera(gl, this.camera, aspect);
    
    // Clear the scene. 
    TentaGL.clear(gl, TentaGL.Color.RGBA(0.1, 0.1, 0.3, 1));

    // Draw the objects in the scene.
    this.textSprite1.render(gl);
    this.textSprite2.render(gl);
    
    this.spriteGroup.render(gl, this.camera);
    this.axesGroup.render(gl);
    this.camGroup.render(gl);
    this.testSprite2D.render(gl);
  },
  
  
};


Util.Inheritance.inherit(HelloWorldApp, TentaGL.Application);


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
    
    TentaGL.ShaderLib.setDefaultShaderPath(HelloWorldApp._instance.getGL(), "../../shaders/");
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
