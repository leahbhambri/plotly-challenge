// id="selDataset" in the index.html
var selection = d3.select("#selDataset")

d3.json("samples.json").then((importData) => {

  var subject_ids = importData.names;

  subject_ids.forEach((id) => {
    selection
      .append("option")
      .property("value", id)
      .text(id)
      .classed("option-list-item",true);
  });

  // Initialize the dashboard to start at 940
  optionChanged(subject_ids[0]);
});

function optionChanged(subject_id) {
  d3.json("samples.json").then((data) => {
    var sample_data = data.samples
    var results = sample_data.filter(object => object.id ===subject_id)
    var result = results[0]

    var otu_ids = result.otu_ids.slice(0, 10).reverse();
    var otu_labels = result.otu_labels.slice(0, 10).reverse();
    var sample_values = result.sample_values.slice(0, 10).reverse();

    var otu_ids_label = otu_ids.map(otuID => `OTU ${otuID}`);

// create bar chart
    var bar_trace = {
      y: otu_ids_label,
      x: sample_values,
      text: otu_labels,
      type: "bar",
      orientation: "h",
    };

    var data = [bar_trace];

    var bar_layout = {
      title: `Top 10 OTUs for Subject ID: ${subject_id}` ,
      yaxis: { title: "OTU ID" },
      xaxis: { title: "SAMPLE VALUES" }
    };

    Plotly.newPlot("bar", data, bar_layout);
// create bubble chart
    var bubble_chart_trace = {
      x: otu_ids,
      y: sample_values,
      text: otu_labels,
      mode: "markers",
      marker: {
        size: sample_values,
        color: otu_ids
      }
    };

    var data = [bubble_chart_trace];

    var bubble_layout = {
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      Yaxis: { title: "SAMPLE VALUES" },
      margin: { t: 20 }
    };

    Plotly.newPlot("bubble", data, bubble_layout);

// create demographic information list
  d3.json("../samples.json").then((data) => {
    var metadata = data.metadata;
    var results = metadata.filter(metadataObj => metadataObj.id == subject_id);
    var result = results[0];

    var fig = d3.select("#sample-metadata");

    fig.html("");

    Object.entries(results[0]).forEach(([key, value]) => {
      fig.append("h6").text(`${key}: ${value}`);
    })
  })
  });

}
