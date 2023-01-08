<script lang="ts">
    import mostDownloadedPlugins from './mostDownloadedPlugins';
    import {onMount} from "svelte";
    import type {ChartDefaults} from '../ChartDefaults';
    
    export let chartDefaults: ChartDefaults;
    
    async function lazyLoadThenDisplay() {
        await import('../../../public/community-plugin-stats.json').then(json => {
            mostDownloadedPlugins(json.default, chartDefaults);
        })
    }

    onMount(() => {
        lazyLoadThenDisplay()
    });
</script>

<canvas id="chart"></canvas>