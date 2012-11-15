/**
 *
 * pieChart V.0.3
 * by Sam Saccone -- sam@samx.it
 *
 **/

!(function() {
  if(window.pieChart) {
    alert("window.pieChart namespace already in use");
  } else {
    window.pieChart = function(options) {

      var pixelDensity = window.devicePixelRatio || 1; //grab the pixel density for retina goodness :)
      var elm = document.createElement('canvas'),
        ctx = elm.getContext('2d'),
        radius = (options.radius * pixelDensity) || (100 * pixelDensity),
        //set some defaults
        lineWidth = (pixelDensity * options.stroke) || (20 * pixelDensity),
        // defaults
        startAngle = 0 * Math.PI / 180,
        endAngle = 360 * Math.PI / 180,
        registration = radius + lineWidth / 2
        fillEndAngle = ((options.fillPercent / 100 * 360) - 90) * Math.PI / 180,
        complete = options.fillPercent >= 100,
        //make check to make sure if it is over 100% and handle it
        antiAliaisingClippingConts = 1,
        drawOptions = {
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
          animationTick: (options.animationTick ||
          function() {}),
          strokeStyle: options.backgroundStrokeColor || "#000",
          antiAlias: options.antiAlias || false
        };

      /**
       * sets the canvas element so that it will fit the desired circle
       **/
      elm.setAttribute('width', registration * 2 + antiAliaisingClippingConts + "px");
      elm.setAttribute('height', registration * 2 + antiAliaisingClippingConts + "px");

      /**
       * enable some retina goodness
       **/
      elm.style.width = elm.width / pixelDensity + "px";
      elm.style.height = elm.width / pixelDensity + "px";

      drawArc(drawOptions); // draws the background
      /**
       * recalculate values for the fill stroke
       **/

      // drawOptions.startAngle = complete ? startAngle : 270 * Math.PI / 180;
      // drawOptions.endAngle = complete ? endAngle : fillEndAngle;
      // drawOptions.clockwise = 0;
      // drawOptions.strokeStyle = options.foregroundStrokeColor || "#CCC";
      // drawOptions.lineWidth = lineWidth + antiAliaisingClippingConts; // fix for ugly anti aliasing
      // drawOptions.registration = drawOptions.registration;

      // if(drawOptions.complete) {
      //   drawArc(drawOptions); // draws the filled %
      // } else !(function animatedFill(step, drawOptions) {
      //   var radianFillAngle = (step += drawOptions.animationRate) * Math.PI / 180;
      //   if(radianFillAngle < (drawOptions.complete ? drawOptions.endAngle : drawOptions.fillEndAngle)) {
      //     drawOptions.endAngle = radianFillAngle;
      //     requestAnimFrame(function() {
      //       animatedFill(step, drawOptions);
      //       drawOptions.animationTick(step); //calls the animationtick
      //       drawArc(drawOptions); // draws the filled %
      //     });
      //   }
      // })(-90, drawOptions);

      /**
       * helper function to do the drawing work
       **/

      function drawArc(args) {
        if(!args.antiAlias) {
          args.ctx.strokeStyle = args.strokeStyle;
          args.ctx.lineWidth = args.lineWidth;
          args.ctx.beginPath();
          args.ctx.arc(args.registration, args.registration, args.radius, args.startAngle, args.endAngle, args.clockwise);
          args.ctx.stroke();
          args.ctx.closePath();
        } else drawArcWithAntiAliasing(args);
      }

      function drawArcWithAntiAliasing(args) {
        // var color = new RGBColor(args.strokeStyle);
        // (x-h)^2 + (y-k)^2 = r^2

        // var pixels = args.ctx.createImageData(args.registration * 2 + 1, args.registration * 2 + 1);

        // var x = 0;
        // var y = 0;
        // var ys = [];
        // var h = args.registration;
        // var k = args.registration;
        // var r = args.radius;
        // var r2 = r * r;

        // console.log(x, y, h, k, r, r2)
//         for(; x < r; x++) {
//           y = Math.sqrt(Math.abs(Math.pow(x - h,2) - r2)) + k;
// //          setPixel(pixels,{x: x, y: y},{r: 128, g: 128, b: 128, a: 128});
//         }

        // (x-h)^2 + (y-k)^2 = r^2

        // y = k + sqrt( r^2 - (x-h)^2 )
        // y = k - sqrt( r^2 - (x-h)^2 )


        var pixels = args.ctx.createImageData(201,201);
        var h = 100;
        var k = 100;
        var r = 100;
        var r2 = r * r;
        var x, y=0, t;



        var x = 0;
        var y = 0;
        var ty;

        for(; x <= y; x++) {
          ty = Math.sqrt(r2 - Math.pow(x, 2));

          y = Math.round(y);


          if(ty > y){
            a0 = Math.round((1- Math.abs(ty - y)) * 255)
            a1 = Math.round((1- Math.abs(ty - y - 1)) * 255)
            ay = y+1;
          }else{
            a0 = Math.round((1- Math.abs(ty - y)) * 255)
            a1 = Math.round((1- Math.abs(ty - y + 1)) * 255)
            ay = y-1;
          }

          setPixel(pixels,{x: x+h, y: y+k},{r: 0, g: 0, b: 0, a: a0});
          setPixel(pixels,{x: x+h, y: -y+k},{r: 0, g: 0, b: 0, a: a0});
          setPixel(pixels,{x: -x+h, y: y+k},{r: 0, g: 0, b: 0, a: a0});
          setPixel(pixels,{x: -x+h, y: -y+k},{r: 0, g: 0, b: 0, a: a0});
          setPixel(pixels,{x: y+k, y: x+h},{r: 0, g: 0, b: 0, a: a0});
          setPixel(pixels,{x: y+k, y: -x+h},{r: 0, g: 0, b: 0, a: a0});
          setPixel(pixels,{x: -y+k, y: x+h},{r: 0, g: 0, b: 0, a: a0});
          setPixel(pixels,{x: -y+k, y: -x+h},{r: 0, g: 0, b: 0, a: a0});
          y = ay;
          setPixel(pixels,{x: x+h, y: y+k},{r: 0, g: 0, b: 0, a: a1});
          setPixel(pixels,{x: x+h, y: -y+k},{r: 0, g: 0, b: 0, a: a1});
          setPixel(pixels,{x: -x+h, y: y+k},{r: 0, g: 0, b: 0, a: a1});
          setPixel(pixels,{x: -x+h, y: -y+k},{r: 0, g: 0, b: 0, a: a1});
          setPixel(pixels,{x: y+k, y: x+h},{r: 0, g: 0, b: 0, a: a1});
          setPixel(pixels,{x: y+k, y: -x+h},{r: 0, g: 0, b: 0, a: a1});
          setPixel(pixels,{x: -y+k, y: x+h},{r: 0, g: 0, b: 0, a: a1});
          setPixel(pixels,{x: -y+k, y: -x+h},{r: 0, g: 0, b: 0, a: a1});

          y = Math.round(ty)
        }

        args.ctx.putImageData(pixels,0,0);

      }

      function setPixel(pixels, point, color) {
        pixels.data[point.x * 4 + pixels.width * point.y * 4 + 0] = color.r;
        pixels.data[point.x * 4 + pixels.width * point.y * 4 + 1] = color.g;
        pixels.data[point.x * 4 + pixels.width * point.y * 4 + 2] = color.b;
        pixels.data[point.x * 4 + pixels.width * point.y * 4 + 3] = color.a;
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
window.requestAnimFrame = (function() {
  return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
  function(callback) {
    window.setTimeout(callback, 1000 / 60);
  };
})();