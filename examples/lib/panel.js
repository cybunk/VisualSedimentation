
barChart.settings.draw={
  callback:{
    begin:function(_this){
      meter.tickStart();     
    },
    end:function(_this){
      meter.tick();
    }
  }
}

var meter = new FPSMeter(document.getElementById('fpsmeter')
                        ,{
                           graph:   1, // Whether to show history graph.
                           history: 20, // How many history states to show in a graph.
                           theme: 'light'
                         });



$(function() {
  // ----------------------------------------------------
  // CONTACT COUNTER

  // DEFINED LISTENER 
  barChart.numContacts = 0;
  var listener = new Box2D.Dynamics.b2ContactListener;
  listener.BeginContact = function(contact) {
    barChart.numContacts ++
  }
  listener.EndContact = function(contact) {
    barChart.numContacts --
  }
  listener.PostSolve = function(contact, impulse) {}
  listener.PreSolve  = function(contact, oldManifold) {}
  barChart.world.SetContactListener(listener);

  // SETUP A DIV TO SHOW CONTACT NUMBER 
  $("#report").prepend("<div id='contactmeters' style='left:90px;position:relative;display:block;' >"
    +"<div style='padding: 5px; min-width: 75px; height: 30px; line-height: 30px; text-align: right; text-shadow: rgba(255, 255, 255, 0.498039) 1px 1px 0px, rgba(255, 255, 255, 0.498039) -1px -1px 0px; color: rgb(102, 102, 102); background-color: rgb(255, 255, 255); box-shadow: rgba(0, 0, 0, 0.0980392) 0px 0px 0px 1px; position: absolute; z-index: 10; left: 5px; top: 5px; right: auto; bottom: auto; margin: 0px; cursor: pointer; background-position: initial initial; background-repeat: initial initial;'>"
    +"<div id='numContacts' style='position: absolute; top: 0px; right: 0px; padding: 5px 10px; height: 30px; font-size: 24px; font-family: Consolas, 'Andale Mono', monospace; z-index: 2;' >XXX</div>"
    +"<div style='position: absolute; top: 0px; left: 0px; padding: 5px 10px; height: 30px; font-size: 12px; line-height: 32px; font-family: sans-serif; text-align: left; z-index: 2;'>C/S</div>"
    +"</div>"
    +"</div>")
  var contactMeters = window.setInterval(
            function(){
              $("#numContacts").text(barChart.numContacts)
            },100);



  // ----------------------------------------------------
  // CLOCK
  barChart.clock = new Date();
  $("#report").prepend("<div id='clock' style='left:0px;position:relative;display:block;' >"
    +"<div style='padding: 5px; min-width: 75px; height: 30px; line-height: 30px; text-align: right; text-shadow: rgba(255, 255, 255, 0.498039) 1px 1px 0px, rgba(255, 255, 255, 0.498039) -1px -1px 0px; color: rgb(102, 102, 102); background-color: rgb(255, 255, 255); box-shadow: rgba(0, 0, 0, 0.0980392) 0px 0px 0px 1px; position: absolute; z-index: 10; left: 5px; top: 5px; right: auto; bottom: auto; margin: 0px; cursor: pointer; background-position: initial initial; background-repeat: initial initial;'>"
    +"<div id='numSeconds' style='position: absolute; top: 0px; right: 0px; padding: 5px 10px; height: 30px; font-size: 24px; font-family: Consolas, 'Andale Mono', monospace; z-index: 2;' >0</div>"
    +"<div style='position: absolute; top: 0px; left: 0px; padding: 5px 10px; height: 30px; font-size: 12px; line-height: 32px; font-family: sans-serif; text-align: left; z-index: 2;'>Time</div>"
    +"</div>"
    +"</div>")

  var contactMeters = window.setInterval(
            function(){
              var d=new Date();
              var now = Math.round((d.getTime()-barChart.clock.getTime())/1000)
              $("#numSeconds").text(now)
              if(now>=60){
                console.log(
                             $("#slider_TokensSeconds_m").text(),";"
                            ,$("#slider_Decay_m").text(),";"
                            ,$("#numContacts").text(),";"
                            ,$("#fpsmeter").text(),";"
                            ,$("#numSeconds").text(),";"
                            )
              }
            },1000);



  // ----------------------------------------------------
  // DEFINE PARAMETER PRESENT IN THE PANEL  
  var controlpanel = {
    targetId:"panel",
    title:"&nbsp;",
    control:[
              {
                id:   "slider_TokensSeconds",
                label:"Incomming rate",
                unit: "token by seconds",
                type:"slider",
                min: 1,
                max: 105,
                setup:function(id){
                  // return the actual token rate
                  var value = barChart.stream.getSpeed()/1000*3
                  return value
                },
                update:function(event,ui,self,i){
                  barChart.stream.setSpeed(barChart,1000/(ui.value/3))
                }
              },
              {
                id:"slider_GravityForces",
                label:"Vertical gravity forces",
                unit:"metters by seconds",
                type:"slider",
                setup:function(){
                  return barChart.settings.sedimentation.world.gravity.y
                },
                update:function(event,ui){
                   var g = barChart.settings.sedimentation.world.gravity.y = ui.value
                   var gravity  = new barChart.phy.b2Vec2(barChart.settings.sedimentation.world.x, g);
                  barChart.world.m_gravity   = gravity;
                }
              },
              {
                id:"slider_Decay",
                label:"Decay Forces",
                type:"slider",
                unit:"",
                min:1,
                max:1.8,
                step:0.01,
                setup:function(){
                    return barChart.settings.sedimentation.suspension.decay.power 
                },
                update:function(event,ui,self){
                  barChart.settings.sedimentation.suspension.decay.power= ui.value
                }
              },
              {
                id:"slider_Flocullation",
                label:"Flocullation threshold",
                unit:"Size in pixel",
                type:"slider",
                min:0,
                max:5,
                step:0.1,
                setup:function(){
                  return  barChart.settings.sedimentation.token.size.minimum
                  //return barChart.settings.stream.refresh/1000*barChart.settings.data.model.length
                },
                update:function(event,ui,self){
                    barChart.settings.sedimentation.token.size.minimum = ui.value
                },
              },
              {
                id:"slider_Stratas_threshold",
                label:"Stratas update threshold",
                unit:"number of token",
                type:"slider",
                min:0,
                max:50,
                step:1,
                setup:function(){
                  return  barChart.settings.sedimentation.flocculate.bufferSize
                  //return barChart.settings.stream.refresh/1000*barChart.settings.data.model.length
                },
                update:function(event,ui,self){
                    barChart.settings.sedimentation.flocculate.bufferSize= ui.value
                },
              },
              {
                id:   "checkbox_stratas_update",
                label: "Update stratas: ",
                type:"button", 
                setup:function(){
                  return  barChart.settings.sedimentation.aggregation.strataUpdate
                },
                update:function(self){
                    if(barChart.settings.sedimentation.aggregation.strataUpdate==true){
                      barChart.settings.sedimentation.aggregation.strataUpdate = false
                    }else{
                      barChart.settings.sedimentation.aggregation.strataUpdate = true
                    }
                    $( "#"+myObject.id).text(barChart.settings.sedimentation.aggregation.strataUpdate)
                },       
              }
    ],
    result:{
      title:"Results",
      repport:[
                {
                  id:"r_fps",
                  label:"Frame by seconds :",
                  update:function(){}
                },
                {
                  id:"r_collision",
                  label:"Total collisions",
                  update:function(){}
                },
                {
                  id:"r_objSeconds",
                  label:"Total collisions",
                  update:function(){}
                }
              ]
    }
  }

  // DRAW INTERFACE 
  $("#"+controlpanel.targetId).append("<h2>"+controlpanel.title+"</h2>")


  // COMMAND common configuration 
  var contolObject = []
  function controlConfiguration(myObject,i){

    var initValue    = myObject.setup()

    if(myObject.type=="slider"){

      // CReate html 
      $("#"+controlpanel.targetId).append(
      "<div style='padding-top:10px;'>"
      +myObject.label
      +" "
      +"<div><span id='"+myObject.id+"_m' style='align:left'>"
      +0
      +"</span>&nbsp;"
      +myObject.unit
      +"</div>"
      +"</div>"
      +"<div style='padding:5px;'>"
      +"<div id='"+myObject.id+"' ></div>"
      +"</div>")

      // update text
      $("#"+myObject.id+"_m").text(initValue)

      // configure controle 
      if(typeof(myObject.min)=="undefined")myObject.min=0
      if(typeof(myObject.max)=="undefined")myObject.max=100
      if(typeof(myObject.step)=="undefined")myObject.step=1
      contolObject[i] = {
                            value: initValue,
                            min:  myObject.min,
                            max:  myObject.max,
                            step: myObject.step,
                            slide: function (event, ui){
                              $("#"+myObject.id+"_m").text(ui.value)
                              return myObject.update(event,ui,myObject)
                            }
                          }
      // create controle
      $( "#"+myObject.id).slider(contolObject[i]);

    }else{

      $("#"+controlpanel.targetId).append(
        "<div style='padding-top:10px;'>"
      +myObject.label
      +" "
      +"<div id='"+myObject.id+"' ></div>"
      +"</div>")


      $( "#"+myObject.id).button();
      $( "#"+myObject.id).text(initValue)
      $( "#"+myObject.id).bind('click',function() {
        myObject.update(myObject)
      });
    }
  }
  

  // Draw interface (slider + text)
  for (var i =0; i < controlpanel.control.length; i++) {
    var myObject = controlpanel.control[i]
    controlConfiguration(myObject,i,controlpanel)
  };



});