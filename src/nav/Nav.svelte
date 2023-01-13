<script lang="ts">
    import {Link} from 'svelte-navigator';
    import {onMount} from "svelte";
    import {Chart} from 'chart.js';
    import {getData} from '../cache';
    import Logo from '../Logo.svelte';
    import SearchBar from '../chart/PluginDownloads/SearchBar.svelte';

    let searchText: string;
    let plugins: object;
    let error: boolean = false;
    let chart: Chart;

    onMount(() => {
        getData('total-downloads.json', (data: object) => {
            if (data) plugins = data;
        });
        const lastSegment = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        let pluginName = 'chord-lyrics';
        if (lastSegment !== 'plugin') {
            pluginName = lastSegment;
            searchText = pluginName;
        }
        loadData(pluginName);
    });

    function loadData(pluginName: string) {
        const path = `plugins/${pluginName}.json`;
        getData(path, (data: object) => {
            if (data) {
                if (chart) chart.destroy();
                chart = pluginDownloadsOverTime(data, pluginName, chartDefaults);
            } else {
                error = true;
            }
        });
    }
</script>

<nav>
    <Logo/>
    <SearchBar {plugins} {searchText} onSearch={(s) => loadData(s)} {error} maxSuggestions={10} placeholder={'Enter plugin name'}/>
    <Link to="/plugin-stats/top">top</Link>
</nav>

<style>
    nav {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        justify-content: center;
        align-items: center;
    }
    :global(a) {
        text-decoration: none;
        background-color: transparent;
        color: inherit;
        cursor: pointer;
        border-radius: var(--radius);
    }
    :global(a):hover {
        color: var(--color-text-hightlight);
    }
    :global(a[aria-current="page"]) {
        color: var(--color-text-hightlight);
    }
</style>
