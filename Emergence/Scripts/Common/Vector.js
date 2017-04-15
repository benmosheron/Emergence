function Vector2(x, y) {
    return Vector([x, y]);
}

function Vector(V) {

    if (!Array.isArray(V)) throw `V must be an array. [${V}] is not an array.`;

    var vector = {
        array: V,
        length: V.length,
        magnitude: function () { return Magnitude(this.array); },
        add: function (v2) { return Add(this, v2); },
        sub: function (v2) { return Sub(this, v2); },
    };

    // xyz shortcuts
    if (vector.length > 0) {
        vector.x = V[0];
    }

    if (vector.length > 1) {
        vector.y = V[1];
    }

    if (vector.length > 2) {
        vector.z = V[2];
    }

    return vector;
}



function Magnitude(array) {
    if (array.length === 0) {
        return 0;
    }
    return Math.sqrt(array.reduce(function (t, n) { return t + (n * n); }, 0));
}

function Add(v1, v2) {
    if (v1.length !== v2.length) throw `Vector addition requires equal lengths ([${v1.length}] != [${v2.length}])`;

    return Vector(v1.array.map(function (e, i) { return e + v2.array[i]; }));
}

function Sub(v1, v2) {
    if (v1.length !== v2.length) throw `Vector subtraction requires equal lengths ([${v1.length}] != [${v2.length}])`;

    return Vector(v1.array.map(function (e, i) { return e - v2.array[i]; }));
}
