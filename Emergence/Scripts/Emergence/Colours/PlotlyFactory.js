////////////////////
// Plotly Factory //
////////////////////

// Get a factory for generating plotly graphs.
function PlotlyFactory() {

    // Private

    function getMinimalAxis(title) {
        // "Axis" object (e.g. xaxis, yaxis, zaxis)
        return {
            showticklabels: false,
            title: title,
            zeroline: false,
            showline: false,
            showgrid: true,
            gridcolor: "rgb(204, 204, 204)",
            type: "linear",
            range: [0, 255],
            tick0: 0,
            dtick: 51
        }
    }

    // Public

    function get3DColourGraphLayout() {
        // For 3D plotly graphs, the axes formatting is determined by the scene.
        // see https://plot.ly/javascript/reference/#layout-scene
        let scene = {
            xaxis: getMinimalAxis("r"),
            yaxis: getMinimalAxis("g"),
            zaxis: getMinimalAxis("b"),
            camera: { eye: { x: 0, y: -2.5, z: 0 } }
        }

        // "Layout" object
        return {
            scene: scene,
            showlegend: false,
            autosize: true,
            margin: { t: 0, l: 0, r: 0, b: 0 }
        };
    }

    // "Trace" object to draw on a graph.
    // If no "c" (colours" are provided, they will be created from the x,y,z coordinates.
    // examples:
    // mode: "markers",
    // type: scatter3D,
    // x: [1,2,3]
    // y: [1,1,1]
    // z: [0,0,0]
    // c: ["rgb(1,2,3)", "rgb(1,1,1)", "rgb(0,0,0)"]
    function getTrace(mode, type, x, y, z, c) {
        let colour = [];

        if (c) {
            colour = c;
        }
        else {
            colour = ColourStringsFromArrays(x, y, z);
        }

        return {
            x: x,
            y: y,
            z: z,
            mode: mode,
            marker: {
                size: 6,
                opacity: 0.8,
                color: colour
            },
            type: type
        };
    }

    // Efficiently update the graph with supplied id to the given data.
    // Only the first trace will be updated.
    function updateGraph(id, trace) {
        function f() {
            Plotly.animate(id, {
                data: [trace],
                traces: [0],
                // If you wanted to update the layout in here as well:
                //layout: layout
            }, {
                transition: {
                    duration: 0,
                }, frame: {
                    duration: 0,
                    redraw: false
                }
            });
        }

        var promise = new Promise(function (resolve) {
            requestAnimationFrame(f);
            resolve();
        });

        return promise;
    }

    // PlotlyFactory methods:
    return {
        get3DColourGraphLayout: get3DColourGraphLayout,
        getTrace: getTrace,
        updateGraph: updateGraph
    }
}