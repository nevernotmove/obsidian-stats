<script lang="ts">
    import pluginDownloadsOverTime from './pluginDownloadsOverTime';
    import {onMount} from "svelte";
    import type {ChartDefaults} from '../ChartDefaults';

    export let chartDefaults: ChartDefaults;

    async function lazyLoadThenDisplay() {
        const pluginName = 'dataview';
        fetch(`plugins/${pluginName}.json`)
            .then((r) => r.json())
            .then((data) => {
                pluginDownloadsOverTime(data, pluginName, chartDefaults);
            });
    }

    onMount(() => {
        lazyLoadThenDisplay();
    });
</script>

<canvas id="chart"></canvas>
