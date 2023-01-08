import type {ChartData} from 'chart.js/dist/types';
import {Chart} from 'chart.js';
import type {ChartDefaults} from '../ChartDefaults';

const prepareData = (json: object, defaults: ChartDefaults): ChartData => {
    const labels: string[] = [];
    const data = [];
    const sortable = Object.entries(json)
        .sort(([, a], [, b]) => b.downloads - a.downloads)
    const max = 30;
    for (let i = 0; i < sortable.length && i < max; i++) {
        labels.push(sortable[i][0]);
        data.push(sortable[i][1].downloads);
    }
    const label = "# of downloads";
    const datasets = [{
        label: label,
        data: data,
        borderWidth: defaults.borderWidth,
        borderColor: defaults.borderColor,
        borderRadius: 2,
        backgroundColor: defaults.backgroundColor,
        hoverBackgroundColor: defaults.hoverBackgroundColor,
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
        type: 'bar',
        data: data,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: {
                        display: false
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

export default function mostDownloadedPlugins(json: object, chartDefaults: ChartDefaults): void {
    const barChartData: ChartData = prepareData(json, chartDefaults);
    displayChart(barChartData);
}