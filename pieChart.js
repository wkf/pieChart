/**
*
* pieChart V.0.3
* by Sam Saccone -- sam@samx.it
*
**/

!(function() {
  if (window.pieChart) {
    alert("window.pieChart namespace already in use");
  } else {
    window.pieChart = function(options) {

      var pixelDensity  = window.devicePixelRatio || 1; //grab the pixel density for retina goodness :)

      var elm                         = document.createElement('canvas'),
          ctx                         = elm.getContext('2d'),
          radius                      = (options.radius * pixelDensity) || (100 * pixelDensity), //set some defaults
          lineWidth                   = (pixelDensity * options.stroke) || (20 * pixelDensity), // defaults
          startAngle                  = 0 * Math.PI/180,
          endAngle                    = 360 * Math.PI/180,
          registration                = radius + lineWidth/2
          fillEndAngle                = ((options.fillPercent / 100 * 360) - 90) * Math.PI/180,
          complete                    = options.fillPercent >= 100, //make check to make sure if it is over 100% and handle it
          antiAliaisingClippingConts  = 1,
          drawOptions                 = {
                            complete: complete,
                            endAngle: endAngle,
                            fillEndAngle: fillEndAngle,
                            ctx: ctx,
                            registration: registration,
                            animationRate: (options.animationRate || 1),
                            radius: radius,
                            startAngle: startAngle,
                            endAngle: endAngle,
                            lineWidth: lineWidth,
                            clockwise: 1,
                            animationTick: (options.animationTick || function(){}),
                            strokeStyle: options.backgroundStrokeColor || "#000"
                          };

      /**
      * sets the canvas element so that it will fit the desired circle
      **/
      elm.setAttribute('width', registration * 2 + antiAliaisingClippingConts + "px");
      elm.setAttribute('height',registration * 2+ antiAliaisingClippingConts + "px");

      /**
      * enable some retina goodness
      **/
      elm.style.width  =  elm.width/pixelDensity + "px";
      elm.style.height =  elm.width/pixelDensity + "px";

      drawArc(drawOptions); // draws the background

      /**
      * recalculate values for the fill stroke
      **/

      drawOptions.startAngle  = complete ? startAngle : 270 * Math.PI/180;
      drawOptions.endAngle    = complete ? endAngle : fillEndAngle;
      drawOptions.clockwise   = 0;
      drawOptions.strokeStyle = options.foregroundStrokeColor || "#CCC";
      drawOptions.lineWidth   = lineWidth + antiAliaisingClippingConts; // fix for ugly anti aliasing
      drawOptions.registration= drawOptions.registration;

      if (drawOptions.complete) {
        drawArc(drawOptions); // draws the filled %
      } else !(function animatedFill(step, drawOptions) {
        var radianFillAngle = (step += drawOptions.animationRate) * Math.PI/180;
        if (radianFillAngle < (drawOptions.complete ? drawOptions.endAngle : drawOptions.fillEndAngle)) {
          drawOptions.endAngle = radianFillAngle;
          requestAnimFrame(function() {
            animatedFill(step, drawOptions);
            drawOptions.animationTick(step); //calls the animationtick
            drawArc(drawOptions); // draws the filled %
          });
        }
      })(-90, drawOptions);

      /**
      * helper function to do the drawing work
      **/
      function drawArc(args) {
        args.ctx.strokeStyle  = args.strokeStyle;
        args.ctx.lineWidth    = args.lineWidth || 1;
        args.ctx.beginPath();
        args.ctx.arc(args.registration, args.registration, args.radius, args.startAngle, args.endAngle, args.clockwise);
        args.ctx.stroke();
        args.ctx.closePath();
      }

      if(options.container && options.container.appendChild) { //if a container elm was passed then add it to it
        options.container.appendChild(elm);
      } else {
        document.body.appendChild(elm);
      }
      return elm;
    }
  }
})();


// shim layer with setTimeout fallback
// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();