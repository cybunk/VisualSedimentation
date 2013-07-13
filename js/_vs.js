// ....................................................................
// Main Visual Sedimentation Code
// ....................................................................

// TODO : 
// - callback on rollOut

(function($){

// Name Space Plug in Jquery Objects
$.fn.vs = function (){}
$.fn._vs={}

// All this objects are define in correspondant .js files
$.fn._vs.token      = {}
$.fn._vs.draw       = {}
$.fn._vs.stream     = {}
$.fn._vs.chart      = {}
$.fn._vs.phy        = {}
$.fn._vs.decay      = {}
$.fn._vs.flocculate = {}
$.fn._vs.strata     = {}
$.fn._vs.aggregate  = {}


// Core Classe 
var VisualSedimentation = function(element,options){

  // Attach objects
  this.token        = $.fn._vs.token
  this.draw         = $.fn._vs.draw
  this.stream       = $.fn._vs.stream
  this.chart        = $.fn._vs.chart
  this.phy          = $.fn._vs.phy 
  this.decay        = $.fn._vs.decay 
  this.flocculate   = $.fn._vs.flocculate
  this.strata       = $.fn._vs.strata
//  this.aggregate    = $.fn._vs.aggregate 
  this.requestAnimFrame;


  // Variables 
  this.dataFlow     = [];
  this.chartPhySetup= {}
  this.tokens       = [];
  this.world        = null;
  this.ctx          = null;
  var elem 	        = $(element);
  var self 	        = this;
	var tokens        = [];
	var B2D;   
	var canvas;


   // Default Settings  
	var defaultSettings = {
          x:0,
          y:0,
          width:300.5,
          height:300.5,
          DOMelement:null,
          chart:{ 
              x:undefined,
              y:undefined,
              width:undefined,
              height:undefined,
              colorRange:d3.scale.category10(),
              scale:d3.scale,
              type:'StackedAreaChart',
                  /*
                    name are based on prefuse tollokit layout :
                     - CircleLayout,
                     - StackedAreaChart,
                     //- bubbleAreaChart,
                     x AxisLabelLayout,
                     x AxisLayout,
                     x CollapsedStackLayout,
                     x GridLayout, 
                  */
              spacer:5,
              //treeLayout:false,
              column:3,
              wallColor:"rgba(230,230,230,0)",
              label:true,
              radius:10 // for CircleLayout
          },
          data:{
              model:[
                        {label:"Column A"},
                        {label:"Column B"},
                        {label:"Column C"},
                      ],
              strata:[
                      [
                        {initValue: 100, label: "Strata 1 col A"}
                      ],[
                        {initValue: 20, label: "Strata 1 col B"}
                      ],[
                        {initValue: 175, label: "Strata 2 col C"}
                      ]      
                      ],
              token:[
                       {
                         timestamp:1,
                         category:1,
                         value: 1,
                         userdata:{},
                         callback:{}
                       }
                      ],
              tokenPast:0,
          		stream:{
                      provider:'generator',
          				    refresh:1000/1,
                      now:0
      					},
          		}
          ,
          sedimentation:{
              world:{
                gravity:{x:0.001,y:10},
                timeStep:60,
              },
              token:{size:{original:5
                          ,minimum:2}
                          ,visible:true},   // fill color, shape,
              incoming:{
                        strategy:1,         // 1 = one element by one, more = by Groupe  
                        point:[{x:50,y:0},
                              {x:100,y:0},
                              {x:150,y:0}],

                        target:[{x:50,y:0},
                              {x:100,y:0},
                              {x:150,y:0}]
                        },
              granulate:{visible:false},
              flocculate:{
            			 number:1,	              // 1 = one element by one, more = by groupe of n
            			 action:"buffer",       	// [buffer,continue]
            			 strategy:"Size",       	// [BufferSize, Time, AcummulationAreaHeight, Fps, Manual]
                   bufferSize:10,         	// number of token to make floculation
            			 bufferTime:1000,      	  // time buffer to make flocullation
            			 bufferHeight:50,       	// height (pixel) to make floculation
            			 bufferFrameRate:25,    	// if the computer is to slow floculate
                   buffer:[]
    					},
              suspension:{
                          height:null,      // pourcent,adaptative
                          incomming:'top',
                          decay:{power:1.01}, // null
                          refresh:200
                         },
              accumulation:{                // pourcent ,adaptative
                          height:null
              },  
              aggregation:{
                    type:"stacked",         // pixel, stacked, chained, trails, isocontours 
                    height:100,           // pourcent ,adaptative
                    maxData:0,
                    invertStrata:false,
                    strataUpdate:true,
                    transition:null,
              },       
          },
          draw:{
              callback:{
                //begin:function(_this){},
                //end:function(_this){}
              },
              trail:0
            },
          options:{
                  refresh:1000/30,
                  panel:false,
                  scale:30,
                  layout:false,
                  canvasFirst:true,
                  }
          }


    this.now = function(){
      return(new Date().getTime())
    }

     // get Box2d World 
     this.globalDecay = function (value){
      if(typeof(value)=='undefined'){
        return this.settings.sedimentation.suspension.decay.power
      }else{
        return this.settings.sedimentation.suspension.decay.power=value
      }
     }

     // get Box2d World 
     this.getWorld = function (){
      return this.world;
     }

     this.chartUpdate = function (cat,y){
      var options = {cat:cat,y:y}
      this.chart[this.settings.chart.type](self,'update',options)
     }

     // Todo  ...... 
     this.flocculateTokens = function (number){
      return this.flocculate.update(self,number)
     }

     // TODO DESTROY ALL TOKENS 
    this.flocculateAll = function(){
        return this.flocculate.all(self)
     }

     // Add token function 
     this.addToken = function (element){
      //var token = this.token.addToken(self,element)
      return this.token.addToken(self,element);
     }
     
     // Select token fonction
     this.selectAll = function (key,value){
      return this.token.selectAll(self,key,value);
     }

     // Select token fonction
     this.select = function (key,value){
      return this.token.select(self,key,value);
     }

     // update a categoryr in the chart
     this.updateAll = function (values){
      var tokens = this.chart.updateAll(self,key,value)
      return tokens;
     }

     // update a category in the chart
     this.update = function (key,value){
      var tokens = this.chart.update(self,key,value)
      return tokens;
     }


    /// Settings without 


    //////////////////////////////////////////////////////// TO CLEAN
    // SAM @ROM1 : are you sure you need that ? extend doing it well normally
  	// Merge options with defaults
    // http://stackoverflow.com/questions/171251/how-can-i-merge-properties-of-two-javascript-objects-dynamically
    
    //console.log("////////")
    //options.model = modelToStrata(options.data.model)

    function merge_options(obj1,obj2){
        var obj3 = {};
        for (var attrname in obj1) { obj3[attrname] = obj1[attrname]; }
        for (var attrname in obj2) { obj3[attrname] = obj2[attrname]; }
        return obj3;
    }

     merge_options(defaultSettings, options);
     if(options.data!=undefined)
     defaultSettings.data = options.data;
     
     ////////////////////////////////////////////////////////////////////////////////////
     // Merge option and add the DOMelement to setting
     //this.settings = $.extend(defaultSettings, options || {});
     this.settings = $.extend(true,defaultSettings, options);
     this.settings.DOMelement = element
     //console.log('settings after extend',this.settings)

     // -----------------------------------------------
     // SIMPLE DEFAULT SETTING FOR RETRO COMPATIBILITY 
     //
     if(typeof(this.settings.chart.width) =="undefined"){this.settings.chart.width = this.settings.width}
     if(typeof(this.settings.chart.x)     =="undefined")this.settings.chart.x=0
     if(typeof(this.settings.chart.y)     =="undefined")this.settings.chart.y=0
     if(typeof(this.settings.chart.height)=="undefined")this.settings.chart.height=this.settings.height
     if(typeof(this.settings.stream)      =="undefined"){this.settings.stream={}}
     if(typeof(this.settings.stream.now)  =="undefined"){this.settings.stream.now=0}     
     if(typeof(this.settings.stream.provider)=="undefined"){this.settings.stream.provider='generator'}
     if(typeof(this.settings.stream.refresh)=="undefined"){this.settings.stream.refresh=1000}
     if(typeof(this.settings.data.tokenPast)=="undefined"){this.settings.data.tokenPast=0}
     if(typeof(this.settings.data.tokens)=="undefined"){this.settings.data.tokens=[]}

     // FOR ROM1 setting by default aggregation : 
     if(typeof(this.settings.data.strata) !="undefined" && this.settings.data.strata.length!=0){
       if(typeof(this.settings.sedimentation.aggregation) =="undefined"){
          this.settings.sedimentation.aggregation = {}
        }
       if(typeof(this.settings.sedimentation.aggregation.height) =="undefined"){
          this.settings.sedimentation.aggregation.height = this.settings.chart.height/2
       }
      if(typeof(this.settings.sedimentation.aggregation.maxData) =="undefined"){
          this.settings.sedimentation.aggregation.maxData = 10
       }
     }
     // END


     // Initialisation - Private method 
     this.init = function(){
       // requestAnim shim layer by Paul Irish
       // not use yet, to add
       this.requestAnimFrame = (function(){
         return  window.requestAnimationFrame       || 
                 window.webkitRequestAnimationFrame || 
                 window.mozRequestAnimationFrame    || 
                 window.oRequestAnimationFrame      || 
                 window.msRequestAnimationFrame     || 
                 function(/* function */ callback, /* DOMElement */ element){
                   window.setTimeout(callback, 1000 / 60);
                 };
       })();

        //console.log(this.settings)
        //console.log('Initialisation');
        
        // Create the physical simulation 
   		   this.world = new this.phy.b2World(
   		      new this.phy.b2Vec2(0, 0)       //gravity
   		     ,  false                 //allow sleep
   		   );

   	    // Create container and canvas for physical simulation drawing 
		    var container = element.appendChild(document.createElement("div"));
		    container.id  = "box_sediviz_"+GUID()
        container.width  = this.settings.width; // TOFIX
        container.height = this.settings.height;

        //console.log(container.id)
        // Allocate the new Element 
        this.settings.DOMelement = container

		    canvas 		    = container.appendChild(document.createElement("canvas"));
		    canvas.id 	  = "canvas";
		    canvas.width  = this.settings.width; // TOFIX
		    canvas.height = this.settings.height;
        canvas.style.position = "absolute"

        //console.log(this.settings.width,this.settings.height)
        this.ctx = canvas.getContext("2d");  

       // Construct the Chart
       this.chart[this.settings.chart.type](self,'init')


       // Draw d3
       //if(typeof(this.settings.options.debugaggregate)=="undefined"){
       // this.aggregate.init(self);
       //}

       // Initiatlise stream 
       this.stream.init(self)

       // Initiatlise decay
       this.flocculate.init(self)

       // Update stream 
       this.stream.update(self);

       // Initiatlise tokens 
       this.token.init(self)

       //FORCE UPDATE CHART due to  (bug positionnement ) @rom1
      this.strata.init(this)

   		 // Update the physical simulation 
  		 this.phy.loops = window.setInterval(
              function(){self.update(self);},
               self.settings.options.refresh/2
              );

       // Refresh canvas drawings 
       this.draw.loops = window.setInterval(
              function(){self.draw.update(self);},
              self.settings.options.refresh
              );

       // Update Decay 
       this.decay.loops = window.setInterval(
              function(){self.decay.update(self);},
              self.settings.sedimentation.suspension.refresh
       );
       //this.decay.update(self);

      self.strata.update(self);

// MOUSE HANDLING BY @RaphV

    (function(vs) {
        var bodiesAtMouse = [],
            previousBodiesAtMouse = [],
            throttleTime = 0,
            throttleTimeout,
            pageX, pageY;
        
        function mousemove(e) {
            pageX = e.pageX;
            pageY = e.pageY;
            listBodiesAtMouse();
        }
        
        function listBodiesAtMouse() {
            
            if (Date.now() - throttleTime < 150) {
                clearTimeout(throttleTimeout);
                throttleTimeout = setTimeout(listBodiesAtMouse, 150);
                return;
            }
            throttleTime = Date.now();
            
            previousBodiesAtMouse = bodiesAtMouse;
            bodiesAtMouse = [];
            
            var jqCanvas = $(vs.settings.DOMelement)
                canvasOffset = jqCanvas.offset(),
                mouseX = pageX - canvasOffset.left,
                mouseY = pageY - canvasOffset.top,
                canvasH = jqCanvas.height(),
                canvasW = jqCanvas.width();
                
            if (mouseX >= 0 && mouseY >= 0 && mouseX <= canvasW && mouseY <= canvasH) {
            
                var worldX = mouseX / vs.settings.options.scale,
                    worldY = mouseY / vs.settings.options.scale,
                    mousePVec = new vs.phy.b2Vec2(worldX,worldY),
                    aabb = new vs.phy.b2AABB(),
                    radius = .001;
    
                aabb.lowerBound.Set(worldX - radius, worldY - radius);
                aabb.upperBound.Set(worldX + radius, worldY + radius);
                
                vs.world.QueryAABB(function(fixture) {
                    if (fixture.GetShape().TestPoint(fixture.GetBody().GetTransform(), mousePVec)) {
                        bodiesAtMouse.push(fixture);
                        if (previousBodiesAtMouse.indexOf(fixture) === -1) {
                            var u = fixture.GetUserData();
                            if (u && u.callback && u.callback.mouseover) {
                                u.callback.mouseover(vs.select("ID", u.ID));
                            }
                        }
                    }
                    return true;
                }, aabb);
            
            }
            
            previousBodiesAtMouse.forEach(function(fixture) {
                if (bodiesAtMouse.indexOf(fixture) === -1) {
                    var u = fixture.GetUserData();
                    if (u && u.callback && u.callback.mouseout) {
                        u.callback.mouseout(vs.select("ID", u.ID));
                    }
                }
            });
            
        }
        
        function click() {
            bodiesAtMouse.forEach(function(fixture) {
                var u = fixture.GetUserData();
                if (u && u.callback && u.callback.onclick) {
                    u.callback.onclick(vs.select("ID", u.ID));
                }
            });
        }
        
        $(document).mousemove(mousemove);
        $(document).click(click);
        
    })(self);
 
// END OF MOUSE HANDLING
 
   };
    
    this.update = function (s) {
     	this.world.Step(1 / 30, 10, 10);
     	//this.world.DrawDebugData();
     	this.world.ClearForces();
     }

    var drawInit = function(){ 		  
      ctx.fillStyle = "rgb(200,0,0)";  
 		  this.ctx.font = "14pt Calibri,Geneva,Arial";
      this.ctx.fillText("Canvas ready for Visual Sedimentation ", 10, 20);
		  window.setInterval(
			   $.fn.vs.draw.refresh(ctx,world,this.settings)
			   , this.settings.options.refresh);
		 console.log("draw Init ")
     }


     var DOMabsOffset = function(target){
        var top = target.offsetTop;
        var left = target.offsetLeft;
         
        while(target = target.offsetParent) {
          top += target.offsetTop;
          left += target.offsetLeft;
        }
         
        return {offsetLeft:left, offsetTop:top};
      };

    // GUID generator from : 
    // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
    var GUID = function(){
        var S4 = function ()
        {
            return Math.floor(
                    Math.random() * 0x10000 /* 65536 */
                ).toString(16);
        };
    
        return (
                S4() + S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + S4() + S4()
            );
    }

    // Clone object 
    // http://stackoverflow.com/questions/728360/copying-an-object-in-javascript
    function clone(obj) {
      if (null == obj || "object" != typeof obj) return obj;
      var copy = obj.constructor();
      for (var attr in obj) {
          if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
      }
      return copy;
    }
    this.utile       = {}
    this.utile.GUID  = GUID
    this.utile.clone = clone

    this.settings = $.extend(this.settings, {} || {});
    //console.log("ici",this.settings)
    this.init();
     
 };

$.fn.vs  = function(options){
  if (!arguments.length){var options={}}
  //console.log('$.fn.vs settings',options)
     return this.each(function(){
         var element = $(this);
         // Return early if this element already has a plugin instance
         if (element.data('VisualSedimentation')) return;
         var visualSedimentation = new VisualSedimentation(this,options);
         // Store plugin object in this element's data
         element.data('visualSedimentation', visualSedimentation);
         //visualSedimentation.test();
     });
 };

})(jQuery);



