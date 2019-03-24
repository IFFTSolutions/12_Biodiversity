function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
    
  // Use `d3.json` to fetch the metadata for a sample
  
    d3.json(`/metadata/${sample}`).then(function (data) {
    console.log(data);

  // Use d3 to select the panel with id of `#sample-metadata`
    var panelBody = d3.select("#sample-metadata");

  // Use `.html("") to clear any existing metadata
    panelBody.html("")
  
    // Use `Object.entries` to add each key and value pair to the panel
  // Hint: Inside the loop, you will need to use d3 to append new
  // tags for each key-value in the metadata.
  //https://www.bram.us/2016/11/24/es6es2015-looping-over-an-object-with-keys-and-values/
    
    Object.entries(data).forEach(([key, value]) => {
    
    d3.select("#sample-metadata").append("p").text(`${key}: ${value}`);
      
    });
  
  
  // BONUS: Build the Gauge Chart
  buildGauge(data.WFREQ);





  
  });

}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then(function (data) {
    console.log(data);

    var trace_b = [{
      type: "scatter",
      mode: "markers",
      name: "Bubble Chart - Belly Button",
      text: data["otu_labels"],
      x: data["data.otu_ids"],
      y: data["sample_values"],
      marker: {
        color: data["otu_ids"],
        size: data["sample_values"],
      },
    }];

    var layout = {
      title: "Bubble Chart for Belly Button",
      xaxis: {
        title: "OTU ID",
      },

      yaxis: {
        title: "Value",
      }
    };


    var BUBBLE = document.getElementById("bubble");
    Plotly.newPlot(BUBBLE, trace_b, layout);
    //});

    // // @TODO: Use `d3.json` to fetch the sample data for the plots
    //d3.json(`/samples/${sample}`).then(function (p_data) {
    //console.log(p_data);

    var pie_values = data["sample_values"];
    var pie_labels = data["otu_ids"];
    var pie_htext = data["otu_labels"];

    console.log(pie_values);
    console.log(pie_labels);
    console.log(pie_htext);
    
    //https://dev.to/frugencefidel/10-javascript-array-methods-you-should-know-4lk3
    
    var pushArray = [];
    for (var j=0; j<data.sample_values.length; j++) {
      pushArray.push({
        "sample_values": data.sample_values[j],
        "otu_ids": data.otu_ids[j],
        "otu_labels": data.otu_labels[j]
      })
    }

    // Sort the data array using the greekSearchResults value
    var dataArraySorted = pushArray.sort((a, b) => parseFloat(a.sample_values) > parseFloat(b.sample_values) ? -1 : 1);
    //});

    // Slice the first 10 objects for plotting
    //data = data.slice(0, 10);

    var pie_data = [{
      type: "pie",
      text: dataArraySorted.map(row => row.otu_labels).slice(0, 10),
      labels: dataArraySorted.map(row => row.otu_ids).slice(0, 10),
      values: dataArraySorted.map(row => row.sample_values).slice(0, 10),
      "textinfo": "percent",
    }]

    //var pie_data = [pie_trace];

    var pie_layout = {
      title: "Top Ten Samples",
    };

    var PIE = document.getElementById("pie");
    Plotly.newPlot(PIE, pie_data, pie_layout);

  });


}    // end bracket


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
