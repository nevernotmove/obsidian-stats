<script lang="ts">
    import {Route, Router} from "svelte-navigator";
    import Nav from '../nav/Nav.svelte';
    import ChartView from '../chart/ChartView.svelte';
</script>

<main>
    <!--TODO Might want to remove primary=false and take care-->
    <Router primary={false}>
        <Route path="plugin-stats/*">
            <Nav/>
            <ChartView/>
        </Route>
    </Router>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        row-gap: 1em;
        height: 100%;
        padding: 2em;
    }
</style>

