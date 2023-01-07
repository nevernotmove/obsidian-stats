<script lang="ts">
    import {ChartType} from "../chart/ChartType";

    export let activeChart = ChartType.MostDownloaded;
</script>

<nav>
    <button on:click={() => activeChart = ChartType.MostDownloaded}>Most downloaded</button>
    <button on:click={() => activeChart = ChartType.PluginDownloads}>Plugin downloads</button>
</nav>

<style>
    nav {
        justify-content: center;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1em;
    }
    button{
        padding: .2em .5em;
    }
</style>
