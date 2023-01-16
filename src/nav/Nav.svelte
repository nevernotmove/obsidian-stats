<script lang="ts">
    import {Link, useNavigate} from 'svelte-navigator';
    import {onMount} from "svelte";
    import {getData} from '../cache';
    import Logo from './Logo.svelte';
    import SearchBar from './SearchBar.svelte';

    const navigate = useNavigate();
    let allPlugins: object;
    
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

</script>

<nav>
    <div id="logo-container">
        <Logo/>
    </div>
    <SearchBar options={allPlugins} onSearch={s => navigate(`/plugin/${s}`)} 
               maxSuggestions={10} placeholder={'Enter plugin name'} --search-text-align="left"/>
    <Link to="/top">top</Link>
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
        color: var(--color-text-highlight);
    }
    :global(a[aria-current="page"]) {
        color: var(--color-text-highlight);
    }
    #logo-container {
        height: 100%;
        margin-right: .4rem;
        transform: scale(1.6);
    }
</style>
