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
    }
    button{
    }
</style>
