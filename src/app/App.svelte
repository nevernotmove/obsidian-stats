<script lang="ts">
    import Nav from '../nav/Nav.svelte';
    import ChartView from '../chart/ChartView.svelte';

    let activeChart = "most-downloaded"
    $: console.log("App: switching to", activeChart);
    
</script>

<main>
    <Nav bind:activeChart/>
    <ChartView {activeChart}/>
</main>

