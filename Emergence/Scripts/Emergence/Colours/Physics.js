function BoundaryEffects() {
    return {
        // Teleport to the opposite boundary. Only affects position.
        // Returns new position.
        teleport: function (P, minP, maxP) {
            return P.map(p => {
                // Only teleport once we are strictly out of bounds
                if (p < minP) return maxP;
                if (p > maxP) return minP;
                return p;
            });
        },
        // Truncate to boundary, reflect velocity and acceleration in boundary axes.
        // Returns new position, velocity and acceleration.
        reflect: function (P, minP, maxP, V, A) {
            let newP = P.map(p => {
                // We are truncating to boundary so don't need to worry about < vs <=
                if (p < minP) return minP;
                if (p > maxP) return maxP;
                return p;
            });
            return {
                P: newP,
                V: newP.map((e, i) => {
                    // If this axis value is at boundary
                    if (e === minP || e === maxP) {
                        return -V.array[i];
                    }
                    else return V.array[i];
                }),
                A: newP.map((e, i) => {
                    // If this axis value is at boundary
                    if (e === minP || e === maxP) {
                        return -A.array[i];
                    }
                    else return A.array[i];
                })
            }
        }
    }
}

// Get an object for tracking the path of an object in 3D space.
function Trajectory() {
    // Timestep
    let dt = 1;

    // Bounds on position.
    let minP = 0;
    let maxP = 255;

    // Maximum magnitude of velocity.
    let maxV = 10;

    // Maximum magnitude of acceleration.
    let maxA = 10;

    // Number of timesteps of positions to store.
    let maxTrajectoryLength = 50;
    
    let P = v$.create([128, 128, 128]);
    let V = v$.create([10, 10, 0]);
    let A = v$.create([0, 0, 0]);

    // Array store the trajectory.
    let trajectory = [P];

    let boundaryEffects = BoundaryEffects();

    function update() {
        // Apply a random force.
        A = A.add(v$.createRandom(3, -1, 1));

        // Truncate acceleration.
        if (A.magnitude() > maxA) A = A.normalise(maxA);

        // Update velocity.
        V = A.add(A.multiplyScalar(dt));

        // Truncate velocity
        if (V.magnitude() > maxV) V = V.normalise(maxV);

        // Update position
        P = P.add(V.multiplyScalar(dt));

        // Apply position boundary.
        // For now just teleport to opposite side.
        //P = boundaryEffects.teleport(P, minP, maxP);
        let bounded = boundaryEffects.reflect(P, minP, maxP, V, A);
        P = bounded.P;
        V = bounded.V;
        A = bounded.A;

        // Update trajectory
        trajectory.unshift(P);

        // Truncate the trajectory.
        if (trajectory.length > maxTrajectoryLength) trajectory.pop();
    }

    function getTrace() {
        let x = trajectory.map(p => p.x);
        let y = trajectory.map(p => p.y);
        let z = trajectory.map(p => p.z);
        return {
            x: x,
            y: y,
            z: z,
            marker: { color: ColourStringsFromArrays(x, y, z) }
        }
    }

    return {
        trajectory: trajectory,
        update: update,
        getTrace: getTrace
    }
}

function ConstantVelocitySystem(mode, initialPositions, initialVelocities) {
    let minP = 0;
    let maxP = 255;
    // shortcut function
    let v3 = (x, y, z) => v$.create([x, y, z]);

    let positions = [];
    let velocities = [];

    let boundaryEffects = BoundaryEffects();

    // More shortcuts:
    // Max position
    let M = 255;
    // Velocity
    let V = 1;
    // Negative Velocity
    let N = -V;

    switch (mode) {
        case "edges":
            initialPositions = [
                v3(0, 0, 0),
                v3(0, M, 0),
                v3(M, 0, 0),
                v3(M, M, 0),

                v3(0, 0, M),
                v3(0, M, M),
                v3(M, 0, M),
                v3(M, M, M),

                v3(0, 0, 0),
                v3(0, M, M),
                v3(M, 0, 0),
                v3(M, M, M),
            ];

            initialVelocities = [
                v3(0, N, 0),
                v3(N, 0, 0),
                v3(V, 0, 0),
                v3(0, V, 0),

                v3(0, V, 0),
                v3(V, 0, 0),
                v3(N, 0, 0),
                v3(0, N, 0),

                v3(0, 0, V),
                v3(0, 0, N),
                v3(0, 0, N),
                v3(0, 0, V),
            ];
        case "custom":
        default:
    }

    positions = initialPositions;
    velocities = initialVelocities;

    function update() {
        // Move
        positions = positions.map((e, i) => e.add(velocities[i]));

        // Teleport
        positions = positions.map(e => boundaryEffects.teleport(e, minP, maxP));
    }

    function getTrace() {
        let x = positions.map(p => p.x);
        let y = positions.map(p => p.y);
        let z = positions.map(p => p.z);
        return {
            x: x,
            y: y,
            z: z,
            marker: { color: ColourStringsFromArrays(x, y, z) }
        }
    }

    return {
        update: update,
        getTrace: getTrace
    }
}