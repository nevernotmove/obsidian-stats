import {Chart, ChartData, registerables} from 'chart.js';
import json from '../static/community-plugin-stats.json';

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

console.log(json);
const barChartData: ChartData = prepareData(json);
displayChart(barChartData);

export {};