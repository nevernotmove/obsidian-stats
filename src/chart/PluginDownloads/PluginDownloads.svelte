<script lang="ts">
    import pluginDownloadsOverTime from './pluginDownloadsOverTime';
    import {onMount} from "svelte";
    import type {ChartDefaults} from '../ChartDefaults';
    
    export let chartDefaults: ChartDefaults;
    
    async function lazyLoadThenDisplay() {
        const pluginName = 'obsidian-jtab';
        await import('../../../public/plugins/' + pluginName).then(json => {
            pluginDownloadsOverTime(json.default, pluginName, chartDefaults);
        })
    }

    onMount(() => {
        lazyLoadThenDisplay()
    });
</script>

<canvas id="chart"></canvas>
