(function ($) {

$.fn._vs.decay = {
    tokens:[],
    bufferSize:0,

    update:function(_this) {
      var incrementationStrate = 1;
      var top                  = _this.settings.sedimentation.suspension.height
      var height               = _this.settings.height
      var intervalStrate       = _this.settings.sedimentation.token.size/4
      var power                = _this.settings.sedimentation.suspension.decay.power
      var scale                = _this.settings.options.scale
      var limit                = _this.settings.sedimentation.token.size.minimum
      var bufferSize           = _this.settings.sedimentation.flocculate.bufferSize

      if(power==null){var power = 0}
        var strataUpdate  = false
        for(var b = 0; b < this.tokens.length; b++) {
          var tokenSize     = this.tokens[b].attr("size")
          if(power!=0){
            this.tokens[b].attr("size",tokenSize/power)
          }

        // Flocculate     
        if(tokenSize<=limit){
          if (_this.settings.sedimentation.flocculate.strategy!=null){ 
              _this.flocculate.destroyIt(_this,this.tokens[b]);
              strataUpdate = true
              this.bufferSize++
            }
          }
        }

        // Update if needed
        if(strataUpdate){
          if(_this.settings.sedimentation.aggregation.strataUpdate){
            //console.log(bufferSize,this.bufferSize)
            if(bufferSize<=this.bufferSize){
              _this.strata.update(_this);
              this.bufferSize=0;
            }
          }
        }
  }
}

})(jQuery);
