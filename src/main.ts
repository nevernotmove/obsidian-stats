import {Chart, ChartData, registerables} from 'chart.js';
import json from '../static/community-plugin-stats.json';

Chart.register(...registerables);

const displayChart = (data: ChartData) => {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;

    new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
    let count = 0, max = 30;
    for (const [pluginName, pluginData] of Object.entries(json)) {
        count++;
        labels.push(pluginName);
        data.push(pluginData.downloads);
        if (count >= max) break;
    }
    const label = "# of downloads";
    const datasets = [{
        label: label,
        data: data,
        borderWidth: 0,
        borderRadius: 2,
        backgroundColor: 'rgba(0, 0, 255, 0.2)',
        hoverBackgroundColor: 'rgba(0, 0, 255, 0.4)',
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