(function ($) {
  
$.fn._vs.draw = {

    settings:{
              draw:{
                trail:1,
                showLayout:false
              }
    },

    update:function(_this){
      //console.log(_this.ctx)

      // DRAW BEFORE CLEAR Callback  
      if(typeof(_this.settings.draw.callback.beforeClear)!="undefined"){
          if(typeof(_this.settings.draw.callback.beforeClear)=="function"){
                _this.settings.draw.callback.beforeClear(_this)  
          }
      }

      /* refresh rate and debug mode of canvas (show trail) */
      if(typeof(_this.settings.draw.trail)!="undefined" && _this.settings.draw.trail!=0) {
        //_this.ctx.clearRect(0, 0, _this.ctx.canvas.clientWidth, _this.ctx.canvas.clientHeight);
        _this.ctx.rect(0, 0, _this.ctx.canvas.clientWidth, _this.ctx.canvas.clientHeight);
        _this.ctx.fillStyle = "rgba(255,255,255,"+_this.settings.draw.trail+")";
        _this.ctx.fill();
      }else{
        _this.ctx.clearRect(0, 0, _this.ctx.canvas.clientWidth, _this.ctx.canvas.clientHeight);
      }/*
      else{
        debugDrawChart(0,
            0,
            ctx.canvas.clientWidth,
            ctx.canvas.clientHeight,
            "rgba(255,255,255,"+this.settings.draw.trail+")",
            ctx);
      }*/

      // DRAW START Callback  
      if(typeof(_this.settings.draw.callback.begin)!="undefined"){
          if(typeof(_this.settings.draw.callback.begin)=="function"){
                _this.settings.draw.callback.begin(_this)  
          }
      }


      /* Draw body(s) from box2d */
      for( var b = _this.world.GetBodyList() ; b ; b = b.GetNext()) {
        for (var s = b.GetFixtureList(); s != null; s = s.GetNext()) {
          // DRAW ON DEFAULT CANVAS 
          this.drawShape(_this,_this.ctx,s);
          // CALLBACK DRAW BODY 
          if(typeof(_this.settings.draw.callback.drawBody)!="undefined"){
            if(typeof(_this.settings.draw.callback.drawBody)=="function"){
              _this.settings.draw.callback.drawBody(_this,this,s)  
            }
          }
        }
      }
    
      /* Show wireframe mode */
      if(this.settings.draw.showLayout==true){
        this.debugDrawChart(chart.position.x,
                chart.position.y,
                chart.position.width,
                chart.position.height,
                "rgba(255,0,0,0.2)",
                ctx);
      }

      // DRAW END Callback  
      if(typeof(_this.settings.draw.callback.end)!="undefined"){
          if(typeof(_this.settings.draw.callback.end)=="function"){
                _this.settings.draw.callback.end(_this)  
          }
      }

    },
    debugDrawChart :function (x,y,w,h,color,ctx) {
      ctx.save();  
      ctx.translate(0,0);  
      ctx.fillStyle = color;  
      ctx.beginPath();
      ctx.rect(x,y,w,h);      
      ctx.closePath();
      ctx.strokeStyle ="#000"
      ctx.lineWidth = 0.5;
      ctx.stroke();
      ctx.restore();  
    },
    showTexture:function( s, ctx ){
      if (typeof(s.m_userData.texture) !== "undefined" && typeof(s.m_userData.texture.pattern) !== "undefined") {
          ctx.fillStyle = s.m_userData.texture.pattern;
          ctx.fill();
      }
    },
    
    drawShape: function (_this,ctx,s,options) {
    var b           = s.GetBody();
    var position    = b.GetPosition();
    var angle       = b.GetAngle();
    var radiusCoef  = 9;
    var radiusCoefMax=10
    var scale       = _this.settings.options.scale

    // add x and y to userData
    s.m_userData.x  = b.GetWorldCenter().x*scale
    s.m_userData.y  = b.GetWorldCenter().y*scale



    if(typeof(s)!="undefined"){
    switch (s.GetType()){
      case 0:  // round

        switch (s.m_userData){
          case null:
            ctx.fillStyle = "rgba(255,0,0,1)";  
          break;
          default:
            ctx.fillStyle = s.m_userData.fillStyle;

            // Code a supprimer 
            if(typeof(options)!="undefined"){
              if(typeof(options.pourcent)!="undefined"){ 
                var tcolor =  s.m_userData.fillStyle;
                ctx.fillStyle = one.color(tcolor).alpha(.1).cssa();
              }
            };
            // fin de code a supprimer

          break
        }

        var radius = s.m_shape.m_radius

        // round token 
        if(_this.settings.sedimentation.token.visible==true){
          ctx.save();  
          ctx.translate(position.x*scale, position.y*scale);  
          ctx.rotate(angle);  
          ctx.beginPath();
          var h = (radius/radiusCoefMax*radiusCoef)*scale
          
          //console.log(s.m_userData.strokeStyle)
          if(typeof(s.m_userData.strokeStyle)!="undefined"){
            ctx.strokeStyle = s.m_userData.strokeStyle
          } else{ 
            ctx.strokeStyle = "rgba(0,0,0,0)"
          }

          if(typeof(s.m_userData.lineWidth)!="undefined"){
            ctx.lineWidth   = s.m_userData.lineWidth 
          } else { 
            ctx.lineWidth = 0
          }
          
          // ADD FOR TRAIL 
          if(typeof(options)!="undefined"){
              if(typeof(options.pourcent)!="undefined"){ 
               ctx.lineWidth = 0
               ctx.strokeStyle = "rgba(0,0,0,0)"
          }}

          ctx.arc(0, 0,h, 0, Math.PI*2, true); 

          ctx.closePath();

          if(_this.settings.options.layout==true){
            ctx.strokeStyle = "#000"
            ctx.lineWidth   = 0.5
            ctx.stroke();
          }else{
            ctx.fill();
            ctx.stroke();
            this.showTexture(s, _this.ctx);
          }
          ctx.restore();
        }


      break
      case 1: // vertice (polygon and squares ...)
        switch (s.m_userData){
          case null:
            ctx.fillStyle = "rgba(255,0,0,1)";  
          break;
          default:
            ctx.fillStyle = s.m_userData.fillStyle;  
          break
        }

        var width = s.m_shape.m_vertices[0].x*scale
        var height = s.m_shape.m_vertices[0].y*scale
        var posx = position.x*scale-s.m_shape.m_vertices[0].x*scale
        var posy = position.y*scale-s.m_shape.m_vertices[0].y*scale
        
        ctx.save();
        ctx.translate(position.x*scale, position.y*scale); 
        ctx.rotate(angle);
        ctx.beginPath();

        //if(s.m_userData.ID==1 ){ console.log(s.m_userData.lineWidth) }
        //if(typeof(s.m_userData.fillStyle)!="undefined")   _this.ctx.fillStyle   = s.m_userData.fillStyle
        if(typeof(s.m_userData.strokeStyle)!="undefined"){ 
          ctx.strokeStyle = s.m_userData.strokeStyle
        } else{   ctx.strokeStyle = s.m_userData.fillStyle}

        if(typeof(s.m_userData.lineWidth)!="undefined"){  
          ctx.lineWidth   = s.m_userData.lineWidth 
        } else{   ctx.lineWidth = 0}

        for (var i = 0; i < s.m_shape.m_vertices.length; i++) {
          var points = s.m_shape.m_vertices;
          //var this = {x:0,y:0}
          ctx.moveTo(( points[0].x) * scale, (points[0].y) * scale);
          for (var j = 1; j < points.length; j++) {
             ctx.lineTo((points[j].x ) * scale, (points[j].y ) * scale);
          }
          ctx.lineTo(( points[0].x) * scale, ( points[0].y) * scale);
        }
        ctx.closePath();
        
        
        ctx.fill();
        
        this.showTexture(s, _this.ctx);

        // pour le debug mode
        if(_this.settings.options.layout==true){
          ctx.lineWidth   = .25;
          ctx.strokeStyle ="rgb(0,0,0)"
          ctx.stroke();

          // incomming points Drawer
          //for (var i = _this.settings.sedimentation.incoming.point.length - 1; i >= 0; i--) {
            //
            //_this.settings.sedimentation.incoming.point[i].y
            // draw green 
            //_this.ctx.font = '40px Arial';
            //_this.ctx.fillText("x", _this.settings.sedimentation.incoming.point[i].x, _this.settings.sedimentation.incoming.point[i].y);
            //_this.ctx.fillStyle = "rgb(0,250,0,0.5)";  

          //};

        }else{
          ctx.stroke();
        }
        ctx.restore();

      break;
      case 2:
  
      break;
      ctx.fillStyle = "rgb(0,0,0)";  
    }
   }
    // TOKEN CALL BACK DRAW
    if(typeof(s.m_userData.callback)!="undefined"){
        if(typeof(s.m_userData.callback.draw)=="function"){
               var t = _this.select('ID',s.m_userData.ID)
               s.m_userData.callback.draw(t)  
        }
    }
  }
}

})(jQuery);
