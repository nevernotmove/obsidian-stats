import { Chart } from 'chart.js';
import { formatNumberWithKiloMega } from '../util';
import type { ChartDefaults } from './ChartDefaults';
import { barChartDefaults } from './ChartDefaults';
import type { ActiveElement, ChartData, ChartEvent } from 'chart.js/dist/types';
import type { NavigateFn } from 'svelte-navigator';
import type { PluginInfo } from '../cache';
import { getPluginIdForName } from '../cache';

let navigate: NavigateFn;
let highlighted = false;
let targetEl: HTMLCanvasElement;
let chart: Chart;
const defaults: ChartDefaults = barChartDefaults();

function removeHighlighting() {
    if (!highlighted) return;
    chart.config.options.scales.x.ticks.color = defaults.fontColor;
    targetEl.style.cursor = 'default';
    chart.update();
    highlighted = false;
}

const onHover = (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
    if (elements.length === 0) {
        removeHighlighting();
        return;
    }
    if (highlighted) {
        return;
    }
    targetEl.style.cursor = 'pointer';
    const numBars = chart.data.datasets[0].data.length;
    const colors: string[] = new Array<string>(numBars);
    colors.fill(defaults.fontColor);
    const index = elements[0].index;
    colors[index] = defaults.fontColorHighlight;
    chart.config.options.scales.x.ticks.color = colors;
    chart.update();
    highlighted = true;
};

export function barChart(plugins: PluginInfo[], targetCanvas: HTMLCanvasElement, navigationFunc: NavigateFn): Chart {
    navigate = navigationFunc;
    targetEl = targetCanvas;

    // TODO Remove listener
    targetEl.addEventListener('mouseleave', (ev: MouseEvent) => {
        removeHighlighting();
    });

    const labels: string[] = [];
    const data = [];
    const sorted: PluginInfo[] = plugins.sort((a, b) => (b.downloads - a.downloads));
    //const sorted = Object.entries(plugins).sort(([, a], [, b]) => b - a);
    const width: number = targetEl.parentElement.clientWidth;
    const max = width && width > 0 ? Math.floor(width / 50) : 5;

    for (let i = 0; i < sorted.length && i < max; i++) {
        labels.push(sorted[i].name);
        data.push(sorted[i].downloads);
    }

    const datasets = [
        {
            data: data,
            borderWidth: defaults.lineWidth,
            borderColor: defaults.lineColor,
            borderRadius: defaults.borderRadius,
            backgroundColor: defaults.fillColor,
            hoverBackgroundColor: defaults.fillColorHighlight,
            hoverBorderColor: defaults.lineColorHighlight
        }
    ];

    const barChartData: ChartData = {
        labels: labels,
        datasets: datasets
    };

    chart = new Chart(targetEl, {
        type: 'bar',
        data: barChartData,
        options: {
            hover: {
                //mode: 'index',
                //intersect: true
            },
            onHover: onHover,
            onClick: handleClickOnChart,
            events: ['mousemove', 'mouseenter', 'mouseout', 'click', 'touchstart', 'touchmove'],
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
                        font: {
                            size: defaults.fontSize
                        },
                        color: defaults.fontColor
                    }
                },
                y: {
                    border: {
                        display: false
                    },
                    beginAtZero: true,
                    ticks: {
                        callback: formatNumberWithKiloMega,
                        font: {
                            size: defaults.fontSize
                        },
                        color: defaults.fontColor
                    },
                    grid: {
                        tickLength: 0,
                        color: defaults.gridColor
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

    return chart;
}

const handleClickOnChart = (event: ChartEvent, elements: ActiveElement[], chart: Chart) => {
    if (elements.length === 0) return;
    const index = elements[0].index;
    const label = chart.data.labels[index];
    const id = getPluginIdForName(label.toString());
    if (id == null) return; // TODO Show or log error 
    navigate('/plugin/' + id);
};
