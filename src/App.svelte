<script lang="ts">
    import Nav from './Nav.svelte';
    import {onMount} from 'svelte';
    import ChartView from './ChartView.svelte';

    onMount(() => {
        //pluginDownloadsOverTime(json)
        //mostDownloadedPlugins(json2);
    })
</script>

<main>
    <Nav/>
    <ChartView/>
</main>

