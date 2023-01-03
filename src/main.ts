import * as d3 from "d3";

const url = 'https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json';
d3.json(url).then(data => {
    console.log(data);
});


