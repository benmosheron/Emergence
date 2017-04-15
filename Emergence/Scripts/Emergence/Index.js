let indexGlobalObject = {
    updateSingleColourComponent: function (x) {
        x = x + 1;
        if (x > 255) x = 0;
        return x;
    }
};

function IndexGlobalUpdate() {
    let I = indexGlobalObject;
    // Increment each RGB value, cycle 256 => 0
    I.colours = I.colours.map(
        c => Colour(c.v.map(I.updateSingleColourComponent)));

    // Draw
    for (var i = 0; i < 10; i++) {
        for (var j = 0; j < 10; j++) {
            I.controller.drawSquare(i * 10, j * 10, 10, I.colours[i + (j * 10)]);
        }
    }
}

window.onload = function () {
    let controller = CanvasController("canvasIndex0");

    // Initialise an array of 100 random colours
    let colours = [];

    for (var i = 0; i < 100; i++) {
        colours[i] = RandomColour();
    }

    indexGlobalObject.colours = colours;
    indexGlobalObject.controller = controller;
    setInterval(IndexGlobalUpdate, 16);
}