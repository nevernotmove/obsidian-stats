<script lang='ts'>
    import { onMount } from 'svelte';
    import { draw } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';
    import { Link } from 'svelte-navigator';

    export let big = false;
    let start = false;

    let strokeWidth: string = '15px';
    if (big) {
        strokeWidth = '12px';
    }

    onMount(() => (start = true));
</script>

<Link to='/' aria-label="Go to home page">
    <span>
        <svg viewBox='0 0 2160 2160'>
            {#if start && big}
                <path
                    transition:draw|local={{
                        duration: 4000,
                        delay: 200,
                        easing: quintOut
                    }}
                    d='m1355 1988 98-187 192-1172-358-222-501 398 569 1183Z'
                    fill='var(--logo-fill-color)'
                    stroke='var(--logo-line-color)'
                    stroke-width={strokeWidth}
                    stroke-linejoin='round'
                />
                <path
                    transition:draw|local={{
                        duration: 4000,
                        delay: 300,
                        easing: quintOut
                    }}
                    d='m1645 629-340-487-18 265 358 222Z'
                    fill='var(--logo-fill-color)'
                    stroke='var(--logo-line-color)'
                    stroke-width={strokeWidth}
                    stroke-linejoin='round'
                />
    
                <path
                    transition:draw|local={{
                        duration: 3000,
                        delay: 400,
                        easing: quintOut
                    }}
                    d='m726 469 60 336 501-398 18-265-579 327ZM1355 1988l-520-187-49-996 569 1183Z'
                    fill='var(--logo-fill-color)'
                    stroke='var(--logo-line-color)'
                    stroke-width={strokeWidth}
                    stroke-linejoin='round'
                />
    
                <path
                    transition:draw|local={{
                        duration: 2000,
                        delay: 500,
                        easing: quintOut
                    }}
                    d='M726 469 484 985l351 816-49-996-60-336Z'
                    fill='var(--logo-fill-color)'
                    stroke='var(--logo-line-color)'
                    stroke-width={strokeWidth}
                    stroke-linejoin='round'
                />
            {:else if start}
                <path
                    d='m1355 1988 98-187 192-1172-358-222-501 398 569 1183Z'
                    fill='var(--logo-fill-color)'
                    stroke='var(--logo-line-color)'
                    stroke-width={strokeWidth}
                    stroke-linejoin='round'
                />
                <path
                    d='m1645 629-340-487-18 265 358 222Z'
                    fill='var(--logo-fill-color)'
                    stroke='var(--logo-line-color)'
                    stroke-width={strokeWidth}
                    stroke-linejoin='round'
                />
    
                <path
                    d='m726 469 60 336 501-398 18-265-579 327ZM1355 1988l-520-187-49-996 569 1183Z'
                    fill='var(--logo-fill-color)'
                    stroke='var(--logo-line-color)'
                    stroke-width={strokeWidth}
                    stroke-linejoin='round'
                />
    
                <path
                    d='M726 469 484 985l351 816-49-996-60-336Z'
                    fill='var(--logo-fill-color)'
                    stroke='var(--logo-line-color)'
                    stroke-width={strokeWidth}
                    stroke-linejoin='round'
                />
            {/if}
        </svg>
    </span>
</Link>

<style>
    span {
    }

    span:hover,
    span:focus {
        filter: brightness(150%) contrast(110%);
    }

    svg {
        height: 100%;
    }
</style>
