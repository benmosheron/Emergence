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

    $("#titleCanvas").click(updateTitleColourBarToRandom);
    $("#titleCanvas").mousemove(titleColourBarMouseMove);
    $("#titleCanvas").mouseleave(titleColourBarMouseLeave);

    ////////////////
    // Data Model //
    ////////////////

    // For controlling the transition of background colours.
    let backgroundColourController = {
        // The starting colour
        original: ColourFromArray([249, 249, 249]),
        // The target colour, update will move current towards this
        target: ColourFromArray([249, 249, 249]),
        // The current colour
        current: ColourFromArray([249, 249, 249]),
        // Amount to change current by each time update is called
        delta: v$.create([0, 0, 0]),
        // Number of frames the transition will take
        frames: 30,
        // number of frames remaining in this transition
        framesToUpdate: this.frames,
        change: function (colour) {
            // Set new target colour
            this.target = colour;
            // Update delta
            this.delta = v$.sub(this.target.v, this.current.v).divideScalar(this.frames);
            // Reset counted frames
            this.framesToUpdate = this.frames;
        },
        reset: function () { this.change(this.original); },
        update: function () {
            // Return if we don't need to change anything
            if (v$.equals(this.target.v, this.current.v)) return;

            // Move current towards target.
            this.current = Colour(this.current.v.add(this.delta));

            // Decrease frame count
            if (this.framesToUpdate > 0)
                this.framesToUpdate = this.framesToUpdate - 1;

            // If we are at the end, set the colour to the target.
            if (this.framesToUpdate === 0) {
                this.current = this.target;
            }

            // update DOM
            $("div.body-content").css("background-color", this.current.string);
        }
    };

    // Tracks the states of the various "runDivs" which allow user interaction.
    let coloursData = {
        // Array of colours shown in the title bar.
        titleBar: {
            colours: [],
            segmentWidth: 5,
            width: $("#titleCanvas").attr("width"),
            height: $("#titleCanvas").attr("height"),
            selected: 0,
        },
        backgroundColour: "xD",
        // Maps canvas IDs to their CanvasControllers
        canvasControllers: {},
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
            // Run the background colour update
            backgroundColourController.update();
            // Run the runDiv updates
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

    function setUpCanvases() {
        // Register a canvas controller for each controlledCanvas
        $(".controlledCanvas").each((i, e) => coloursData.canvasControllers[e.id] = CanvasController(e.id));
    }

    // Set up the title colour bar
    function setUpTitleColourBar() {
        // Set the width by getting the width of the containing colourBarDiv
        let canvasJq = $("#titleCanvas");
        let colourBarDiv = canvasJq.parent();
        coloursData.titleBar.width = colourBarDiv.width();

        let canvas = canvasJq[0];
        
        // Set the actual width and height (number of pixels, not visual size)
        canvas.width = coloursData.titleBar.width;
        canvas.height = coloursData.titleBar.height;

        let nSegments = coloursData.titleBar.width / coloursData.titleBar.segmentWidth;

        for (var i = 0; i < nSegments; i++) {
            coloursData.titleBar.colours[i] = RandomColour();
        }

        // Call without argument to use coloursData.titleBar.colours.
        updateTitleColourBar();
    }

    // Set up the runDivs which power other elements when mouse-hovered.
    function setUpRunDivs() {
        let runDivs = $("div.runDiv");

        // Assign update and init functions to each runDiv
        let functions = {
            runDiv0: { initialise: initForRunDiv0, update: updateForRunDiv0 },
            runDiv1: { initialise: initForRunDiv1, update: updateForRunDiv1 },
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
        let trace = plotlyFactory.createTrace("markers", "scatter3d", init, init, init);

        let data = [trace];
        let layout = plotlyFactory.create3DColourGraphLayout();

        return Plotly.plot(graphDiv, data, layout, { displayModeBar: false });
    }

    let edgesSystem1 = ConstantVelocitySystem("edges");
    function initForRunDiv1() {
        graphDiv = document.getElementById("graphDiv1");
        let systemTrace = edgesSystem1.getTrace();
        let trace = plotlyFactory.createTrace(
            "markers",
            "scatter3d",
            systemTrace.x,
            systemTrace.y,
            systemTrace.z,
            systemTrace.marker.color);

        let data = [trace];
        let layout = plotlyFactory.create3DColourGraphLayout();

        return Plotly.plot(graphDiv, data, layout, { displayModeBar: false });
    }

    let trajectory2 = Trajectory();

    function initForRunDiv2() {
        graphDiv = document.getElementById("graphDiv2");

        let trace = plotlyFactory.createTrace(
            "markers",
            "scatter3d",
            trajectory2.trajectory.map(p => p.x),
            trajectory2.trajectory.map(p => p.y),
            trajectory2.trajectory.map(p => p.z));

        let data = [trace];
        let layout = plotlyFactory.create3DColourGraphLayout();

        return Plotly.plot(graphDiv, data, layout, { displayModeBar: false });
    }

    //////////////////////
    // Update Functions //
    //////////////////////

    // Update the title colours bar to the supplied array of colours.
    // If none is provided, coloursData.titleBar.colours will be used unchanged.
    function updateTitleColourBar(arrayOfColours) {
        if (typeof arrayOfColours !== "undefined") {
            coloursData.titleBar.colours = arrayOfColours;
        }
        let controller = coloursData.canvasControllers["titleCanvas"];
        // x coordinate generating function
        let xcgf = i => i * coloursData.titleBar.segmentWidth;

        coloursData.titleBar.colours.forEach(
            (c, i) => controller.drawRect(xcgf(i), 0, coloursData.titleBar.segmentWidth, coloursData.titleBar.height, c));
    }

    // Update the background target colour to the colour the mouse moves to.
    function titleColourBarMouseMove(event) {
        // Get the index of the array we have moved to
        coloursData.titleBar.selected = Math.floor(event.offsetX / coloursData.titleBar.segmentWidth);
        backgroundColourController.change(coloursData.titleBar.colours[coloursData.titleBar.selected]);
    }

    // Reset the target background colour to it's original state.
    function titleColourBarMouseLeave(event) {
        backgroundColourController.reset();
    }

    // Update the title colour bar to a bunch of new random colours.
    function updateTitleColourBarToRandom(event) {
        updateTitleColourBar(coloursData.titleBar.colours.map(() => RandomColour()));
        // Also trigger a background colour update
        titleColourBarMouseMove(event);
    }

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

    function updateForRunDiv1() {
        let id = "graphDiv1";

        // Update positions.
        edgesSystem1.update();

        // Animate
        return plotlyFactory.updateGraph(id, edgesSystem1.getTrace());
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

    setUpCanvases();
    setUpTitleColourBar();
    setUpRunDivs();
    updateRecursive();
}
