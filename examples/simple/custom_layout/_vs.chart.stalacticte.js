(function ($) {

$.fn._vs.chart.stalacticte = function(_this,fn,options) {

  this.init = function (_this){
    console.log("Init my Custom Trail Chart ")
    // Define the gravity (here 0)
    _this.world.m_gravity   = new _this.phy.b2Vec2(0, 0);
    // Save the physical layout setup 
    _this.chartPhySetup     = {grounds:[],wall:[]}
    // Setup the layout 
    this.setupChartPhysics(_this);
  };
  
  this.setupChartPhysics = function(_this){

    // Here you could setup :
    // - the incomming point 
    // - alle physical element like grounds 
     _this.settings.sedimentation.incoming.impulse =[]
    var colSize       = (_this.settings.chart.width/_this.settings.data.model.length)    
    for( var i = 0 ; i<_this.settings.data.model.length+1 ; i++) {
        
        var colXpos   = _this.settings.chart.x+(i*colSize);

        // Define incomming points for tokens 
        if(i<_this.settings.data.model.length){

          var myX = (i*150)+(_this.settings.x+_this.settings.width/2-(450/2))
          var myY = 500

          _this.settings.sedimentation.incoming.point[i]={
                                                    x:myX,
                                                    y:0
                                                    }
          _this.settings.sedimentation.incoming.target[i]={
                                                    x:myX,
                                                    y:myY
                                                    }                                                    
        }
        
    }
  };

  // Token feature creation call for this chart you could modify it  
  this.token = function (_this,options){
    var i = options;
    var impulse =[
                  {
                    angle:0,
                    power:0.2
                  },
                  {
                    angle:0,
                    power:0.2
                  },
                  {
                    angle:0,
                    power:0.2
                  }
                ]
    var token = {
              x:(_this.settings.sedimentation.incoming.point[i].x+(Math.random()*2)),
              y:(_this.settings.sedimentation.incoming.point[i].y+(Math.random()*1)),
              size:_this.settings.sedimentation.token.size.original,
              category:i,
              strokeStyle:"#fff",
              lineWidth:1,  
              size:50,
              targets:[{
                  //  bizare x/2 or x ...
                  x: _this.settings.sedimentation.incoming.target[i].x,
                  y: _this.settings.sedimentation.incoming.target[i].y,
                  dampingRatio:100,
                  maxForce:1
              }],
              impulse:{
                  //  bizare x/2 or x ...
                  angle: impulse[i].angle,
                  power: impulse[i].power
              },
              phy:{
                density:1
              }
            }
    return token; 
  }

 if (typeof(fn)!=undefined){
    var result = this[fn](_this,options);  
    if (typeof(result)!=undefined){
      return result
    }
  }

}

})(jQuery);
