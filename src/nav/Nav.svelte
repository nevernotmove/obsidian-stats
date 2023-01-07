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
        padding: .3em .6em;
        background-color: var(--color2);
        color: var(--color1);
        border: 1px solid var(--color1);
        cursor: pointer;
        border-radius: .2em;
    }
    button:hover {
        background-color: var(--color4);
    }
</style>
