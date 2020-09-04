// Load the dropdown list with the available data sets
d3.json("samples.json").then((data) => {
    var names = data.names;
    d3.select('#selDataset').selectAll('option').data(names).enter().append('option').text(function (data) {
        return data;
    });
});

// this runs when the user selects a value from the dropdown list
function optionChanged(value) {
    // grab the sample values
    d3.json("samples.json").then((data) => {
        var samp_val = data.samples;

        var sampleValues = [];
        var otuIds = [];
        var otuLabels = [];
        var otuIdsString = [];

        // loop through the samples to find the one that matches the user chosen value
        samp_val.forEach(person => {
            if (person.id === value) {
                sampleValues = person.sample_values;
                otuIds = person.otu_ids;
                otuLabels = person.otu_labels;
                otuIds.map(otu => {
                    otuIdsString.push(`OTU ${otu}`);
                });
            }
        });

        // pull the metadata and populate the Demographics table
        var wash = 0;
        var Metadata=data.metadata;
        Metadata.forEach(person => {
            if (person.id ==value){
                var demographics = Object.entries(person);
                wash = demographics[6][1];
                d3.selectAll('p').remove();
                d3.select('#sample-metadata').selectAll('p').data(demographics).enter().append('p').text(d=>{
                    return `${d[0]}: ${d[1]}`;
                });
            }
        }); 

        // ***********************************************
        // Create the Gauge chart displaying the wash data
        // ***********************************************
        var traceGauge = {
            type: 'pie',
            showlegend: false,
            hole: 0.4,
            rotation: 90,
            values: [ 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
            text: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
            direction: 'clockwise',
            textinfo: 'text',
            textposition: 'inside',
            marker: {
              colors: ['','','','','','','','','','white'],
              labels: ['0-1','1-2','2-3','3-4','4-5','5-6','6-7','7-8','8-9'],
              hoverinfo: 'label'
            }
          }
      
          // needle
          var degrees = (180/9) * wash
          var radius = 0.5
          var radians = degrees * Math.PI / 180
          var x = -1 * radius * Math.cos(radians)
          var y = radius * Math.sin(radians)
      
          var gaugeLayout = {
            shapes: [{
              type: 'line',
              x0: 0.5,
              y0: 0.5,
              x1: x + 0.5,
              y1: y + 0.5,
              line: {
                color: 'black',
                width: 3
              }
            }],
            title: 'Wash Frequency Chart',
            xaxis: {visible: false, range: [-1, 1]},
            yaxis: {visible: false, range: [-1, 1]}
          }
      
          var dataGauge = [traceGauge]

          Plotly.newPlot('gauge', dataGauge, gaugeLayout);

        // ***********************************************************
        // Create the horizontal bar chart with the chosen sample data
        // ***********************************************************
        var trace1 = {
            x: sampleValues.slice(0, 10).reverse(),
            y: otuIdsString.slice(0, 10).reverse(),
            orientation: 'h',
            type: 'bar',
            text: otuLabels.slice(0, 10).reverse()
        }
        var data1 = [trace1];

        var layout = {
            title: 'Top Ten Bacteria Present'
        }

        Plotly.newPlot('bar', data1, layout);

        // **********************
        // Create the Bubble Plot
        // **********************
        var trace2 = {
            x: otuIds,
            y: sampleValues,
            text: otuLabels,
            mode: 'markers',
            marker: {
                size: sampleValues,
                color: otuIds
            }
        }
        var data2 = [trace2];
        var layout2 = {
            xaxis: {
                title: 'OTU IDs'
            },
            showlegend: false,
            title: "All Bacteria Present"
        }

        Plotly.newPlot('bubble', data2, layout2);
    });
}
