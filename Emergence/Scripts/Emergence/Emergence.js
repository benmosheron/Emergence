// TODO: following colour.js re-neducation
//window.onload = function () {
//    var colour0 = CanvasColour("canvas0");
//    var colour1 = CanvasColour("canvas1");

//    setupBackground(colour0);
//    start(colour1);
//}

//function setupBackground(colour) {
//    for (i = 0; i < 80; i++) {
//        for (var j = 0; j < 50; j++) {
//            colour.random();
//            colour.context.fillRect(i * 10, j * 10, 10, 10);
//        }
//    }
//}

//function start(ctx) {
//    window.setInterval(function () { run(ctx) }, 16);
//}

//var count = 0;

//function run(colour) {
//    var ctx = colour.context;
//    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

//    colour.change(10, 200, 50, 0.5);

//    count++;
//    ctx.fillRect(0 + count, 0, 100, 100);
//    if (count > ctx.canvas.width) count = 0;
//}