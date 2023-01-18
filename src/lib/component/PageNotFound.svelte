<script lang='ts'>
    import { Link } from 'svelte-navigator';
</script>

<div id='container'>
    <span id='error'>Page not found</span>
    <span id='text'> We'll keep looking</span> 
    <span id='link'>
        <Link to='/'>Click here to go home in the meantime</Link>
    </span>
</div>

<style>
    #container {
        height: 100%;
        display: flex;
        gap: 1rem;
        flex-direction: column;
        justify-content: center;
    }

    #error {
        color: var(--color-error);
        font-size: 1.5em;
    }

    #error, #text, #link {
        text-align: center;
    }
</style>