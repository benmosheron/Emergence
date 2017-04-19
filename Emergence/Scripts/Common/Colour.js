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

// Get an array of colours from three arrays R, G and B.
function ColoursFromArrays(R, G, B) {
    return R.map((e, i) => Colour(v$.create([R[i], G[i], B[i]])));
}

// Get an array of css colour strings (e.g. "rgb(0,0,0)") from three arrays R, G and B.
function ColourStringsFromArrays(R, G, B) {
    // Manually create rgb(r,g,b) strings here to avoid the overhead of
    // creating vectors and colour instances.
    return R.map((e, i) => `rgb(${R[i]}, ${G[i]}, ${B[i]})`);
}

function RandomColour() {
    return Colour(v$.createRandom(3, 0, 256).map(x => Math.floor(x)));
}