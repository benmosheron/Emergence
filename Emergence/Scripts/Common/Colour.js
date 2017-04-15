// Helper functions for working with colours.

function Colour(v) {
    return {
        v: v,
        r: v.x,
        g: v.y,
        b: v.z,
        string: `rgb(${v.x}, ${v.y}, ${v.z})`
    }
}

function RandomColour() {
    return Colour(v$.createRandom(3, 0, 256).map(x => Math.floor(x)));
}