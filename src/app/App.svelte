<script lang="ts">
    import {navigate, Route, Router} from "svelte-navigator";
    import Main from '../nav/Main.svelte';
    import Header from './Header.svelte';

    if (window.location.href.endsWith('/plugin-stats')) {
        navigate('/plugin-stats/');
    }
</script>

<!--TODO Might want to remove primary=false and take care-->
<Router primary={false}>
    <Header/>
    <main>
        <Route path="plugin-stats/*">
            <Main/>
        </Route>
    </main>
</Router>

<style>
    main {
        display: flex;
        flex-direction: column;
        row-gap: 3rem;
        height: 100%;
        padding: 0 3rem 3rem 3rem;
    }
</style>

