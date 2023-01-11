<script lang="ts">
    import mostDownloadedPlugins from './mostDownloadedPlugins';
    import {onMount} from "svelte";
    import type {ChartDefaults} from '../ChartDefaults';

    export let chartDefaults: ChartDefaults;

    async function lazyLoadThenDisplay() {
        fetch('total-downloads.json')
            .then((r) => r.json())
            .then((data) => {
                mostDownloadedPlugins(data, chartDefaults);
            });
    }

    onMount(() => {
        lazyLoadThenDisplay();
    });
</script>

<canvas id="chart"></canvas>