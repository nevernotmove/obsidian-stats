import {ChartData} from 'chart.js/dist/types';
import {Chart} from 'chart.js';

const prepareData = (json: object): ChartData => {
    const labels: string[] = [];
    const data = [];
    const sortable = Object.entries(json)
        .sort(([, a], [, b]) => b.downloads - a.downloads)
    const max = 30;
    console.log(sortable)
    for (let i = 0; i < sortable.length && i < max; i++) {
        labels.push(sortable[i][0]);
        data.push(sortable[i][1].downloads);
    }
    // for (const [pluginName, pluginData] of Object.entries(json)) {
    //     count++;
    //     labels.push(pluginName);
    //     data.push(pluginData.downloads);
    //     if (count >= max) break;
    // }
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

export default function mostDownloaded(json: object): void {
    const barChartData: ChartData = prepareData(json);
    displayChart(barChartData);
}