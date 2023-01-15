<script lang="ts">
    import {navigate, Route, Router} from "svelte-navigator";
    import Main from '../nav/Main.svelte';
    
    if (window.location.href.endsWith('/plugin-stats')) {
        navigate('/plugin-stats/') 
    }
</script>

<main>
    <!--TODO Might want to remove primary=false and take care-->
    <Router primary={false}>
        <Route path="plugin-stats/*">
            <Main/>
        </Route>
    </Router>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        row-gap: 3rem;
        height: 100%;
        padding: 3rem 3rem 6rem 3rem;
    }
</style>

