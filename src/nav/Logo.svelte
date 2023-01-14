<script lang="ts">
    import {onMount} from "svelte";
    import {draw} from 'svelte/transition';
    import {quintOut} from 'svelte/easing';
    import {Link} from 'svelte-navigator';

    let start = false;
    onMount(() => start = true);
</script>

<span>
    <Link to="/plugin-stats/">
        <svg viewBox="0 0 2160 2160" xmlns="http://www.w3.org/2000/svg">
            {#if start}
                <path transition:draw="{{duration: 4000, delay: 200, easing: quintOut}}"
                      d="m1355 1988 98-187 192-1172-358-222-501 398 569 1183Z"
                      fill="var(--logo-fill-color)"
                      stroke="var(--logo-line-color)"
                      stroke-width="25px"
                      stroke-linejoin="round"
                />
                <path transition:draw="{{duration: 4000, delay: 300, easing: quintOut}}"
                      d="m1645 629-340-487-18 265 358 222Z"
                      fill="var(--logo-fill-color)"
                      stroke="var(--logo-line-color)"
                      stroke-width="25px"
                      stroke-linejoin="round"
                />
        
                <path transition:draw="{{duration: 3000, delay: 400, easing: quintOut}}"
                      d="m726 469 60 336 501-398 18-265-579 327ZM1355 1988l-520-187-49-996 569 1183Z"
                      fill="var(--logo-fill-color)"
                      stroke="var(--logo-line-color)"
                      stroke-width="25px"
                      stroke-linejoin="round"
                />
        
                <path transition:draw="{{duration: 2000, delay: 500, easing: quintOut}}"
                      d="M726 469 484 985l351 816-49-996-60-336Z"
                      fill="var(--logo-fill-color)"
                      stroke="var(--logo-line-color)"
                      stroke-width="25px"
                      stroke-linejoin="round"
                />
            {/if}
        </svg>
    </Link>
</span>

<style>
    span {
        height: 100%;
    }

    span:hover, span:focus {
        filter: invert(27%) sepia(51%) saturate(2878%) hue-rotate(346deg) brightness(104%) contrast(97%);
    }
    
    svg {
        height: 100%;
        margin-right: .4rem;
        transform: scale(1.6);
    }
</style>