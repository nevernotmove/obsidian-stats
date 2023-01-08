<script lang="ts">
    import Nav from '../nav/Nav.svelte';
    import ChartView from '../chart/ChartView.svelte';
    import {ChartType} from '../chart/ChartType';

    let activeChart: ChartType = ChartType.MostDownloaded;
</script>

<main>
    <Nav bind:activeChart/>
    <ChartView {activeChart}/>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        row-gap: 1em;
        height: 100%;
        padding: 2em;
    }
</style>

