<script lang="ts">
    import SearchBar from "./SearchBar.svelte";
    import Logo from "./Logo.svelte";
    import {onMount} from 'svelte';
    import {getData} from '../util/cache';
    import {useNavigate} from 'svelte-navigator';

    const navigate = useNavigate();
    let allPlugins: object;

    onMount(() => {
        getData('total-downloads.json', (data: object) => {
            if (data) allPlugins = data;
        });
    });
</script>

<div id="container">
    <section>
        <div id="logo-container">
            <Logo big={true}/>
        </div>
        <div id="slogan">Search for any obsidian plugin</div>
        <SearchBar options={allPlugins} maxSuggestions={5} --search-text-align="center"
                   onSearch={s => navigate(`/plugin/${s}`)}/>
    </section>
</div>

<style>
    #container {
        width: 100%;
        height: 100%;
        display: flex;
    }

    section {
        width: 100%;
        max-width: 30rem;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: .5rem;
        justify-content: center;
        align-items: center;
    }

    #logo-container {
        width: 25%;
        margin-right: 3%;
    }

    #slogan {
        color: var(--color-text-muted);
        font-size: 1.3rem;
        margin-bottom: .7rem;
    }
</style>