window.onload = function () {
    Colours();
}

// Global Colours() function. Run this once to kick things off.
function Colours() {
    let coloursData = {
        // runDivsArray is an array of objects which tracks the states of the runDivsArray on this page.
        // [{ 
        //     id: "id of run div",
        //     active: "true for the single active element",
        //     initialised: "true if element has initialised",
        //     run: "function to run"
        //     initialise: "function to initialise"
        // }, {...}, ...]
        runDivsArray: [],
        runDivsObject: {},
        setUp: function (id, functions) {
            // Add the details to the array.
            let index = this.runDivsArray.push({
                id: id,
                initialised: false,
                active: false,
                initialise: functions.initialise,
                update: functions.update
            }) - 1;
            // And keep an index keyed to the ID
            this.runDivsObject[id] = index;
        },
        setActive: function (id) { this.runDivsArray[this.runDivsObject[id]].active = true; },
        setInActive: function (id) { this.runDivsArray[this.runDivsObject[id]].active = false; },
        setInitialised: function (id) { this.runDivsArray[this.runDivsObject[id]].initialised = true; },
        // Global "Run" Function.
        run: function () {
            if (!this.runDivsArray.some(r => r.active)) {
                // No elements are active, so don't do anything
                return new Promise((resolve) => resolve());
            }
            else {
                // Run the code for the active element
                let o = this.runDivsArray.find(r => r.active);
                // Run initialise if it has not been run.
                if (!o.initialised) {
                    o.initialised = true;
                    return o.initialise();
                }
                else {
                    return o.update();
                }
            }
        }
    };


    ////////////
    // Set Up //
    ////////////

    // Set up the runDivs which power other elements when mouse-hovered.
    function setUpRunDivs() {
        let runDivs = $("div.runDiv");

        let functions = {
            runDiv0: {initialise: initForRunDiv0, update: updateForRunDiv0}
        }

        runDivs
            .each((i, e) => coloursData.setUp(e.id, functions[e.id]))
            .mouseenter(function (eventData) { coloursData.setActive(eventData.toElement.id); })
            .mouseleave(function (eventData) { coloursData.setInActive(eventData.fromElement.id); });
    }

    function initForRunDiv0(){
        graphDiv = document.getElementById("graphDiv0");

        let init = [];
        for (var i = 0; i < 100; i++) { init[i] = 126; }
        var trace = {
            x: init,
            y: init,
            z: init,
            mode: 'markers',
            marker: {
                size: 6,
                opacity: 0.8
            },
            type: 'scatter3d'
        };

        let data = [trace];
        let layout = plotlyFactory.get3DColourGraphLayout();

        return Plotly.plot(graphDiv, data, layout, { displayModeBar: false });
    }

    function updateForRunDiv0() {
        let graphDiv = document.getElementById("graphDiv0");
        let data = graphDiv.data;
        let trace = data[0];

        let move = A => A.map(a => a + (Math.random() * 20) - 10);
        let limit = A => A.map(function (a) {
            if (a > 255) a = 255;
            if (a < 0) a = 0;
            return a;
        });

        trace.x = limit(move(trace.x));
        trace.y = limit(move(trace.y));
        trace.z = limit(move(trace.z));

        trace.marker.color = trace.x.map(function (e, i) { return "rgba(" + trace.x[i] + ", " + trace.y[i] + ", " + trace.z[i] + ", 1)"; });

        return Plotly.update(graphDiv, data, graphDiv.layout);
    }

    ////////////////////
    // Plotly Factory //
    ////////////////////

    // Get a factory for generating plotly graphs.
    let plotlyFactory = function() {
        function getMinimalAxis(title) {
            // "Axis" object (e.g. xaxis, yaxis, zaxis)
            return {
                showticklabels: false,
                title: title,
                zeroline: true,
                showline: true,
                showgrid: false,
                type: "linear",
                range: [0, 255]
            }
        }

        function get3DColourGraphLayout() {
            // For 3D plotly graphs, the axes formatting is determined by the scene.
            // see https://plot.ly/javascript/reference/#layout-scene
            let scene = {
                xaxis: getMinimalAxis("r"),
                yaxis: getMinimalAxis("g"),
                zaxis: getMinimalAxis("b"),
                camera: { eye: { x: 0.1, y: 2.5, z: 0.1 } }
            }

            // "Layout" object
            return {
                scene: scene,
                showlegend: false,
                autosize: true,
                margin: { t: 0, l: 0, r: 0, b: 0 }
            };
        }

        return {
            get3DColourGraphLayout: get3DColourGraphLayout
        }
    }();

    ////////////
    // Update //
    ////////////

    function updateRecursive() {
        // Run the update function for the active element. it should return a promise.
        setTimeout(function () {
            coloursData
                .run()
                .then(updateRecursive);
        }, 16);
    }

    setUpRunDivs();
    updateRecursive();
}
