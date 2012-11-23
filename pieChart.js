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

      function ZdrawArcWithAntiAliasing(args) {
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


        var ps = [
          [[0,-100,0,-100,255,255]],
          [],
          [],
          [[100,0,100,0,255,255]],
          [],
          [],
          [[0,100,0,100,255,255]],
          [],
          [],
          [[-100,0,-100,0,255,255]],
          [],
          []
        ];
        ls = {};
        ls[-100] = 0;
        ls[0] = 100,
        ls[100] = 0;

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

          ls[x] = ls[x] || y;
          ls[y] = ls[y] || x;
          ls[-x] = ls[-x] || y;
          ls[-y] = ls[-y] || x;

          ps[1].push([x,-y,x,-ay,a0,a1])
          ps[2].unshift([y,-x,ay,-x,a0,a1])
          ps[4].push([y,x,ay,x,a0,a1])
          ps[5].unshift([x,y,x,ay,a0,a1])
          ps[7].push([-x,y,-x,ay,a0,a1])
          ps[8].unshift([-y,x,-ay,x,a0,a1])
          ps[10].push([-y,-x,-ay,-x,a0,a1])
          ps[11].unshift([-x,-y,-x,-ay,a0,a1])

          // setPixel(pixels,{x: x+h, y: y+k},{r: 0, g: 0, b: 0, a: a0});      // 4 (3) 3 (2)
          // setPixel(pixels,{x: x+h, y: -y+k},{r: 0, g: 0, b: 0, a: a0});     // 1 (0)
          // setPixel(pixels,{x: -x+h, y: y+k},{r: 0, g: 0, b: 0, a: a0});     // 5 (4) 2 (1)
          // setPixel(pixels,{x: -x+h, y: -y+k},{r: 0, g: 0, b: 0, a: a0});    // 8 (7)
          // setPixel(pixels,{x: y+k, y: x+h},{r: 0, g: 0, b: 0, a: a0});      // 3 (2) 4 (3)
          // setPixel(pixels,{x: y+k, y: -x+h},{r: 0, g: 0, b: 0, a: a0});     // 2 (1)
          // setPixel(pixels,{x: -y+k, y: x+h},{r: 0, g: 0, b: 0, a: a0});     // 6 (5) 1 (0)
          // setPixel(pixels,{x: -y+k, y: -x+h},{r: 0, g: 0, b: 0, a: a0});    // 7 (6)
          // y = ay;
          // setPixel(pixels,{x: x+h, y: y+k},{r: 0, g: 0, b: 0, a: a1});
          // setPixel(pixels,{x: x+h, y: -y+k},{r: 0, g: 0, b: 0, a: a1});
          // setPixel(pixels,{x: -x+h, y: y+k},{r: 0, g: 0, b: 0, a: a1});
          // setPixel(pixels,{x: -x+h, y: -y+k},{r: 0, g: 0, b: 0, a: a1});
          // setPixel(pixels,{x: y+k, y: x+h},{r: 0, g: 0, b: 0, a: a1});
          // setPixel(pixels,{x: y+k, y: -x+h},{r: 0, g: 0, b: 0, a: a1});
          // setPixel(pixels,{x: -y+k, y: x+h},{r: 0, g: 0, b: 0, a: a1});
          // setPixel(pixels,{x: -y+k, y: -x+h},{r: 0, g: 0, b: 0, a: a1});

          y = Math.round(ty)
        }

        ps = [].concat.apply([],ps)

        var step = ps.length / 100;
        var times = step * 100;

        var i;
        for(i = 0; i<times; i++){

          //r = 0;
          // r = Math.floor(Math.random()*30)+1;
          // r = Math.round(Math.random()) ? r : -r;

          setPixel(pixels,{x:ps[i][0]+h,y:ps[i][1]+k},{r: 0, g: 0, b: 0, a: ps[i][4]});
          setPixel(pixels,{x:ps[i][2]+h,y:ps[i][3]+k},{r: 0, g: 0, b: 0, a: ps[i][5]});
        }

        var j;

        for( i = -100; i <= 100; i++) {
          for( j = -ls[i] + 1; j < ls[i]; j++ ) {
            setPixel(pixels,{x: i+h, y: j+k},{r:0,g:0,b:0,a:255});
          }
        }
        // for(i = 0; i<r*2; i++) {
        //   console.log(ls[i][0],ls[i][1]);
        // }

        // for(var i=0; i<ls.length; i++){
        //   y = ls[i][1];
        //   if(y != 0){
        //     for(var j=1; j< Math.abs(2*ls[i][1]); j++){
        //       setPixel(pixels,{x:ls[i][0]+h,y:y-j+k},{r:0,g:0,b:0,a:255});
        //     }
        //   }
        // }

        args.ctx.putImageData(pixels,0,0);

      }

      function drawArcWithAntiAliasing (args){
        var inner_radius = 90;
        var outer_radius = 100;
        var outer_circumference = 2 * Math.PI * outer_radius;
        var fill_percent = 40;
        var pixels = args.ctx.createImageData(201,201);

        var h = 100;
        var k = 100;

        var cos, sin, angle;

        var i;
        var j;
        var x;
        var y;
        var angle;

        var north_inner_xs = {};
        var south_inner_xs = {};
        var north_outer_xs = {};
        var south_outer_xs = {};
        var start_cap_xs = {}
        var end_cap_xs = {}

        for(j = outer_radius; j >= inner_radius; j--) {
          angle = -Math.PI / 2;
          x = Math.round(Math.cos(angle) * j);
          y = Math.round(Math.sin(angle) * j);
          setPixel(pixels, {x: x + h, y: y + k}, {r:0,g:0,b:0,a:255});
          angle = fill_percent / 100 * 2 * Math.PI - Math.PI / 2;
          x = Math.round(Math.cos(angle) * j);
          y = Math.round(Math.sin(angle) * j);
          end_cap_xs[x] = y;
          setPixel(pixels, {x: x + h, y: y + k}, {r:0,g:0,b:0,a:255});
        };
        for(i = 0; i <= outer_circumference * fill_percent / 100; i++) {
          angle = i / outer_circumference * 2 * Math.PI - Math.PI / 2;
          j = inner_radius;
          x = Math.round(Math.cos(angle) * j);
          y = Math.round(Math.sin(angle) * j);
          if(angle < 0 || angle > Math.PI) {
            north_inner_xs[x] = y > north_inner_xs[x] ? north_inner_xs[x] : y;
          } else {
            south_inner_xs[x] = y;
          };
          setPixel(pixels, {x: x + h, y: y + k}, {r:0,g:0,b:0,a:255});
          j = outer_radius;
          x = Math.round(Math.cos(angle) * j);
          y = Math.round(Math.sin(angle) * j);
          if(angle < 0 || angle > Math.PI) {
            north_outer_xs[x] = y;
          } else {
            south_outer_xs[x] = y;
          };
          setPixel(pixels, {x: x + h, y: y + k}, {r:0,g:0,b:0,a:255});
        }

        console.log(north_inner_xs)
        console.log(north_outer_xs)

        var i;
        var j;
        var iy;
        var oy;

        for(i = -100; i <= 100; i++) {
          x = i;
          iy = south_inner_xs[i];
          oy = south_outer_xs[i];
          if(iy && oy) {
            for( y = oy; y >= iy && y >= 0 ; y-- ) {
              setPixel(pixels,{x: x+h, y: y+k},{r:0,g:0,b:0,a:255});
            }
          } else if (oy && north_outer_xs[i]) {
            for( y = -oy; y <= oy; y++ ) {
              setPixel(pixels,{x: x+h, y: y+k},{r:0,g:0,b:0,a:255});
            }
          } else if (iy && end_cap_xs[i]) {
            for( y = iy; y <= end_cap_xs[i]; y++) {
              setPixel(pixels,{x: x+h, y: y+k},{r:0,g:0,b:0,a:255});
            }
          } else if (oy && end_cap_xs[i]) {
            for( y = oy; y >= end_cap_xs[i]; y-- ){
              setPixel(pixels,{x: x+h, y: y+k},{r:0,g:0,b:0,a:255});
            }
          }
        }

        for(i = -100; i <= 100; i++) {
          x = i;
          iy = north_inner_xs[i];
          oy = north_outer_xs[i];
          if(iy && oy) {
            for( y = oy; y <= iy && y <= 0 ; y++ ) {
              setPixel(pixels,{x: x+h, y: y+k},{r:0,g:0,b:0,a:255});
            }
          } else if (iy && end_cap_xs[i]) {
            for( y = iy; y >= end_cap_xs[i]; y-- ) {
              setPixel(pixels,{x: x+h, y: y+k},{r:0,g:0,b:0,a:255});
            }
          } else if (oy && end_cap_xs[i]) {
            for( y = oy; y <= end_cap_xs[i]; y++ ) {
              setPixel(pixels,{x: x+h, y: y+k},{r:0,g:0,b:0,a:255});
            }
          }
        }

        // for(var i = 0; i <= outer_circumference * fill_percent / 100; i++) {
        //   angle = i / outer_circumference * 2 * Math.PI;
        //   console.log(angle);
        //   for(var j = outer_radius; j >= inner_radius; j--) {
        //     setPixel(
        //       pixels,
        //     {
        //       x: Math.round(Math.cos(angle) * j) + h,
        //       y: Math.round(Math.sin(angle) * j) + k
        //     },
        //     {
        //       r: 0,
        //       g: 0,
        //       b: 0,
        //       a: 255
        //     });
        //   };
        // };

        args.ctx.putImageData(pixels,0,0)

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