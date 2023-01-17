<script lang='ts'>
    import { Link, useNavigate } from 'svelte-navigator';
    import { onMount } from 'svelte';
    import { getData } from '../util/cache';
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
        display: flex;
        flex-direction: row;
        gap: 1rem;
        justify-content: center;
        align-items: center;
        width: 40rem;
    }

    #logo-container {
        height: 100%;
    }

    @media (max-width: 800px) {
        #logo-container,
        #top {
            display: none;
        }
    }
</style>
