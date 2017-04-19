// Global vector instance
var v$ = Vector();

function Vector() {

    // Create a vector from an array of values.
    function create(V) {

        if (!Array.isArray(V)) throw `V must be an array. [${V}] is not an array.`;

        var vector = {
            // This vector's number array.
            array: V,
            // Shortcut to array.prototype.map
            map: function (f) { return create(this.array.map(f)) },
            // Length of this vector's array.
            length: V.length,
            // Calculate the magnitude of this vector.
            magnitude: function () { return magnitude(this.array); },
            // Calculate a new magnitude s vector with the same direction as this one.
            normalise: function (s) { return normalise(this, s); },
            add: function (v2) { return add(this, v2); },
            sub: function (v2) { return sub(this, v2); },
            multiplyScalar: function (s) { return multiplyScalar(this, s); },
            divideScalar: function (s) { return divideScalar(this, s); },
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

    // Create a vector of length two, providing x and y values.
    function create2(x, y) {
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
        return v.multiplyScalar(s / v.magnitude());
    }

    function add(v1, v2) {
        if (v1.length !== v2.length) throw `Vector addition requires equal lengths ([${v1.length}] != [${v2.length}])`;

        return create(v1.array.map(function (e, i) { return e + v2.array[i]; }));
    }

    function sub(v1, v2) {
        if (v1.length !== v2.length) throw `Vector subtraction requires equal lengths ([${v1.length}] != [${v2.length}])`;

        return create(v1.array.map(function (e, i) { return e - v2.array[i]; }));
    }

    function multiplyScalar(v, s) {
        return create(v.array.map(e => e * s));
    }

    function divideScalar(v, s) {
        return create(v.array.map(e => e / s));
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
        divideScalar: divideScalar
    }

    return vectorObject;
}