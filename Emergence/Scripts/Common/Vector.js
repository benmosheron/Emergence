// Global vector instance
let v$ = Vector();

module.exports = {
    Vector: Vector
}

function Vector() {

    // Create a vector from an array of values.
    function create(arr) {

        if (!Array.isArray(arr)) throw `Input must be an array. [${arr}] is not an array.`;

        let vector = {
            // This vector's number array.
            array: arr,
            // Shortcuts
            // Creates a new vector from wrapping the result of array.map()
            map: function (f) { return create(this.array.map(f)) },
            reduce: function (f, init) { return this.array.reduce(f, init) },
            // Length of this vector's array.
            length: arr.length,
            // Calculate the magnitude of this vector.
            magnitude: function () { return magnitude(this.array); },
            // Calculate a new magnitude s vector with the same direction as this one.
            normalise: function (s) { return normalise(this, s); },
            add: function (v2) { return add(this, v2); },
            sub: function (v2) { return sub(this, v2); },
            multiplyScalar: function (s) { return multiplyScalar(this, s); },
            divideScalar: function (s) { return divideScalar(this, s); },
            equals: function (v2) { return equals(this, v2); },
            floor: function () { return floor(this); }
        };

        // xyz shortcuts
        if (vector.length > 0) {
            vector.x = arr[0];
        }

        if (vector.length > 1) {
            vector.y = arr[1];
        }

        if (vector.length > 2) {
            vector.z = arr[2];
        }

        return vector;
    }

    // Create a vector of length two, providing x and y values.
    function create2(x, y) {
        if (typeof x === "undefined") throw "At least one argument must be provided.";
        if (typeof y === "undefined") y = x;
        return create([x, y]);
    }

    // Create a uniform random n-length vector, bounded by min (inclusive) and max (exclusive).
    function createRandom(n, min, max) {
        let scale = max - min;
        let array = [];
        for (var i = 0; i < n; i++) {
            array[i] = (Math.random() * scale) + min;
        }
        return create(array);
    }

    // Calculate the magnitude of an array of numbers.
    function magnitude(array) {
        if (array.length === 0) {
            return 0;
        }
        return Math.sqrt(array.reduce(function (t, n) { return t + (n * n); }, 0));
    }

    // Calculate a new magnitude s vector with the same direction as v.
    function normalise(v, s) {
        if (typeof s === "undefined") s = 1;
        if (v.magnitude() === 0) return v.map(e => e);
        return v.multiplyScalar(s / v.magnitude());
    }

    function add(v1, v2) {
        if (v1.length !== v2.length) throw `Vector addition requires equal lengths ([${v1.length}] != [${v2.length}])`;

        return v1.map(function (e, i) { return e + v2.array[i]; });
    }

    function sub(v1, v2) {
        if (v1.length !== v2.length) throw `Vector subtraction requires equal lengths ([${v1.length}] != [${v2.length}])`;

        return v1.map(function (e, i) { return e - v2.array[i]; });
    }

    function multiplyScalar(v, s) {
        return v.map(e => e * s);
    }

    function divideScalar(v, s) {
        return v.map(e => e / s);
    }

    function equals(v1, v2) {
        if (v1.length !== v2.length) return false;
        return v1.reduce((acc, val, i) => acc && (v1.array[i] === v2.array[i]), true);
    }

    function floor(v) {
        return v.map(e => Math.floor(e));
    }

    let vectorObject = {
        create: create,
        create2: create2,
        createRandom: createRandom,
        magnitude: magnitude,
        normalise: normalise,
        add: add,
        sub: sub,
        multiplyScalar: multiplyScalar,
        divideScalar: divideScalar,
        equals: equals,
        floor: floor
    }

    return vectorObject;
}
