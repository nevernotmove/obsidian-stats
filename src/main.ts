import {Chart, ChartData, registerables} from 'chart.js';

const example: object = {
    labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
    datasets: [{
        label: '# of Downloads',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
    }]
};

const json: object = {
    "nldates-obsidian": {
        "0.3.2": 735,
        "0.3.1": 2476,
        "0.3.0": 137,
        "0.2.6": 242,
        "0.2.5": 109,
        "0.2.4": 130,
        "0.2.3": 99,
        "downloads": 154114,
        "0.3.3": 2396,
        "0.4.0": 3068,
        "0.4.1": 1231,
        "0.4.2": 1008,
        "0.4.3": 3935,
        "0.5.0": 3973,
        "0.5.1": 761,
        "0.5.2": 31210,
        "0.2.2": 8,
        "0.2.1": 8,
        "0.6.0": 15982,
        "0.6.1": 86606,
        "updated": 1644028529000
    },
    "hotkeysplus-obsidian": {
        "0.2.4": 1388,
        "0.2.3": 29,
        "0.2.1": 1243,
        "downloads": 56469,
        "0.2.5": 21369,
        "0.2.7": 32254,
        "0.2.6": 186,
        "updated": 1639000981000
    }
};

Chart.register(...registerables);

const displayChart = (data: ChartData) => {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};

const prepareData = (json: object): ChartData => {
    //const labels: string[] = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'];
    //const data = [12, 19, 3, 5, 2, 3];
    const labels: string[] = [];
    const data = [];
    for (const [pluginName, pluginData] of Object.entries(json)) {
        labels.push(pluginName);
        data.push(pluginData.downloads);
    }
    const label = "# of downloads";
    const borderWidth: number = 1;
    const datasets = [{
        label: label,
        data: data,
        borderWidth: borderWidth

    }];
    const res = {
        labels: labels,
        datasets: datasets
    };
    return res as ChartData;
};

const barChartData: ChartData = prepareData(json);
displayChart(barChartData);

export {};