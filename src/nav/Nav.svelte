<script lang="ts">
    import {Link, navigate, Route} from 'svelte-navigator';
    import {onMount} from "svelte";
    import {Chart} from 'chart.js';
    import {getData} from '../cache';
    import Logo from '../Logo.svelte';
    import SearchBar from './SearchBar.svelte';
    import ChartView from '../chart/ChartView.svelte';
    import topDownloads from '../chart/topDownloads.js';
    import pluginDownloads from '../chart/pluginDownloads.js';

    let searchText: string;
    let allPlugins: object;
    let singlePlugin: object;
    let error: boolean = false;
    let chart: Chart;

    onMount(() => {
        getData('total-downloads.json', (data: object) => {
            if (data) allPlugins = data;
        });
        // const lastSegment = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);
        // let pluginName = 'chord-lyrics';
        // if (lastSegment !== 'plugin') {
        //     pluginName = lastSegment;
        //     searchText = pluginName;
        // }
        // loadData(pluginName);
    });

    function loadPluginData(pluginName: string) {
        const path = `plugins/${pluginName}.json`;
        getData(path, (data: object) => {
            if (data) {
                if (chart) chart.destroy();
                singlePlugin = data;
                navigate(`/plugin-stats/plugin/${pluginName}`);
            } else {
                error = true;
            }
        });
    }
</script>

<nav>
    <Logo/>
    <SearchBar options={allPlugins} {searchText} onSearch={(s) => loadPluginData(s)} {error} maxSuggestions={10} placeholder={'Enter plugin name'}/>
    <Link to="/plugin-stats/top">top</Link>
</nav>
<Route path="/top"> <ChartView data={allPlugins} draw={topDownloads}/> </Route>
<Route path="/plugin/*"> <ChartView bind:data={singlePlugin} draw={pluginDownloads}/> </Route>

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
