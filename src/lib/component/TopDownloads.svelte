<script lang="ts">
    import { onDestroy, onMount } from 'svelte';
    import { getPlugins } from '../util/cache';
    import type { PluginInfo } from '../util/cache';
    import { randomId } from '../util/util';
    import Nav from './Nav.svelte';
    import { Chart } from 'chart.js';
    import { barChart } from '../util/chart/barChart';
    import { useNavigate } from 'svelte-navigator';

    const id = randomId();
    let chart: Chart;
    const navigate  = useNavigate();

    onMount(() => {
        getPlugins((plugins: PluginInfo[]) => {
            if (plugins) {
                if (chart) chart.destroy();
                const targetEl = document.getElementById(id) as HTMLCanvasElement;
                if (targetEl) chart = barChart(plugins, targetEl, navigate);
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
</style>
