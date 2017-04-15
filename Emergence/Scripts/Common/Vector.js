// Global vector instance
var v$ = Vector();

function Vector() {

    // Create a vector from an array of values.
    function create(V) {

        if (!Array.isArray(V)) throw `V must be an array. [${V}] is not an array.`;

        var vector = {
            array: V,
            map: function(f){ return create(this.array.map(f)) },
            length: V.length,
            magnitude: function () { return magnitude(this.array); },
            add: function (v2) { return add(this, v2); },
            sub: function (v2) { return sub(this, v2); },
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

    function magnitude(array) {
        if (array.length === 0) {
            return 0;
        }
        return Math.sqrt(array.reduce(function (t, n) { return t + (n * n); }, 0));
    }

    function add(v1, v2) {
        if (v1.length !== v2.length) throw `Vector addition requires equal lengths ([${v1.length}] != [${v2.length}])`;

        return create(v1.array.map(function (e, i) { return e + v2.array[i]; }));
    }

    function sub(v1, v2) {
        if (v1.length !== v2.length) throw `Vector subtraction requires equal lengths ([${v1.length}] != [${v2.length}])`;

        return create(v1.array.map(function (e, i) { return e - v2.array[i]; }));
    }

    let vectorObject = {
        create: create,
        create2: create2,
        createRandom: createRandom,
        magnitude: magnitude,
        add: add,
        sub: sub

    }

    return vectorObject;
}