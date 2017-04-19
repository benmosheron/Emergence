window.onload = function () {
    Colours();
}

// Global Colours() function. Run this once to kick things off.
function Colours() {

    /////////////////
    // DOM updates //
    /////////////////

    function setDivActive(id) {
        $("#" + id).addClass("active");
    }

    function setDivInactive(id) {
        $("#" + id).removeClass("active");
    }

    ////////////////
    // Data Model //
    ////////////////

    // Tracks the states of the various "runDivs" which allow user interaction.
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
        // tracker is a dictionary { id, index }, allowing us to look up states in the array by id
        // via the get(id) method.
        tracker: {},
        get: function (id) { return this.runDivs[this.tracker[id]]; },
    };

    // Controls updates to elements on the page.
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
                // No elements are active, so don't do anything.
                return new Promise((resolve) => resolve());
            }
            else {
                // Run the code for the active element.
                let o = coloursData.runDivs.find(r => r.active);
                // Run initialise if it has not been run.
                if (!o.initialised) {
                    o.initialised = true;
                    return o.initialise();
                }
                else {
                    // Main update loop work goes here.
                    return o.update();
                }
            }
        }
    }

    ////////////////////
    // Plotly Factory //
    ////////////////////

    // Get a factory for generating plotly graphs.
    let plotlyFactory = PlotlyFactory();

    ////////////
    // Set Up //
    ////////////

    // Set up the runDivs which power other elements when mouse-hovered.
    function setUpRunDivs() {
        let runDivs = $("div.runDiv");

        // Assign update and init functions to each runDiv
        let functions = {
            runDiv0: { initialise: initForRunDiv0, update: updateForRunDiv0 },
            runDiv1: { initialise: initForRunDiv1, update: function () { return new Promise(r => r()) } },
            runDiv2: { initialise: initForRunDiv2, update: updateForRunDiv2 }
        }

        runDivs
            .each((i, e) => coloursController.setUp(e.id, functions[e.id]))
            .mouseenter(function (eventData) {
                let id = eventData.toElement.id;
                coloursController.setActive(id);
                setDivActive(id)
            })
            .mouseleave(function (eventData) {
                let id = eventData.fromElement.id;
                coloursController.setInActive(id);
                setDivInactive(id)
            });
    }

    //////////////////////////
    // Initialise Functions //
    //////////////////////////

    function initForRunDiv0(){
        let graphDiv = $("#graphDiv0")[0];
        
        let init = [];
        for (var i = 0; i < 100; i++) { init[i] = 126; }
        let trace = plotlyFactory.getTrace("markers", "scatter3d", init, init, init);

        let data = [trace];
        let layout = plotlyFactory.get3DColourGraphLayout();

        return Plotly.plot(graphDiv, data, layout, { displayModeBar: false });
    }

    function initForRunDiv1() {
        graphDiv = document.getElementById("graphDiv1");

        let init = [0, 63, 127, 191, 255];
        
        let trace = plotlyFactory.getTrace("markers", "scatter3d", init, init, init);

        let data = [trace];
        let layout = plotlyFactory.get3DColourGraphLayout();

        return Plotly.plot(graphDiv, data, layout, { displayModeBar: false });
    }

    let trajectory2 = Trajectory();

    function initForRunDiv2() {
        graphDiv = document.getElementById("graphDiv2");

        let trace = plotlyFactory.getTrace(
            "markers",
            "scatter3d",
            trajectory2.trajectory.map(p => p.x),
            trajectory2.trajectory.map(p => p.y),
            trajectory2.trajectory.map(p => p.z));

        let data = [trace];
        let layout = plotlyFactory.get3DColourGraphLayout();

        return Plotly.plot(graphDiv, data, layout, { displayModeBar: false });
    }

    //////////////////////
    // Update Functions //
    //////////////////////

    function updateForRunDiv0() {
        let id = "graphDiv0";
        let graphDiv = document.getElementById(id);
        let data = graphDiv.data;
        let trace = data[0];

        // Stupid jiggly balls animation
        let move = A => A.map(a => a + (Math.random() * 20) - 10);

        // Keep it within the graph.
        let limit = A => A.map(function (a) {
            if (a > 255) a = 255;
            if (a < 0) a = 0;
            return a;
        });

        // Update the trace.
        trace.x = limit(move(trace.x));
        trace.y = limit(move(trace.y));
        trace.z = limit(move(trace.z));
        trace.marker.color = ColourStringsFromArrays(trace.x, trace.y, trace.z);
        
        // Animate
        return plotlyFactory.updateGraph(id, trace);
    }

    function updateForRunDiv2() {
        let id = "graphDiv2";

        // Update positions.
        trajectory2.update();

        // Animate
        return plotlyFactory.updateGraph(id, trajectory2.getTrace());
    }

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
