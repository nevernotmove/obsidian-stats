<script lang="ts">
    import Nav from '../nav/Nav.svelte';
    import {onMount} from 'svelte';
    import ChartView from '../chart/ChartView.svelte';

    onMount(() => {
        //pluginDownloadsOverTime(json)
        //mostDownloadedPlugins(json2);
    })
</script>

<main>
    <Nav/>
    <ChartView/>
</main>

