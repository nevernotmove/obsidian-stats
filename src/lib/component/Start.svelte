<script lang="ts">
    import SearchBar from './SearchBar.svelte';
    import Logo from './Logo.svelte';
    import { onMount } from 'svelte';
    import { getPlugins } from '../util/cache';
    import type { PluginInfo } from '../util/cache';
    import { Link, useNavigate } from 'svelte-navigator';

    const navigate = useNavigate();
    let allPlugins: PluginInfo[];

    onMount(() => {
        getPlugins((plugins: PluginInfo[]) => {
            allPlugins = plugins;
        });
    });
</script>

<div id="container">
    <section>
        <div id="logo-container">
            <Logo big={true} />
        </div>
        <div id="slogan">Search for any obsidian plugin</div>
        <SearchBar
            options={allPlugins}
            maxSuggestions={5}
            --search-text-align="center"
            onSearch={(s) => navigate(`/plugin/${s}`)}
        />
        <div id="top">
            <Link to="/top">top downloads</Link>
        </div>
    </section>
</div>

<style>
    #container {
        width: 100%;
        height: 100%;
        display: flex;
    }

    section {
        font-size: 1.3em;
        width: 100%;
        height: 100%;
        max-width: 30rem;
        margin: 0 auto 0 auto;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
    }

    #logo-container {
        pointer-events: none;
        height: 4rem;
        margin-right: 3%;
    }

    #slogan {
        text-align: center;
        color: var(--color-text-muted);
        margin-bottom: 0.8rem;
    }

    #top {
        text-align: center;
        color: var(--color-text-muted);
        margin-top: 0.52rem;
        font-size: 0.8em;
    }
</style>
