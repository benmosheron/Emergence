// Helper functions for working with colours on a canvas
function CanvasColour(id) {
    // id can be:
    //  1) id of canvas element
    //  2) reference to canvas element
    //  3) context of canvas element

    var ctx = null;

    if (typeof id === "string") {
        ctx = document.getElementById(id).getContext("2d");
    }
    else if (id instanceof HTMLCanvasElement) {
        ctx = id.getContext("2d");
    }
    else if (id instanceof CanvasRenderingContext2D) {
        ctx = id;
    }
    else {
        // :(
        throw "Not a valid input to create a CanvasColour: [" + id + "].";
    }

    return GetCanvasColour(ctx);
}

function GetCanvasColour(ctx) {

    // Private Functions

    // Transform origin in bottom left (i.e. maths) to origin in top left (canvas)
    function Transform(v) {
        if (v.length !== 2) throw "Can only transform a length 2 vector to canvas coordinates";
        return Vector2(v.x, ctx.canvas.height - v.y);
    }

    // Public Functions

    // Change the canvas fill colour.
    function changeColour(r,g,b,a) {
        ctx.fillStyle = "rgba(" + r + ", " + g + ", " + b + "," + a + ")";
    }

    // Change the canvas fill colour to a random colour.
    function changeToRandomColour(){
        ctx.fillStyle = "rgb(" + rand255() + ", " + rand255() + ", " + rand255() + ")";
    }

    // Draw a line between two vectors
    function drawLine(v1, v2) {
        v1 = Transform(v1);
        v2 = Transform(v2);
        ctx.beginPath();
        ctx.moveTo(v1.x, v1.y);
        ctx.lineTo(v2.x, v2.y);
        ctx.stroke();
    }

    // Draw a square centred at v, with side length size*2
    function drawSquare(v, size) {
        var s = Vector2(size, size);
        //var vMin = v.sub(s);
        var c = Transform(v);
        var cMin = Vector2(c.x - size, c.y - size);
        //var cMin = Transform(vMin);
        //ctx.fillRect(cMin.x, cMin.y, size * 2, size * 2);
        ctx.fillRect(cMin.x, cMin.y, size * 2, size * 2);
    }

    var colour = {
        context: ctx,
        change: changeColour,
        random: changeToRandomColour,
        drawLine: drawLine,
        drawSquare: drawSquare,
    }

    return colour;
}

function rand255() {
    return Math.floor(Math.random() * 256);
}