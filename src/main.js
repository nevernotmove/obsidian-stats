const getStats = async (callback) => {
    return await fetch('https://raw.githubusercontent.com/obsidianmd/obsidian-releases/master/community-plugin-stats.json')
        .then(response => response.json())
        .then(data => callback(data));
}

const displayStats = (json) => {
    console.log(json);
}

getStats(displayStats);