<script lang='ts'>
    import { Link, useNavigate } from 'svelte-navigator';
    import { onMount } from 'svelte';
    import { getData, getPlugins } from '../util/cache';
    import type { PluginInfo } from '../util/cache';
    import Logo from './Logo.svelte';
    import SearchBar from './SearchBar.svelte';

    const navigate = useNavigate();
    let allPlugins: PluginInfo[];

    onMount(() => {
        getPlugins((plugins: PluginInfo[]) => {
            allPlugins = plugins;
        });
    });
</script>

<div id='container'>
    <nav>
        <div id='logo-container'>
            <Logo />
        </div>
        <SearchBar
            options={allPlugins}
            onSearch={(s) => navigate(`/plugin/${s}`)}
            maxSuggestions={10}
            placeholder={''}
            --search-text-align='left'
        />
        <span id='top'>
        <Link to='/top'>top</Link>
    </span>
    </nav>
</div>

<style>
    #container {
        display: flex;
        justify-content: center;
    }
    
    nav {
        max-height: 3rem;
        display: flex;
        flex-direction: row;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        width: 40rem;
    }

    #logo-container {
        transform: translate(13%, 0);
        height: 100%;
        aspect-ratio: 1.05/1;
    }

    @media (max-width: 800px) {
        #logo-container,
        #top {
            display: none;
        }
    }
</style>
