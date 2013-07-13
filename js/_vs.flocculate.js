(function ($) {
//console.log("flocullate loaded")
$.fn._vs.flocculate = {

    buffer:[], 

    init:function(_this){
      for (var i =0; i<_this.settings.data.model.length; i++) {
        this.buffer[i] = []
      };
    },


    destroyIt:function(_this,token){
      token.attr("callback","flocculation",token) // callback 
      token.attr("state",2)                       // flocullating state
      

      if(typeof(_this.settings.sedimentation.aggregation.type)!="undefined"){
        if(_this.settings.sedimentation.aggregation.type=="pixel"){
          //var del = _this.world.DestroyBody(token.myobj.GetBody());
          //Box2D.Dynamics.b2Body.b2_dynamicBody
          var body = token.myobj.GetBody()
          body.SetType(Box2D.Dynamics.b2Body.b2_staticBody)
          body.SetAwake(false)
          body.SetLinearDamping(true)
          body.SetLinearVelocity(true)
          //console.log(body.GetType())
          //body.SetActive(false)
          if(typeof( _this.settings.sedimentation.token.callback)!="undefined"){
              if(typeof( _this.settings.sedimentation.token.callback.pixelFlocculation)=="function"){
                    _this.settings.sedimentation.token.callback.pixelFlocculation(_this,token)  
              }
          }

          //console.log(token)
        }else{
          var del = _this.world.DestroyBody(token.myobj.GetBody()); 
        }
      }else{
        var del = _this.world.DestroyBody(token.myobj.GetBody());
      }
      return del
    },

    update:function(_this,c,nbtokens) {
      if(_this.settings.sedimentation.flocculate.number==1){
       while(this.buffer[c].length > nbtokens) {
         var token = this.buffer[c].shift();
         this.destroyIt(_this,token)
       }
      }else if (this.buffer[c].length>_this.settings.sedimentation.flocculate.bufferSize) {
        while(this.buffer[c].length > _this.settings.sedimentation.flocculate.bufferSize) {
           var token = this.buffer[c].shift();
           this.destroyIt(_this,token)
        }
      }

    },

    disapear:function(_this,token){
      ///draft doesn't work
       window.setInterval(
        function(){token.update(self);},
         self.settings.options.refresh/2
        );
    },

    all:function(_this) {
      // TODO destroy all 
      //console.log(_this.settings.data)
      for (var i = _this.decay.tokens - 1; i >= 0; i--) {
        //console.log(_this.decay.tokens)
        this.update(_this,i,_this.tokens.length);      
      };
    },

    strategy:function(){
       if(flocullateBuffer.length>0){
         if (chart.flocullate.strategy=="Size" 
           && flocullateBuffer.length>=chart.flocullate.bufferSize){
           //console.log(flocullateBuffer.length);
           flocullateByArray(flocullateBuffer);

         }else if (chart.flocullate.strategy=="Time") {
  
         }else if (chart.flocullate.strategy=="Height") {
  
         };  
    }

}}    



})(jQuery);
