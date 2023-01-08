import type {ChartData} from 'chart.js/dist/types';
import {Chart} from 'chart.js';
import 'chartjs-adapter-luxon';

const prepareData = (json: object): ChartData => {
    const pluginName = 'chord-lyrics';
    const labels = [];
    const data = [];
    const map = new Map(Object.entries(json));
    const plugin = map.get(pluginName);
    for (const entry of Object.entries(plugin)) {
        const time = parseInt(entry[0] + "000");
        const downloads = entry[1];
        labels.push(time);
        data.push(downloads);
    }
    const label = "# of downloads for " + pluginName;
    const datasets = [{
        label: label,
        data: data,
        borderWidth: 2,
        backgroundColor: 'rgb(139, 108, 239, .7)',
        hoverBackgroundColor: 'rgb(139, 108, 239, 1)',
        pointStyle: true,
        pointRadius: 0,
        pointHoverRadius: 10,
        fill: true,
    }];
    const res = {
        labels: labels,
        datasets: datasets
    };
    return res as ChartData;
};

const displayChart = (data: ChartData) => {
    const ctx = document.getElementById('chart') as HTMLCanvasElement;

    new Chart(ctx, {
        type: 'line',
        data: data,
        options: {
            
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
                    },
                    type: 'time', 
                    time: {
                        unit: "day"
                    }
                },
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#3F3F3F',
                    }
                }
            }
        }
    });
};

export default function pluginDownloadsOverTime(json: object): void {
    const lineChartData: ChartData = prepareData(json);
    displayChart(lineChartData);
}