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
    var sprite = TentaGL.Sprite.create(xyz, "cylinder", "testCircle", "phong");
    sprite.setScaleUni(0.25);
    return sprite;
  },
  
  
  /** 
   * Produces a spherical sprite with some specified material.
   * @param {vec4} xyz  The sprite's position in local space.
   * @param {string} materialName   The name of the material.
   * @return {TentaGL.Sprite}
   */
  createSphereSprite:function(xyz, materialName, shaderName) {
    var sprite = TentaGL.Sprite.create(xyz, "unitSphere", materialName, shaderName);
    sprite.setScaleUni(0.5);
    return sprite;
  },
  

  //////// Required Application interface implementations
  
  
  /** We are required to override TentaGL.Application.initShaders */
  initShaders:function() {
    var gl = this.getGL();
    
    try {
      TentaGL.SimpleShader.load(gl, "simpleShader");
      TentaGL.NormalShader.load(gl, "normalShader");
      TentaGL.LinearGradientShader.load(gl, "gradientShader");
      TentaGL.RadialGradientShader.load(gl, "gradientShader2");
      TentaGL.PhongShader.load(gl, "phong");
    }
    catch(e) {
      console.log(e.message);
      throw new Error();
    }
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

    var circle = TentaGL.Texture.fromCanvas(gl, canvas);
    TentaGL.MaterialLib.add(gl, "testCircle", circle);
    
    
    // solid colors
    TentaGL.MaterialLib.add(gl, "green", TentaGL.Color.RGBA(0, 1, 0, 1));
    TentaGL.MaterialLib.add(gl, "blue", TentaGL.Color.RGBA(0, 0, 1, 1)); 
    TentaGL.MaterialLib.add(gl, "red", TentaGL.Color.RGBA(1, 0, 0, 1));
    TentaGL.MaterialLib.add(gl, "white", TentaGL.Color.RGBA(1, 1, 1, 1)); 
    TentaGL.MaterialLib.add(gl, "black", TentaGL.Color.RGBA(0, 0, 0, 1));
    
    // Gradients
    var grad1 = new TentaGL.Gradient([0,0], [1,0]);
    grad1.addBreakPt(0, TentaGL.Color.RGBA(1,0,0,1))
    grad1.addBreakPt(0.6, TentaGL.Color.RGBA(1,1,0,1))
    grad1.addBreakPt(0.9, TentaGL.Color.RGBA(1,1,1,1));
    TentaGL.MaterialLib.add(gl, "grad1", grad1);
    
    var grad2 = new TentaGL.Gradient([0.3,0.3], [0.5,0]);
    grad2.addBreakPt(0, TentaGL.Color.RGBA(0,0,1,1))
    grad2.addBreakPt(0.6, TentaGL.Color.RGBA(0,1,1,1))
    grad2.addBreakPt(1, TentaGL.Color.RGBA(1,1,1,1));
    TentaGL.MaterialLib.add(gl, "grad2", grad2);
    
    // Label BG icon
    var canvas = TentaGL.Canvas2D.createRoundedRect(300, 100, 32, false, 0, TentaGL.Color.RGBA(0.3, 0.3, 0.3, 1));
    TentaGL.Canvas2D.removeAlpha(canvas);
    
    var pixels = TentaGL.PixelData.fromCanvas(canvas);
    pixels = pixels.filter(TentaGL.RGBAFilter.MulColor.RGBA(1, 1, 1, 1));
    var labelBG = TentaGL.Texture.fromPixelData(gl, pixels);
    TentaGL.MaterialLib.add(gl, "labelBG", labelBG);
    
    
    // blittered font: Final Fontasy
    this.blitFont = TentaGL.BlitteredFont.fromURL("../../images/finalFontasy.png", 
      false, 10, 10, 1, 1, 
      function(pixels) {
        return pixels.filter(TentaGL.RGBAFilter.TransparentColor.RGBBytes(255,0,255));
      }
    );
    
    var font = new TentaGL.Font("Arial", "sans-serif", 36);
    var fColor = TentaGL.Color.RGBA(1,1,1,1);
    this.blitFont2 = TentaGL.BlitteredFont.fromFont(font, fColor, 1, 1, function(pixels) {
      pixels = pixels.filter(TentaGL.RGBAFilter.OutlineColor.RGBBytes(150,150,200));
      return pixels;
    });
    
    
    // bump map and bump-mapped texture.
    TentaGL.MaterialLib.add(gl, "brickBumpMap", TentaGL.Texture.fromURL(gl, "../../images/sampleTexBump.png"));
    TentaGL.MaterialLib.add(gl, "bumpedRed", new TentaGL.BumpMappedTexture("red", "brickBumpMap"));
    
    
    // Audio // May hang in some browsers due to compatibility.
  //  TentaGL.AudioLoader.load("http://www.w3schools.com/jsref/horse.ogg", function(audio) {
  //    self.horseAudio = audio;
  //  });
  },
  
  
  /** We are required to override TentaGL.Application.initModels */
  initModels:function() {
    var gl = this.getGL();
    
    var cubeModel = TentaGL.Model.Cube(2, 2, 2);//.cloneCentered();
    TentaGL.ModelLib.add(gl, "cube", cubeModel);
    
    var lineModel = TentaGL.Model.Line([0,0,0],[1,1,0]);
    TentaGL.ModelLib.add(gl, "line", lineModel);
    
    var polyLineModel = TentaGL.Model.PolyLine([[0,0,0],[1,1,0],[1,0,1]], true);
    TentaGL.ModelLib.add(gl, "polyline", polyLineModel);
    
    var cylinderModel = TentaGL.Model.Cylinder(1,2).rotate([1,0,0],TentaGL.TAU/4);
    TentaGL.ModelLib.add(gl, "cylinder", cylinderModel);
    
    
    TentaGL.Model.ObjReader.fromURL("../../models/teapot.obj", function(models) {
      console.log("loaded teapot model", models);
      
      var model = models["Object001"];
      model.generate2DTexCoordsSpherical();
      model.generateSurfaceTangentals();
      TentaGL.ModelLib.add(gl, "teapot", model);
    });
  },
  
  
  /** We are required to override TentaGL.Application.reset */
  reset:function() {
    this.camera = new TentaGL.ArcballCamera([10, 10, 10], [0, 0, 0]);
    this.rX = 0;
    this.drX = 0;
    this.rY = 0;
    this.drY = 0.01;
    this.rZ = 0;
    this.drZ = 0;
    
    var matProps1 = new TentaGL.MaterialProps();
    matProps1.setShininess(10);
    matProps1.setSpecular(TentaGL.Color.YELLOW);
    
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
    this.axesGroup.add(this.createSphereSprite([10,0,0], "red", "phong"));
    this.axesGroup.add(this.createSphereSprite([0,10,0], "green", "phong"));
    this.axesGroup.add(this.createSphereSprite([0,0,10], "blue", "phong"));
    this.axesGroup.add(this.createSphereSprite([0,0,0], "white", "phong"));
    this.axesGroup.add(this.createSphereSprite([0,0,0], "black", "phong"));
    
    this.camGroup = new TentaGL.SceneGroup();
    this.camGroup.add(this.createSphereSprite([15,0,0], "black", "phong"));
    
    this.textSprite = new TentaGL.TextIconSprite([1, 1, 1], "Hello, \nWorld!", this.blitFont); //this.createTextIconSprite([1,1,1], "Hello, \nWorld!");
    
    this.labelledIconSprite = new TentaGL.LabelledIconSprite([3,3,3], "iconNew" ,"New sprite\nWith 2 lines!", "labelBG", this.blitFont2);
    
    this.line1 = new TentaGL.Math.Line2D([2,5], [10,0]);
    this.line2 = new TentaGL.Math.Line2D([5,2], [10,10]);
    
    this.gradSprite = TentaGL.Sprite.create([0, 0, -1], "unitPlane", "grad1", "gradientShader");
    this.gradSprite.setScaleXYZ([4,3,1]);
    
    this.gradSprite2 = TentaGL.Sprite.create([4, 0, -1], "unitPlane", "grad2", "gradientShader2"); 
    this.gradSprite2.setScaleXYZ([4,3,1]);
    
    this.teapotSprite = TentaGL.Sprite.create([0, 0, 0], "teapot", "green", "normalShader");
    
    this.coneSprite = TentaGL.Sprite.create([12, 0, 0], "unitCone", "bumpedRed", "phong", matProps1);
    
    // Lighting test objects
    this.lights = new TentaGL.LightManager(TentaGL.PhongShader.MAX_LIGHTS);
    this.ptLight1 = new TentaGL.PointLight([0,0,0]);
    this.ptLight1.setAmbient(TentaGL.Color.RGBA(0.2, 0.2, 0.2, 1));
    this.lights.add(this.ptLight1);
    
    
    this.shadedSprite1 = TentaGL.Sprite.create([5, 0, 0], "unitSphere", "bumpedRed", "phong", matProps1); 
    this.shadedSprite2 = TentaGL.Sprite.create([5, -5, 0], "unitSphere", "white", "phong", matProps1); 
    this.shadedSprite3 = TentaGL.Sprite.create([5, 20, 0], "unitSphere", "bumpedRed", "phong", matProps1); 
    this.shadedSprite3.setScaleXYZ([4, 4, 4]);
  },
  
  
  
  /** We are required to override TentaGL.Application.update */
  update:function() {
    if(TentaGL.ImageLoader.isLoading()) {
      console.log("Loading image data...");
      return;
    }
    if(TentaGL.Model.ObjReader.isLoading()) {
      console.log("Loading models..." + TentaGL.Model.ObjReader.getNumLoading());
      return;
    }
    if(TentaGL.AudioLoader.isLoading()) {
      console.log("Loading audio data...");
      return;
    }
    
    var gl = this.getGL();
    
    // Scene application code
    this.updateScene(gl);
    
    // Picker test
    if(this._mouse.isLeftPressed()) {
      this.getPicker().update(gl, this.drawScene.bind(this), false);
      
    //  var mx = this._mouse.getX();
    //  var my = this.getHeight() - this._mouse.getY()
    //  var sprite = this.getPicker().getSpriteAt(mx, my);
      var sprite = this.getPicker().getSpriteAtMouse(this.mouse());
      console.log(sprite);
      
      if(sprite && sprite.isaTextSprite) {
      //  sprite.setColor(new TentaGL.Color.RGBA(0.5,0,0,1));
        sprite.setText("X__X You clicked me...\nI am dead now.");
      //  sprite.scaleToHeight(1);
      }
    }
    else {
    //  this.drawScene(gl);
    }
    this.drawScene(gl);
  },
  
  
  
  //////// Update/render helpers
  
  
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
    
    if(this._keyboard.justPressed(KeyCode.SPACE)) {
      this.horseAudio.play();
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
    this.ptLight1.setXYZ(this.camera.getCenter());
    this.camGroup.setQuat(this.camera._orientation);
    
    var sprites = this.spriteGroup.getChildren();
    for(var i = 0; i < sprites.length; i++) {
      var sprite = sprites[i];
      
      // spin slowly around their local group's Y axis.
      sprite.rotate([0, 1, 0], 0.01);
      //sprite.billboardWorldAxis(camEye);
    }
    
    
    this.shadedSprite1.rotate([0, 1, 0], 0.01);
    this.shadedSprite3.rotate([0, 1, 0], 0.01);
  },
  
  
  
  
  /** Draws the scene. */
  drawScene:function(gl) {
    TentaGL.ShaderLib.use(gl, "phong");
    this.lights.useMe(gl);
    
    TentaGL.ShaderLib.use(gl, "simpleShader");
    TentaGL.RenderMode.set3DOpaque(gl);
    
    var aspect = gl.canvas.width/gl.canvas.height;
    TentaGL.ViewTrans.setCamera(gl, this.camera, aspect);
    
    // Clear the scene. 
    TentaGL.clear(gl, TentaGL.Color.RGBA(0.1, 0.1, 0.3, 1));
    
    // Draw the objects in the scene.
    this.blitFont.renderString(gl, "The quick, brown fox \njumped over the lazy dog.", [10,10,0], false, 1);
    
    this.spriteGroup.render(gl, this.camera);
    this.axesGroup.render(gl);
    this.camGroup.render(gl);
    
    this.textSprite.render(gl);
    
    this.labelledIconSprite.render(gl);
    
    var linesMat = "green";
    if(this.line1.intersects(this.line2)) {
      linesMat = "white";
    }
    this.line1.render(gl, linesMat);
    this.line2.render(gl, linesMat);
    
    // Render a sphere, using the normal vector shader.
    TentaGL.ShaderLib.use(gl, "normalShader");
    (new TentaGL.Math.Sphere(1, [5,0,5])).render(gl, "white");
    TentaGL.ShaderLib.use(gl, "simpleShader");
    
    
    (new TentaGL.Math.Line3D([5,5,5], [10, 0, 0])).render(gl, "white");
    
    this.gradSprite.render(gl);
    this.gradSprite2.render(gl);
    
    this.teapotSprite.render(gl);
    
    TentaGL.ShaderLib.use(gl, "phong");
    this.shadedSprite1.render(gl);
    this.shadedSprite2.render(gl);
    this.shadedSprite3.render(gl);
    
    this.coneSprite.render(gl);
    
    TentaGL.ShaderLib.use(gl, "simpleShader");
    TentaGL.MaterialLib.use(gl, "white");
    this.lights.render(gl);
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
}
