<script>
    export let activeChart = 'most-downloaded'
    $: console.log("Nav: switching to", activeChart)
</script>

<nav>
    <button on:click={() => activeChart = 'most-downloaded'}>Most downloaded</button>
    <button on:click={() => activeChart = 'plugin-downloads'}>Plugin downloads</button>
</nav>

<style>
    nav {
    }
    button{
    }
</style>
