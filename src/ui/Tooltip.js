/** 
 * Used to display a tooltip for some component.
 * @constructor
 * @param {TentaGL.BlitteredFont} blitFont
 * @param {string} bgMaterialName   The name of the material used to render the background of the tooltip.
 * @param {uint} padding
 */
TentaGL.Tooltip = function(blitFont, bgMaterialName, padding, delay) {
  this._bgMatName = bgMaterialName;
  this._blitFont = blitFont;
  this._pad = padding;
  this._delay = delay;
  
  this.text("");
};

TentaGL.Tooltip.getDefault = function(gl) {
  if(!gl._defaultTooltip) {
    var font = new TentaGL.Font("Arial", "sans-serif", 10);
    var fColor = TentaGL.Color.RGBA(0.8, 0.8, 0.8, 1);
    var blitFont = TentaGL.BlitteredFont.fromFont(font, fColor, 1, 1, function(pixels) {
      pixels = pixels.filter(TentaGL.RGBAFilter.OutlineColor.RGBBytes(150,150,200));
      return pixels;
    });
    
    gl._defaultTooltip = new TentaGL.Tooltip(blitFont, "_defaultTooltipBGColor", 4, 1000);
  }
  return gl._defaultTooltip;
},



TentaGL.Tooltip.prototype = {
  
  constructor: TentaGL.Tooltip,
  
  isaTooltip: true,
  
  /** 
   * Setter/getter for the text displayed by the tooltip. 
   * @param {string} text   Optional.
   * @return {string}
   */
  text: function(text) {
    this._text = text;
    this._dims = this._blitFont.getStringDimensions("");
  },
  
  
  /** 
   * Returns the dimensions of the tooltips with its current text.
   * @return {[width: number, height: number]}
   */
  getDimensions: function() {
    var w = this._dims[0] + this._pad*2;
    var h = this._dims[1] + this._pad*2;
    
    return [w,h];
  },
  
  
  /** 
   * Setter/getter for the tooltip's padding between its text and its border. 
   * @param {uint} padding    Optional.
   * @return {uint}
   */
  padding: function(padding) {
    if(padding !== undefined) {
      this._pad = padding;
    }
    return this._pad;
  },
  
  
  /** 
   * Setter/getter for the tooltip's delay, in milliseconds. The user must 
   * mouse-over a component for this long for the tooltip to be displayed.
   * @param {uint} delay    Optional.
   * @return {uint}
   */
  delay: function(delay) {
    if(delay !== undefined) {
      this._delay = delay;
    }
    return this._delay;
  },
  
  
  /** 
   * Renders the tooltip. 
   * @param {WebGLRenderingContext} gl
   * @param {string} text   Optional. Sets the tooltip's text before rendering.
   * @param {vec3} xyz    Optional. Offset to render the tooltip at.
   */
  render: function(gl, text, xyz) {
    if(text) {
      this.text(text);
    }
    if(xyz) {
      TentaGL.ViewTrans.translate(gl, xyz);
    }
    
    var dims = this.getDimensions();
    
    TentaGL.MaterialLib.use(gl, this._bgMatName);
    
    TentaGL.ViewTrans.push(gl);
    TentaGL.ViewTrans.scale(gl, dims);
    TentaGL.ModelLib.render(gl, "unitSprite");
    TentaGL.ViewTrans.pop(gl);
    
    this._blitFont.renderString(gl, this._text, [this._pad, this._pad], true);
  }
};

Util.Inheritance.inherit(TentaGL.Tooltip, TentaGL.Renderable);
