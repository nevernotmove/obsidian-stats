<script lang="ts">
    import pluginDownloadsOverTime from './pluginDownloadsOverTime';
    import {onMount} from "svelte";
    import type {ChartDefaults} from '../ChartDefaults';
    import {getData} from '../../cache';

    export let chartDefaults: ChartDefaults;

    onMount(() => {
        const pluginName = 'dataview';
        const path = `plugins/${pluginName}.json`;
        getData(path, (data: object) => {
            pluginDownloadsOverTime(data, pluginName, chartDefaults);
        });
    });
</script>

<canvas id="chart"></canvas>
