var coloursGlobal = {};

window.onload = function () {
    setUpRunDivs();
    test();
}

function setUpRunDivs() {
    //$("div.runDiv").each((i, e) => coloursGlobal[e.id] = {});
    //$("div.runDiv").each((i, e) => coloursGlobal[e.id]["run"] = false);
    $("div.runDiv")
        .each((i, e) => coloursGlobal[e.id] = {})
        .each((i, e) => coloursGlobal[e.id]["run"] = false)
        .mouseenter(function (eventData) { coloursGlobal[eventData.toElement.id].run = true; })
        .mouseleave(function (eventData) { coloursGlobal[eventData.fromElement.id].run = false; })
  //.mouseenter(function () {
  //    n += 1;
  //    $(this).find("span").text("mouse enter x " + n);
  //})
  //.mouseleave(function () {
  //    $(this).find("span").text("mouse leave");
  //});
}

function test() {
    graphDiv = document.getElementById("graphDiv0");

    let init = [];
    for (var i = 0; i < 100; i++) { init[i] = 126;}
    var trace = {
        x: init,
        y: init,
        z: init,
        mode: 'markers',
        marker: {
            size: 6,
            //line: {
            //    color: 'rgba(217, 217, 217, 0)',
            //    width: 0.5
            //},
            opacity: 0.8
        },
        type: 'scatter3d'
    };

    var data = [trace];

    let axisInfo = {
        //showaxeslabels: false,
        showticklabels: false,
        //title: "",
        zeroline: true,
        showline: false,
        showgrid: false,
        type: "linear",
        range: [0,255]

    }
    // see https://plot.ly/javascript/reference/#layout-scene
    let scene = {
        xaxis: axisInfo,
        yaxis: axisInfo,
        zaxis: axisInfo,
        camera: { eye: {x: 0.1, y: 2.5, z: 0.1}}

    }

    var layout = {
        scene: scene,
        showlegend: false,
        autosize: true,
        margin: { t: 0, l: 0, r: 0, b:0 }
    };
    Plotly.plot(graphDiv, data, layout, { displayModeBar: false }).then(function () { start(graphDiv, data, layout); });
}

function start(graphDiv, data, layout) {
    //setInterval(function () { update(graphDiv, data, layout); }, 16);
    updateRecursive(graphDiv, data, layout);
}

function updateRecursive(graphDiv, data, layout) {
    if (coloursGlobal["runDiv0"].run) {
        update(graphDiv, data, layout);
    }
    setTimeout(function () {
        updateRecursive(graphDiv, data, layout);
    }, 16);
}

function update(graphDiv, data, layout) {
    let trace = data[0];

    let move = A => A.map(a => a + (Math.random() * 20) - 10);
    let limit = A => A.map(function(a) {
        if (a > 255) a = 255;
        if (a < 0) a = 0;
        return a;
    });

    trace.x = limit(move(trace.x));
    trace.y = limit(move(trace.y));
    trace.z = limit(move(trace.z));

    trace.marker.color = trace.x.map(function (e, i) { return "rgba(" + trace.x[i] + ", " + trace.y[i] + ", " + trace.z[i] + ", 1)"; });

    data[0] = trace;
    
    Plotly.update(graphDiv, data, graphDiv.layout);
}