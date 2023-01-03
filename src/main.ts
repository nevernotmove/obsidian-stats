import * as d3 from "d3";

// const url = 'https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json';
const url = 'community-plugin-stats.json';
d3.json(url).then(data => {
    console.log(data);
    // x axis should be versions
    // y axis should be downloads per version
    //data.select('obsidian-desmos');

    //const chart = d3.select("#chart");

    // Create SVG in container
    //let svg = d3.select(container).append("svg").style("width", containerWidth).style("height", containerHeight)
    //    .append("svg"); //append svg element inside #chart
});


