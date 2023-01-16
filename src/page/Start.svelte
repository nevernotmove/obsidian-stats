<script lang="ts">
    import SearchBar from "../nav/SearchBar.svelte";
    import Logo from "../nav/Logo.svelte";
    import {onMount} from 'svelte';
    import {getData} from '../cache';
    import {useNavigate} from 'svelte-navigator';
    
    const navigate = useNavigate();
    let allPlugins: object;
    
    onMount(() => {
        getData('total-downloads.json', (data: object) => {
            if (data) allPlugins = data;            
        });  
    });
</script>

<main>
    <section>
        <div id="logo-container">
            <Logo big={true}/>
        </div>
        <div id="slogan">Search for any obsidian plugin</div>
        <SearchBar options={allPlugins} maxSuggestions={5} --search-text-align="center" 
                   onSearch={s => navigate(`/plugin/${s}`)}/>
    </section>
</main>

<style>
    main {
        height: 100%;
        display: flex;
        flex-direction: column;

    }

    section {
        margin: 11% auto auto auto;
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