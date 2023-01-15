<script lang="ts">
    import {Chart} from 'chart.js';
    import {onDestroy, onMount} from 'svelte';
    import {getData} from '../cache';
    import {randomId} from '../util';
    import topDownloads from './topDownloads';

    const id = randomId();
    let chart: Chart;

    onMount(() => {
        getData('total-downloads.json', (data: object) => {
            if (data) {
                if (chart) chart.destroy();
                const targetEl = document.getElementById(id) as HTMLCanvasElement;
                if (targetEl) chart = topDownloads(data, targetEl);
            }
        });
    });

    onDestroy(() => {
        if (chart) chart.destroy();
    });
</script>

<div>
    <canvas id={id}></canvas>
</div>

<style>
    div {
        height: 100%;
    }
    canvas {
        height: 100%;
    }
</style>