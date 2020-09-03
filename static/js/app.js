d3.json("samples.json").then((data) => {
    var names = data.names;
    d3.select('#selDataset').selectAll('option').data(names).enter().append('option').text(function (data) {
        return data;
    });
});

function optionChanged(value) {
    console.log(value);
    d3.json("samples.json").then((data) => {
        var samp_val = data.samples;

        var sampleValues = [];
        var otuIds = [];
        var otuLabels = [];
        var otuIdsString = [];

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

        var wash = 0;
        var Metadata=data.metadata;
        Metadata.forEach(person => {
            if (person.id ==value){
                var demographics = Object.entries(person);
                console.log(`in if: ${demographics}`);
                wash = demographics[6][1];
                d3.selectAll('p').remove();
                d3.select('#sample-metadata').selectAll('p').data(demographics).enter().append('p').text(d=>{
                    return `${d[0]}: ${d[1]}`;
                });
            }
        }); 
        console.log(wash);

        // var gaugeTrace = {
        //     value: wash,
        //     type: 'indicator',
        //     mode: 'gauge+number+needle',
        //     domain: {
        //         x: [0,1],
        //         y: [0,1]
        //     }
            // gauge: {
            //     axis: {range: [null, 9]},
            //     steps: [
            //         range
            //     ]
            // }
        // }
        var traceGauge = {
            type: 'pie',
            showlegend: false,
            hole: 0.4,
            rotation: 90,
            values: [ 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81/9, 81],
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
          var radius = 0.6
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
            title: 'Chart',
            xaxis: {visible: false, range: [-1, 1]},
            yaxis: {visible: false, range: [-1, 1]}
          }
      
          var dataGauge = [traceGauge]
        // gaugeData = [gaugeTrace];

        // var gaugeLayout = {
        //     width: 600, 
        //     height: 500
        //     // margin: { t: 0, b: 0 }
        // }

        // Plotly.newPlot('gauge', gaugeData, gaugeLayout);
        Plotly.newPlot('gauge', dataGauge, gaugeLayout);

        var trace1 = {
            x: sampleValues.slice(0, 10).reverse(),
            y: otuIdsString.slice(0, 10).reverse(),
            orientation: 'h',
            type: 'bar',
            text: otuLabels.slice(0, 10).reverse()
        }
        var data1 = [trace1];

        var layout = {

        }

        Plotly.newPlot('bar', data1, layout);

        // Bubble Plot
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
            showlegend: false
        }

        Plotly.newPlot('bubble', data2, layout2);
    });
}
