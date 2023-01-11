<script lang="ts">
    import mostDownloadedPlugins from './mostDownloadedPlugins';
    import {onMount} from "svelte";
    import type {ChartDefaults} from '../ChartDefaults';
    import {getData} from '../../cache';
    
    export let chartDefaults: ChartDefaults;
    
    onMount(() => {
        getData('total-downloads.json', (data: object) => {
            mostDownloadedPlugins(data, chartDefaults);
        });
    });
</script>

<canvas id="chart"></canvas>