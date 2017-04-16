window.onload = function () {
    Colours();
}

// Global Colours() function. Run this once to kick things off.
function Colours() {

    ////////////////
    // Data Model //
    ////////////////

    let coloursData = {
        // runDivs is an array of objects containing the states of the runDivs on this page.
        // [{ 
        //     id: "id of run div",
        //     active: "true if the element is active",
        //     initialised: "true if element has initialised",
        //     update: "function to run to make updates associated with this runDiv"
        //     initialise: "function to initialise elements associated with this runDiv"
        // }]
        runDivs: [],
        // tracker is a shortcut object, allowing us to look up states in the array by id
        // via the get(id) method.
        tracker: {},
        get: function (id) { return this.runDivs[this.tracker[id]]; },
    };

    let coloursController = {
        // Register functions to be called when an element is active.
        setUp: function (id, functions) {
            // Add the details to the array.
            let index = coloursData.runDivs.push({
                id: id,
                initialised: false,
                active: false,
                initialise: functions.initialise,
                update: functions.update
            }) - 1;
            // And keep an index keyed to the ID
            coloursData.tracker[id] = index;
        },
        // Set the element with ID [id] to be active. Its update() method will be called.
        setActive: function (id) { coloursData.get(id).active = true; },
        // Set the element with ID [id] to be inactive.
        setInActive: function (id) { coloursData.get(id).active = false; },
        // The element with Id [id] has been initialised.
        setInitialised: function (id) { coloursData.get(id).initialised = true; },
        // "Run" Function. Performs one update for the active element (if any).
        run: function () {
            if (!coloursData.runDivs.some(r => r.active)) {
                // No elements are active, so don't do anything
                return new Promise((resolve) => resolve());
            }
            else {
                // Run the code for the active element
                let o = coloursData.runDivs.find(r => r.active);
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
    }

    ////////////
    // Set Up //
    ////////////

    // Set up the runDivs which power other elements when mouse-hovered.
    function setUpRunDivs() {
        let runDivs = $("div.runDiv");

        // Assign update and init functions to each runDiv
        let functions = {
            runDiv0: { initialise: initForRunDiv0, update: updateForRunDiv0 },
            runDiv1: { initialise: initForRunDiv1, update: function () { return new Promise(r => r()) } }
        }

        runDivs
            .each((i, e) => coloursController.setUp(e.id, functions[e.id]))
            .mouseenter(function (eventData) { coloursController.setActive(eventData.toElement.id); })
            .mouseleave(function (eventData) { coloursController.setInActive(eventData.fromElement.id); });
    }

    //////////////////////////
    // Initialise Functions //
    //////////////////////////

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

    function initForRunDiv1() {
        graphDiv = document.getElementById("graphDiv1");

        let init = [0, 255];
        
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

    //////////////////////
    // Update Functions //
    //////////////////////

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

        function get3DColourGraphLayout() {
            // For 3D plotly graphs, the axes formatting is determined by the scene.
            // see https://plot.ly/javascript/reference/#layout-scene
            let scene = {
                xaxis: getMinimalAxis("r"),
                yaxis: getMinimalAxis("g"),
                zaxis: getMinimalAxis("b"),
                camera: { eye: { x: 0, y: -2.5, z: 0} }
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
        // Run the update function for the active element. It should return a promise.
        setTimeout(function () {
            coloursController
                .run()
                .then(updateRecursive);
        }, 16);
    }

    setUpRunDivs();
    updateRecursive();
}
