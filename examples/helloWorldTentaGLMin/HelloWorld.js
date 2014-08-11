/** 
 * A sandbox application used to test features of TentaGL. 
 * @constructor
 * @mixes {TentaGL.Application}
 * @param {DOM div element} container
 */
var HelloWorldApp = function(container) {
  TentaGL.Application.call(this, container, {stencil:true, alpha: false});
};

HelloWorldApp.prototype = {
  
  constructor:HelloWorldApp,
  

  //////// Required Application interface implementations
  
  
  /** We are required to override TentaGL.Application.initShaders */
  initShaders:function() {
    var gl = this.getGL();
    
    try {
      TentaGL.SimpleShader.load(gl, "simpleShader");
      TentaGL.NormalShader.load(gl, "normalShader");
      TentaGL.LinearGradientShader.load(gl, "gradientShader");
      TentaGL.RadialGradientShader.load(gl, "gradientShader2");
    //  TentaGL.PhongShader.load(gl, "phong");
      TentaGL.PhongShaderMac.load(gl, "phong");
    //  TentaGL.PerVertexPhongShader.load(gl, "phongPerVertex");
      TentaGL.PerVertexPhongShaderMac.load(gl, "phongPerVertex");
      TentaGL.CircleShader.load(gl, "circle");
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
    grad2.addBreakPt(1, TentaGL.Color.RGBA(0.5,0.5,1,1));
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
    this.setLevel(new HelloWorldApp.MainLevel(this));
  },
  
  
  
  /** We are required to override TentaGL.Application.update */
  update:function() {
    if(TentaGL.ShaderLoader.isLoading()) {
      console.log("Loading shaders..." + TentaGL.ShaderLoader.getNumLoading());
      return;
    }
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
    
    this.getLevelManager().run(this.getGL());
  }
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
HelloWorldApp.main = function() {
  HelloWorldApp.getInstance().start();
}
