<script lang="ts">
    import {onMount} from "svelte";
    import type {ChartDefaults} from '../ChartDefaults';
    import {getData} from '../../cache';
    import pluginDownloadsOverTime from './pluginDownloadsOverTime';

    export let chartDefaults: ChartDefaults;

    onMount(() => {
        getData('total-downloads.json', (data: object) => {
            pluginDownloadsOverTime(data, chartDefaults);
        });
    });
</script>

<canvas id="chart"></canvas>
