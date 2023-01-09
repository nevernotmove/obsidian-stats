<script lang="ts">
    import {navigate, Router} from "svelte-navigator";
    import Nav from '../nav/Nav.svelte';
    import ChartView from '../chart/ChartView.svelte';

    navigate('/plugin-stats/most-downloaded')
</script>

<main>
    <!--TODO Might want to remove primary=false and take care-->
    <Router primary={false}> 
        <Nav/>
        <ChartView/>
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

