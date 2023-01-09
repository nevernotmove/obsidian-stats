<script lang="ts">
    import {Link} from 'svelte-navigator';
</script>

<nav>
    <Link to="/plugin-stats/plugin-downloads">plugin downloads</Link>
    <Link to="/plugin-stats/most-downloaded">most downloaded</Link>
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
        background-color: var(--color2);
        color: var(--color1);
        border: 1px solid var(--color1);
        cursor: pointer;
        border-radius: .2em;
    }
    :global(a):hover {
        background-color: var(--color5);
    }
    :global(a[aria-current="page"]) {
        background-color: var(--color4);
    }
</style>
