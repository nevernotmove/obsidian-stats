<script lang="ts">
    import pluginDownloadsOverTime from './pluginDownloadsOverTime';
    import {onMount} from "svelte";
    import type {ChartDefaults} from '../ChartDefaults';
    
    export let chartDefaults: ChartDefaults;
    
    async function lazyLoadThenDisplay() {
        await import('../../../public/downloads.json').then(json => {
            pluginDownloadsOverTime(json.default, chartDefaults);
        })
    }

    onMount(() => {
        lazyLoadThenDisplay()
    });
</script>

<canvas id="chart"></canvas>
