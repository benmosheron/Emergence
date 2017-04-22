// Helper functions for working with colours on a canvas
function CanvasController(id) {
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

    function GetCanvasController(ctx) {

        // Private Functions

        // Public Functions

        // Draw a square on the canvas
        function drawSquare(left, top, sideLength, colour) {
            ctx.fillStyle = colour.string;
            ctx.fillRect(left, top, sideLength, sideLength);
        }

        // Draw a rectangle on the canvas
        function drawRect(left, top, width, height, colour) {
            ctx.fillStyle = colour.string;
            ctx.fillRect(left, top, width, height);
        }

        var controller = {
            context: ctx,
            drawSquare: drawSquare,
            drawRect: drawRect
        }

        return controller;
    }

    return GetCanvasController(ctx);
}


