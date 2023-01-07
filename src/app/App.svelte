<script lang="ts">
    import Nav from '../nav/Nav.svelte';
    import ChartView from '../chart/ChartView.svelte';
    import {ChartType} from '../chart/ChartType';

    let activeChart = ChartType.MostDownloaded;
    $: console.log("App: switching to", activeChart);
    
</script>

<main>
    <Nav bind:activeChart/>
    <ChartView {activeChart}/>
</main>

