import { Chart } from 'chart.js';
import { formatNumberWithKiloMega } from '../util';
import type { ChartData, TimeUnit } from 'chart.js/dist/types';
import 'chartjs-adapter-luxon';
import type { ChartDefaults } from './ChartDefaults';
import { lineChartDefaults } from './ChartDefaults';

function getTimeUnitForDataAmount(dataPoints: number) {
    let unit: TimeUnit = 'month';
    if (dataPoints < 50) unit = 'day';
    else if (dataPoints > 700) unit = 'year';
    return unit;
}

export default function lineChart(json: object, targetEl: HTMLCanvasElement): Chart {
    const defaults: ChartDefaults = lineChartDefaults();

    const labels = [];
    const data = [];
    for (const entry of Object.entries(json)) {
        const time = parseInt(entry[0] + '000');
        const downloads = entry[1];
        labels.push(time);
        data.push(downloads);
    }

    const pointSize = data.length < 2 ? 20 : 0;
    const pointHoverSize = pointSize == 0 ? 10 : pointSize * 2;

    const datasets = [
        {
            data: data,
            borderWidth: defaults.lineWidth,
            backgroundColor: defaults.fillColor,
            borderColor: defaults.lineColor,
            hoverBackgroundColor: defaults.fillColorHighlight,
            pointStyle: true,
            pointRadius: pointSize,
            pointHoverRadius: pointHoverSize,
            fill: true
        }
    ];

    const chartData: ChartData = {
        labels: labels,
        datasets: datasets
    };

    const unit = getTimeUnitForDataAmount(chartData.datasets[0].data.length);
    const bounds = chartData.datasets[0].data.length === 1 ? 'ticks' : 'data';
    const source = chartData.datasets[0].data.length === 2 ? 'labels' : 'auto';

    return new Chart(targetEl, {
        type: 'line',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    border: {
                        color: defaults.gridColor
                    },
                    grid: {
                        display: false
                    },
                    ticks: {
                        source: source,
                        font: {
                            size: defaults.fontSize
                        },
                        color: defaults.fontColor
                    },
                    type: 'time',
                    bounds: bounds,
                    time: {
                        unit: unit
                    }
                },
                y: {
                    border: {
                        display: false
                    },
                    beginAtZero: true,
                    grid: {
                        tickLength: 0,
                        color: defaults.gridColor
                    },
                    ticks: {
                        callback: formatNumberWithKiloMega,
                        font: {
                            size: defaults.fontSize
                        },
                        color: defaults.fontColor
                    }
                }
            },
            plugins: {
                tooltip: {
                    enabled: false
                },
                legend: {
                    display: false,
                    labels: {
                        color: defaults.fontColor
                    }
                }
            }
        }
    });
}
