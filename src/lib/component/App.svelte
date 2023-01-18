<script lang="ts">
    import { Link, navigate, Route, Router } from 'svelte-navigator';
    import Header from './Header.svelte';
    import Start from './Start.svelte';
    import TopDownloads from './TopDownloads.svelte';
    import PluginDownloads from './PluginDownloads.svelte';
    import PageNotFound from './PageNotFound.svelte';

    if (window.location.href.endsWith('/plugin-stats')) {
        navigate('/plugin-stats/');
    }
</script>

<!--TODO Might want to remove primary=false and take care-->
<Router primary={false} basepath="/plugin-stats">
    <Header />
    <main>
        <Route path="top">
            <TopDownloads />
        </Route>
        <Route path="plugin/:id" let:params>
            <PluginDownloads activePlugin={params.id} />
        </Route>
        <Route path="/">
            <Start />
        </Route>
        <Route>
            <PageNotFound/>
        </Route>
    </main>
</Router>

<style>
    main {
        display: flex;
        flex-direction: column;
        row-gap: 3rem;
        height: 100%;
        padding: 0 5% 5% 5%;
    }
</style>
