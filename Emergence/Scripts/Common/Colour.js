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

function ColourFromArray(a) {
    return Colour(v$.create(a));
}

// Get a vector of colours from three arrays R, G and B
function ColoursFromArrays(R, G, B) {
    return R.map((e, i) => Colour(v$.create([R[i], G[i], B[i]])).string);
}

function RandomColour() {
    return Colour(v$.createRandom(3, 0, 256).map(x => Math.floor(x)));
}