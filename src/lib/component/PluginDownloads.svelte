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

    console.log("init");
    
    const id = randomId();
    let pluginData: object;
    let chart: Chart;
    let loading = false;
    export let activePlugin: string = null;
    $: if (activePlugin !== null) load(activePlugin); 

    $: if (pluginData) {
        console.log("react");
        if (chart) chart.destroy();
        const targetEl = document.getElementById(id) as HTMLCanvasElement;
        if (targetEl) chart = pluginDownloads(pluginData, targetEl);
    }

    function load(pluginName: string) {
        if (loading) return;
        loading = true;
        console.log("load");
        const path = `plugins/${pluginName}.json`;
        getData(path, (data: object) => {
            if (data) {
                console.log("got data");
                pluginData = data;
                loading = false;
            } else {
                // TODO Show error
            }
        });
    }
    
    onMount(() => {
        console.log("mount");
        load(activePlugin);
    });

    onDestroy(() => {
        if (chart) chart.destroy();
    });

    const prepareData = (json: object): ChartData => {
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
        const pointHoverSize = pointSize  == 0 ? 10 : pointSize * 2;
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
        const res = {
            labels: labels,
            datasets: datasets
        };
        return res as ChartData;
    };

    const displayChart = (data: ChartData, targetEl: HTMLCanvasElement) => {
        const defaults: ChartDefaults = chartDefaults();

        const dataPoints = data.datasets[0].data.length;
        let unit: TimeUnit = 'month';
        if (dataPoints < 50) unit = 'day';
        else if (dataPoints > 700) unit = 'year';

        const bounds = data.datasets[0].data.length == 1 ? 'ticks' : 'data';

        return new Chart(targetEl, {
            type: 'line',
            data: data,
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
                            // displayFormats: {
                            //     'millisecond': 'MMM DD',
                            //     'second': 'MMM DD',
                            //     'minute': 'MMM DD',
                            //     'hour': 'MMM DD',
                            //     'day': 'MMM DD',
                            //     'week': 'MMM DD',
                            //     'month': 'MMM DD',
                            //     'quarter': 'MMM DD',
                            //     'year': 'MMM DD',
                            // }
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
    };

    function pluginDownloads(json: object, targetEl: HTMLCanvasElement): Chart {
        const lineChartData: ChartData = prepareData(json);
        return displayChart(lineChartData, targetEl);
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