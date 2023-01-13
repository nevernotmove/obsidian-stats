<script lang="ts">
    import {Link} from 'svelte-navigator';
    import Logo from '../Logo.svelte';
</script>

<nav>
    <Logo/>
    <Link to="/plugin-stats/most-downloaded">top</Link>
    <Link to="/plugin-stats/plugin-downloads">search</Link>
</nav>

<style>
    nav {
        justify-content: center;
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1em;
    }
    :global(a) {
        text-decoration: none;
        padding: .3em .6em;
        background-color: transparent;
        color: inherit;
        cursor: pointer;
        border-radius: var(--radius);
    }
    :global(a):hover {
        color: var(--color-text-hightlight);
    }
    :global(a[aria-current="page"]) {
        color: var(--color-text-hightlight);
    }
</style>
