<script lang="ts">
    import {Chart} from 'chart.js';
    import {onDestroy} from 'svelte';

    export let draw: (object, HTMLCanvasElement) => Chart;
    export let data: object = null;
    
    const id = Math.floor(Math.random() * 10000000).toString(10);
    let chart: Chart;

    $: if (data !== null) {
        if (chart) chart.destroy();
        console.log('Drawing top chart');
        const targetEl = document.getElementById(id) as HTMLCanvasElement;
        if (targetEl) chart = draw(data, targetEl);
    }

    onDestroy(() => {
        if (chart) chart.destroy();
    });
</script>

{#if data}
    <canvas id={id}></canvas>
{/if}