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

        var gaugeTrace = {
            value: wash,
            type: 'indicator',
            mode: 'gauge+number',
            domain: {
                x: [0,1],
                y: [0,1]
            }
            // gauge: {
            //     axis: {range: [null, 9]},
            //     steps: [
            //         range
            //     ]
            // }
        }

        gaugeData = [gaugeTrace];

        var gaugeLayout = {
            width: 600, 
            height: 500
            // margin: { t: 0, b: 0 }
        }

        Plotly.newPlot('gauge', gaugeData, gaugeLayout);

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
