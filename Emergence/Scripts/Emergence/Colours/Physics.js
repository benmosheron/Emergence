function BoundaryEffects() {
    return {
        // Teleport to the opposite boundary. Only affects position.
        // Returns new position.
        teleport: function (P, minP, maxP) {
            return P.map(p => {
                if (p < minP) return maxP;
                if (p >= maxP) return minP;
                return p;
            });
        },
        // Truncate to boundary, reflect velocity and acceleration in boundary axes.
        // Returns new position, velocity and acceleration.
        reflect: function (P, minP, maxP, V, A) {
            let newP = P.map(p => {
                if (p < minP) return minP;
                if (p >= maxP) return maxP;
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

    return {
        trajectory: trajectory,
        update: update
    }
}