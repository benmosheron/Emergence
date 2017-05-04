// Unit tests for Vector.js
// Run with:
// > mocha --recursive .
//c:\emergence\emergence\scripts\common\vector.js
var assert = require('assert');
var vector = require('../../../Emergence/Scripts/Common/Vector.js');

let Vector = vector.Vector();

describe("Vector", function () {
    let vZero = Vector.create([0, 0, 0]);
    // arbitrary x,y,z values
    let x = 1.01;
    let y = -39.01;
    let z = 1093.1239;
    describe("#create()", function () {
        it("should throw if the argument is not an array", function () {
            assert.throws(function () { Vector.create(); });
            assert.throws(function () { Vector.create(null); });
            assert.throws(function () { Vector.create({}); });
            assert.throws(function () { Vector.create("yo"); });
            assert.throws(function () { Vector.create(3); });
        });
        it("should create an empty vector from an empty array", function () {
            let v = Vector.create([]);
            isAVector(v);
            assert.strictEqual(v.length, 0);
        });
        it("should create a 1D vector from a length 1 array", function () {
            let v = Vector.create([x]);
            isAVector(v);
            assert.strictEqual(v.length, 1);
            assert.strictEqual(v.x, x);
        });
        it("should create a 2D vector from a length 2 array", function () {
            let v = Vector.create([x, y]);
            isAVector(v);
            assert.strictEqual(v.length, 2);
            assert.strictEqual(v.x, x);
            assert.strictEqual(v.y, y);
        });
        it("should create a 3D vector from a length 3 array", function () {
            let v = Vector.create([x, y, z]);
            isAVector(v);
            assert.strictEqual(v.length, 3);
            assert.strictEqual(v.x, x);
            assert.strictEqual(v.y, y);
            assert.strictEqual(v.z, z);
        });
        it("should create an N dimensional vector from an array of length N", function () {
            let N = 100;
            let a = [];
            for (var i = 0; i < N; i++) { a.push(i); }
            let v = Vector.create(a);
            isAVector(v);
            assert.strictEqual(v.length, N);
            for (var i = 0; i < N; i++) { assert.strictEqual(v.array[i], a[i]); }
        });
    });
    describe("#create2()", function () {
        it("should throw if no argument is provided", function () {
            assert.throws(Vector.create2);
        });
        it("should create a 2D vector from a single input", function () {
            let v = Vector.create2(x);
            isAVector(v);
            assert.strictEqual(v.length, 2);
            assert.strictEqual(v.x, x);
            assert.strictEqual(v.y, x);
        });
        it("should create a 2D vector from both arguments", function () {
            let v = Vector.create2(x, y);
            isAVector(v);
            assert.strictEqual(v.length, 2);
            assert.strictEqual(v.x, x);
            assert.strictEqual(v.y, y);
        });
    });
    describe("#createRandom()", function () {
        it("should create an N-dimensional random vector with elements between min and max", function () {
            let N = 1000;
            let min = -1;
            let max = 1;
            let v = Vector.createRandom(N, min, max);
            isAVector(v);
            assert.strictEqual(v.length, N);
            for (var i = 0; i < N; i++) {
                assert(v.array[i] >= min);
                assert(v.array[i] < max);
            }
        })
    });
    describe("v.map()", function () {
        it("should provide an analogue to Array.map()", function () {
            let v = Vector.create([x, y, z]);
            let vDoubled = v.map(e => e * 2);
            isAVector(vDoubled);
            assert.strictEqual(v.length, vDoubled.length);
            assert.strictEqual(vDoubled.x, x * 2);
            assert.strictEqual(vDoubled.y, y * 2);
            assert.strictEqual(vDoubled.z, z * 2);
        });
    });
    describe("v.reduce()", function () {
        it("should provide an analogue to Array.reduce()", function () {
            let v = Vector.create([x, y, z]);
            let r = v.reduce((acc, val) => acc + val, 0);
            assert.strictEqual(r, x + y + z);
        });
    });
    describe("#magnitude()", function () {
        let v = Vector.create([x, y, z]);
        function assertMagnitude(m) {
            assert.strictEqual(m, Math.sqrt((x * x) + (y * y) + (z * z)));
        }
        describe("static", function () {
            it("should calculate the magnitude of the vector argument", function () {
                let m = Vector.magnitude(v);
                assertMagnitude(m);
            });
            it("should return zero if the vector argument has all elements === 0", function () {
                let m = Vector.magnitude(vZero);
                assert.strictEqual(m, 0);
            });
        });
        describe("member", function () {
            it("should calculate the magnitude of itself", function () {
                let m = v.magnitude();
                assertMagnitude(m);
            });
            it("should return zero if all its elements === 0", function () {
                let m = vZero.magnitude();
                assert.strictEqual(m, 0);
            });
        });
    });
    describe("#normalise()", function () {
        let v = Vector.create([x, y, z]);
        function assertNormalised(vNorm) {
            isAVector(vNorm);
            assert(basicallyEqual(vNorm.magnitude(), 1));
            assert(basicallyEqual(vNorm.x, x / Math.sqrt((x * x) + (y * y) + (z * z))));
            assert(basicallyEqual(vNorm.y, y / Math.sqrt((x * x) + (y * y) + (z * z))));
            assert(basicallyEqual(vNorm.z, z / Math.sqrt((x * x) + (y * y) + (z * z))));
        }
        function assertZeroVector(zeroVector, expectedLength) {
            isAVector(zeroVector);
            assert.strictEqual(zeroVector.length, expectedLength);
            for (var i = 0; i < zeroVector.length; i++) {
                assert.strictEqual(zeroVector.array[i], 0);
            }
        }
        describe("static", function () {
            it("should calculate the normalised vector of the vector argument", function () {
                let vNorm = Vector.normalise(v);
                assertNormalised(vNorm);
            });
            it("should return a zero vector for a zero vector argument", function () {
                let vNorm = Vector.normalise(vZero);
                assertZeroVector(vNorm, vZero.length);
            });
        });
        describe("member", function () {
            it("should calculate the normalised vector of itself", function () {
                let vNorm = v.normalise();
                assertNormalised(vNorm);
            });
            it("should return a zero vector if all elements === 0", function () {
                let vNorm = vZero.normalise();
                assertZeroVector(vNorm, vZero.length);
            });
        });
    });
});

function isAVector(v) {
    assert.strictEqual("object", typeof v);
    assert(Array.isArray(v.array));
    assert.strictEqual("number", typeof v.length);
}

function basicallyEqual(n1, n2) {
    let precision = 19;
    if ((typeof n1 !== "number") || (typeof n2 !== "number")) throw "Only use basicallyEqual for numbers.";
    if (n1 === n2) return true;
    // E.g. 0.0009233692949769974 ==  0.0009233692949769973
    // or  -0.0009233692949769974 == -0.0009233692949769973
    let n1s = n1.toString();
    let n2s = n2.toString();

    // Check we are only comparing high precision floating points
    if (n1s.indexOf(".") !== n2s.indexOf(".")) return false;
    // The . should either be position 1 or 2 (for negative numbers)
    if ((n1s.indexOf(".") !== 1) && (n1s.indexOf(".") !== 2)) return false;

    // truncate to precision
    if (n1s.length > precision) n1s = n1s.substr(0, precision);
    if (n2s.length > precision) n2s = n2s.substr(0, precision);

    if (n1s === n2s) return true;
    return false;
}
