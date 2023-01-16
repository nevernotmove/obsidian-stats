<script lang="ts">
    import {Chart} from 'chart.js';
    import {onDestroy, onMount} from 'svelte';
    import {formatNumberWithKiloMega, randomId} from '../util/util';
    import {getData} from '../util/cache';
    import Nav from './Nav.svelte';
    import type {ChartData, TimeUnit} from 'chart.js/dist/types';
    import 'chartjs-adapter-luxon';
    import type {ChartDefaults} from '../util/ChartDefaults';
    import {chartDefaults} from '../util/ChartDefaults';

    const id = randomId();
    let pluginData: object;
    let chart: Chart;
    let loading = false;
    export let activePlugin: string = null;
    $: if (activePlugin !== null) load(activePlugin);

    $: if (pluginData) {
        if (chart) chart.destroy();
        const targetEl = document.getElementById(id) as HTMLCanvasElement;
        if (targetEl) chart = drawLineChart(pluginData, targetEl);
    }

    onMount(() => {
        load(activePlugin);
    });

    onDestroy(() => {
        if (chart) chart.destroy();
    });

    function load(pluginName: string) {
        if (loading) return;
        loading = true;
        const path = `plugins/${pluginName}.json`;
        getData(path, (data: object) => {
            if (data) {
                pluginData = data;
                loading = false;
            } else {
                // TODO Show error
            }
        });
    }

    function drawLineChart(json: object, targetEl: HTMLCanvasElement): Chart {
        const defaults: ChartDefaults = chartDefaults();
        const labels = [];
        const data = [];
        for (const entry of Object.entries(json)) {
            const time = parseInt(entry[0] + "000");
            const downloads = entry[1];
            labels.push(time);
            data.push(downloads);
        }
        const pointSize = data.length < 2 ? 20 : 0;
        const pointHoverSize = pointSize == 0 ? 10 : pointSize * 2;
        const label = "downloads";
        const datasets = [{
            label: label,
            data: data,
            borderWidth: defaults.lineWidth,
            backgroundColor: defaults.fillColor,
            borderColor: defaults.lineColor,
            hoverBackgroundColor: defaults.fillColorHighlight,
            pointStyle: true,
            pointRadius: pointSize,
            pointHoverRadius: pointHoverSize,
            fill: true,
        }];
        const lineChartData: ChartData = {
            labels: labels,
            datasets: datasets
        };

        const dataPoints = lineChartData.datasets[0].data.length;
        let unit: TimeUnit = 'month';
        if (dataPoints < 50) unit = 'day';
        else if (dataPoints > 700) unit = 'year';

        const bounds = lineChartData.datasets[0].data.length == 1 ? 'ticks' : 'data';

        return new Chart(targetEl, {
            type: 'line',
            data: lineChartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        border: {
                            color: defaults.gridColor,
                        },
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: defaults.fontSize,
                            },
                            color: defaults.fontColor,
                        },
                        type: 'time',
                        bounds: bounds,
                        time: {
                            unit: unit,
                        }
                    },
                    y: {
                        border: {
                            display: false,
                        },
                        beginAtZero: true,
                        grid: {
                            tickLength: 0,
                            color: defaults.gridColor,
                        },
                        ticks: {
                            callback: formatNumberWithKiloMega,
                            font: {
                                size: defaults.fontSize,
                            },
                            color: defaults.fontColor,
                        },
                    }
                },
                plugins: {
                    tooltip: {
                        enabled: false,
                    },
                    legend: {
                        display: false,
                        labels: {
                            color: defaults.fontColor,
                        },
                    },
                },
            }
        });
    }
</script>

<Nav/>
<div>
    <canvas id={id}></canvas>
</div>

<style>
    div {
        height: 100%;
    }
</style>