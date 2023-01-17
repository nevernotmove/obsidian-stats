<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { getData } from '../util/cache';
    import { randomId } from '../util/util';
    import Nav from './Nav.svelte';
    import { Chart } from 'chart.js';
    import barChart from '../util/chart/barChart';

    const id = randomId();
    let chart: Chart;

    onMount(() => {
        getData('total-downloads.json', (data: object) => {
            if (data) {
                if (chart) chart.destroy();
                const targetEl = document.getElementById(id) as HTMLCanvasElement;
                if (targetEl) chart = barChart(data, targetEl);
            }
        });
    });

    onDestroy(() => {
        if (chart) chart.destroy();
    });
</script>

<Nav />
<div>
    <canvas {id} />
</div>

<style>
    div {
        height: 100%;
    }

    canvas {
        height: 100%;
    }
</style>
