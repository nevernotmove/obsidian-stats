<script>
    import {ChartType} from "../chart/ChartType";

    export let activeChart = ChartType.MostDownloaded;
    $: console.log("Nav: switching to", activeChart)
</script>

<nav>
    <button on:click={() => activeChart = ChartType.MostDownloaded}>Most downloaded</button>
    <button on:click={() => activeChart = ChartType.PluginDownloads}>Plugin downloads</button>
</nav>

<style>
    nav {
    }
    button{
    }
</style>
