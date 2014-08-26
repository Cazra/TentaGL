HelloWorldApp.MainLevel = function(app) {
  TentaGL.Level.call(this, app);
};


HelloWorldApp.MainLevel.prototype = {
  
  /** 
   * Produces a test sprite. 
   * @param {vec4} xyz  The sprite's position in local space.
   * @return {TentaGL.Sprite}
   */
  createTestSprite:function(xyz) {
    var sprite = TentaGL.Sprite.create(xyz, "cylinder", "testCircle", "phongPerVertex");
    sprite.scaleU(0.25);
    sprite.opacity(0.5);
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
    sprite.scaleU(0.5);
    
    return sprite;
  },
  
  
  //////// Level implementations
  
  reset: function(gl) {
    var self = this;
    
    this.cam2D = new TentaGL.Camera2D([0,0], gl.canvas.width, gl.canvas.height);
    this.cam2D.anchor([0,0]);
    
    this.camera = new TentaGL.ArcballCamera([10, 10, 10], [0, 0, 0]);
    this.rX = 0;
    this.drX = 0;
    this.rY = 0;
    this.drY = 0.01;
    this.rZ = 0;
    this.drZ = 0;
    
    this._frames = 0;
    
    
    this.tooltip = new TentaGL.UI.Tooltip(this.getApp().blitFont, "blue", 8, 1000, 12);
    
    
    var matProps1 = new TentaGL.MaterialProps();
    matProps1.shininess(10);
    matProps1.specular(TentaGL.Color.YELLOW);
    
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
    this.axesGroup.add(this.createSphereSprite([10,0,0], "red", "phongPerVertex"));
    this.axesGroup.add(this.createSphereSprite([0,10,0], "green", "phongPerVertex"));
    this.axesGroup.add(this.createSphereSprite([0,0,10], "blue", "phongPerVertex"));
    this.axesGroup.add(this.createSphereSprite([0,0,0], "white", "phongPerVertex"));
    this.axesGroup.add(this.createSphereSprite([0,0,0], "black", "phongPerVertex"));
    
    this.camGroup = new TentaGL.SceneGroup();
    this.camGroup.add(this.createSphereSprite([15,0,0], "black", "phongPerVertex"));
    
    this.textSprite = new TentaGL.TextIconSprite([1, 1, 1], "Hello, \nWorld!", this.getApp().blitFont); //this.createTextIconSprite([1,1,1], "Hello, \nWorld!");
    
    this.labelledIconSprite = new TentaGL.LabelledIconSprite([3,3,3], "iconNew" ,"New sprite\nWith 2 lines!", "labelBG", this.getApp().blitFont2);
    
    this.line1 = new TentaGL.Math.Line2D([2,5], [10,0]);
    this.line2 = new TentaGL.Math.Line2D([5,2], [10,10]);
    
    this.gradSprite = TentaGL.Sprite.create([0, 0, -1], "unitPlane", "grad1", "gradientShader");
    this.gradSprite.scale([4,3,1]);
    
    this.gradSprite2 = TentaGL.UI.Button.create([4, 0, -1], "unitPlane", "grad2", "gradientShader"); 
    this.gradSprite2.scale([4,3,1]);
    this.gradSprite2.onRightClick = function(mouse) {
      this.setVisible(false);
      console.log("gradSprite 2 was clicked");
    };
    this.gradSprite2.setTooltip("I will disappear if you right-click me.", this.tooltip);
    this.gradSprite2.cursor("pointer");
    
    this.teapotSprite = TentaGL.Sprite.create([0, 0, 0], "teapot", "green", "normalShader");
    
    this.coneSprite = TentaGL.Sprite.create([12, 0, 0], "unitCone", "blue", "phongPerVertex", matProps1);
    
    // Lighting test objects
    this.lights = new TentaGL.LightManager(TentaGL.PhongShader.MAX_LIGHTS);
    this.ptLight1 = new TentaGL.PointLight([0,0,0]);
    this.ptLight1.ambient(new TentaGL.Color([0.2, 0.2, 0.2, 1]));
    this.lights.add(this.ptLight1);
    
    
    this.shadedSprite1 = TentaGL.Sprite.create([5, 0, 0], "unitSphere", "bumpedRed", "phong", matProps1); 
    this.shadedSprite2 = TentaGL.Sprite.create([5, -5, 0], "unitSphere", "white", "phongPerVertex", matProps1); 
    this.shadedSprite3 = TentaGL.Sprite.create([5, 20, 0], "unitSphere", "bumpedRed", "phong", matProps1); 
    this.shadedSprite3.scale([4, 4, 4]);
    
    
    this.imageSprite = new TentaGL.Sprite([0,0,1]);
    this.imageSprite.draw = function(gl) {
      var tex = TentaGL.MaterialLib.get(gl, "coinBlock");
      tex.render(gl, false, 1);
    };
    
    
    this.rect3DSprite = new TentaGL.Sprite([0,0,0]);
    this.rect3DSprite.draw = function(gl) {
      (new TentaGL.Math.Rect3D([0,0,2], 2, 1, 0.5)).render(gl, "red");
    };
    
    
    this.tri2DSprite = new TentaGL.Sprite([0,0,3]);
    this.tri2DSprite.draw = function(gl) {
      (new TentaGL.Math.Triangle2D([0,0], [2,1], [1,2])).render(gl, "green");
    };
    
    
    this.bezier2DSprite = new TentaGL.Sprite([0,0,4]);
    this.bezier2DSprite.draw = function(gl) {
      var start = [0,0];
      var ctrls = [[-2,5], [3,-10], [4,10], [1,1]];
      var end = [1,0];
      
      var curve = new TentaGL.Math.BezierCurve2D(start, ctrls, end);
      curve.render(gl, "blue");
      
      // Test closest point algorithm.
      var closest = curve.closestPt(self.camera.center());
      pt = new TentaGL.Math.Sphere(0.1, [closest[0], closest[1], 0]);
      pt.render(gl, "blue");
    };
    
    
    this.bezier3DSprite = new TentaGL.Sprite([0,0,5]);
    this.bezier3DSprite.draw = function(gl) {
      var start = [0,0, 0];
      var ctrls = [[-2,5, 5], [3,-10, -2], [4,10,4], [1,1,-2]];
      var end = [1,0,0];
      
      var curve = new TentaGL.Math.BezierCurve3D(start, ctrls, end);
      curve.render(gl, "blue");
      
      // Test closest point algorithm.
      var closest = curve.closestPt(vec3.add([], self.camera.center(), [0,0,-5]));
      pt = new TentaGL.Math.Sphere(0.1, closest);
      pt.render(gl, "blue");
    };
    
    // Audio // May hang in some browsers due to compatibility.
    TentaGL.AudioLoader.load("http://www.w3schools.com/jsref/horse.ogg", function(audio) {
      self.horseAudio = audio;
    });
    
    
    this.fog = new TentaGL.Fog(TentaGL.Fog.EXP, TentaGL.Color.Hex(0xFFFFFFFF), 0.005);
  },
  
  
  
  update: function(gl) {
    this._frames++;
    this.getApp().getCanvas().style.cursor = "default";
    
    // Group rotation
    if(this.keyboard().isPressed(KeyCode.W)) {
      this.spriteGroup.rotate([1,0,0], -0.1);
    }
    if(this.keyboard().isPressed(KeyCode.S)) {
      this.spriteGroup.rotate([1,0,0], 0.1);
    }
    
    if(this.keyboard().isPressed(KeyCode.D)) {
      this.spriteGroup.rotate([0,1,0], 0.1);
    }
    if(this.keyboard().isPressed(KeyCode.A)) {
      this.spriteGroup.rotate([0,1,0], -0.1);
    }
    
    if(this.keyboard().justPressed(KeyCode.SPACE)) {
      this.horseAudio.play();
    }
    
    
    // Camera reset
    if(this.keyboard().justPressed(KeyCode.R)) {
      this.camera.resetOrientation();
    }
    
    // Click count test
    if(this.mouse().justLeftReleased() && this.mouse().leftClickCount() > 1) {
      console.log(this.mouse().leftClickCount());
    }
    
    // Camera control
    this.camera.controlWithMouse(this.mouse(), this.getApp().getWidth(), this.getApp().getHeight());
    
    this.axesGroup.get(3).xyz(this.camera.center());
    this.ptLight1.xyz(this.camera.center());
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
    
    // Picker test
    if(this.mouse().isLeftPressed() || this.mouse().justLeftReleased() || this.mouse().justRightReleased() || this.mouse().justRightPressed()) {
      var picker = this.getApp().getPicker();
      picker.update(gl, this.render.bind(this), false);
      
      this.gradSprite2.updateMouseState(picker, this.mouse());
      
    //  var mx = this.mouse().getX();
    //  var my = this.getHeight() - this.mouse().getY()
    //  var sprite = this.getPicker().getSpriteAt(mx, my);
      var sprite = picker.getSpriteAtMouse(this.mouse());
      console.log(sprite);
      
      if(sprite && sprite.isaTextSprite) {
        sprite.setText("X__X You clicked me...\nI am dead now.");
      }
    }
    else {
      this.tooltip.reset();
    }
  },
  
  
  
  render: function(gl) {
    var self = this;
    var aspect = gl.canvas.width/gl.canvas.height;
    
  //  TentaGL.DrawMode.mode(gl, GL_LINES);
    
  //  TentaGL.Scissor.enabled(gl, true);
  //  TentaGL.Scissor.xywh(gl, [100, 100, 640, 480]);
    
    TentaGL.ShaderLib.use(gl, "phong");
    this.lights.useMe(gl);
    this.fog.useMe(gl);
    
    TentaGL.ShaderLib.use(gl, "phongPerVertex");
    this.lights.useMe(gl);
    this.fog.useMe(gl);
    
    
    TentaGL.ShaderLib.use(gl, "gradientShader");
    this.fog.useMe(gl);
    
    TentaGL.ShaderLib.use(gl, "simpleShader");
    this.fog.useMe(gl);
    TentaGL.RenderMode.set3DOpaque(gl);
    
    TentaGL.ViewTrans.setCamera(gl, this.camera, aspect);
    
    // Clear the scene. 
    TentaGL.clear(gl, TentaGL.Color.WHITE);//new TentaGL.Color([0.1, 0.1, 0.3, 1]));
    
    // Draw the objects in the scene.
    this.getApp().blitFont.renderString(gl, "The quick, brown fox \njumped over the lazy dog.", [10,10,0], false, 1);
    
    
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
    this.fog.useMe(gl);
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
    this.imageSprite.render(gl);
    this.rect3DSprite.render(gl);
    this.tri2DSprite.render(gl);
    this.bezier2DSprite.render(gl);
    this.bezier3DSprite.render(gl);
    
    // this.drawClipPts(gl);
    
    var testPlane = new TentaGL.Math.Plane([0,1,0], [0, -4, 0]);
    var line = new TentaGL.Math.Line3D([4, 10, 3], [20, -20, 10]);
    line.render(gl, "green");
    var pt = testPlane.segmentIntersection(line);
    if(pt) {
      (new TentaGL.Math.Sphere(1, pt)).render(gl, "blue");
    }
    else {
      (new TentaGL.Math.Sphere(2, pt)).render(gl, "red");
    }
    
    
    TentaGL.ShaderLib.use(gl, "simpleShader");
    TentaGL.MaterialLib.use(gl, "white");
    this.lights.render(gl);
    
    // Transparent objects rendered last.
    TentaGL.ShaderLib.use(gl, "phongPerVertex");
    TentaGL.RenderMode.set3DTrans(gl);
    
    
    TentaGL.ShaderLib.push(gl);
    TentaGL.ShaderLib.use(gl, "plane");
    this.fog.useMe(gl);
    var planeShader = TentaGL.ShaderLib.current(gl);
    if(planeShader.isaPlaneShader) {
      planeShader.setSFunc(gl, [1/10, 0, 0, this._frames/200]);
      planeShader.setTFunc(gl, [0, 0, 1/10, this._frames/400]);
      planeShader.setOpacity(gl, 0.5);
    }
    
    testPlane.render(gl, "blueTile");
    TentaGL.ShaderLib.pop(gl);
    
    
    this.spriteGroup.render(gl, this.camera);
    
    // Tooltip test
    TentaGL.ShaderLib.use(gl, "simpleShader");
    TentaGL.ViewTrans.setCamera(gl, this.cam2D, aspect);
    this.tooltip.render(gl);
    
    // ClippingArea test
    /*
    TentaGL.ShaderLib.use(gl, "simpleShader");
    TentaGL.ViewTrans.setCamera(gl, this.cam2D, aspect);
    TentaGL.ClippingArea.setClip(gl, function(gl) {
      self.drawEllipse(gl, [32,32], 640, 480);
    });
    TentaGL.ClippingArea.clip(gl, function(gl) {
      self.drawEllipse(gl, [320, 200], 640, 480);
    });
    
    
    this.drawEllipse(gl, [0,0], gl.canvas.width, gl.canvas.height);
    TentaGL.Stencil.enabled(gl, false);
    */
  },
  
  
  drawRect: function(gl, xy, w, h) {
    var rect = new TentaGL.Math.Rect2D(xy, w, h);
    rect.render(gl, "white");
  },
  
  drawEllipse: function(gl, xy, w, h) {
    TentaGL.Math.Ellipse2D.fromRect(new TentaGL.Math.Rect2D(xy, w, h)).render(gl, "white");
  },
  
  
  drawClipPts: function(gl) {
    var camera = TentaGL.ViewTrans.getCamera(gl);
    var far = camera.getZFar();
    var dist = camera.getDist();
    
    var viewWidth = gl.canvas.width;
    var viewHeight = gl.canvas.height;
    var pt = this.mouse().getXY();
    
    var nf = camera.projectToClip(pt, viewWidth, viewHeight);
    
    (new TentaGL.Math.Sphere(0.05, nf[0])).render(gl, "green");
    (new TentaGL.Math.Sphere(100, nf[1])).render(gl, "red");
  }
  
};


Util.Inheritance.inherit(HelloWorldApp.MainLevel, TentaGL.Level);
