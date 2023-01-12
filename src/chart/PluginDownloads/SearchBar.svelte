<script lang="ts">

    export let onSearch: (searchText: string) => void;
    export let plugins: object;
    export let searchText: string;
    export let error: boolean;
    export let maxSuggestions: number = 3;

    let suggestions: string[];
    resetSuggestions();
    $: showSuggestions = suggestions.length > 0;

    function resetSuggestions() {
        suggestions = [];
    }

    function onSubmit() {
        searchText = searchText.trim();
        if (searchText === '') return;
        let pluginExists = false;
        for (const pluginName of Object.keys(plugins)) {
            if (pluginName === searchText) {
                pluginExists = true;
                break;
            }
        }
        if (pluginExists) onSearch(searchText);
        else error = true;
        resetSuggestions();
    }

    function onInput() {
        error = false;
        if (searchText === '') {
            resetSuggestions();
            return;
        }
        const newSuggestions: string[] = [];
        for (const pluginName: string of Object.keys(plugins)) {
            if (fuzzySearch(searchText, pluginName)) {
                newSuggestions.push(pluginName);
                if (newSuggestions.length >= maxSuggestions) break;
            }
        }
        suggestions = newSuggestions;
        console.log(suggestions);
    }

    function fuzzySearch(search: string, text: string): boolean {
        const searchLen = search.length;
        const textLen = text.length;
        if (searchLen > textLen) return false;
        if (searchLen === textLen) return search === text;
        nextChar: for (let s = 0, t = 0; s < searchLen; s++) {
            let searchChart = search.charCodeAt(s);
            while (t < textLen) {
                if (text.charCodeAt(t++) === searchChart) {
                    continue nextChar;
                }
            }
            return false;
        }
        return true;
    }

    function onSelect(e) {
        const id = e.target.id;
        searchText = suggestions[id];
        onSubmit();
    }
</script>

<form on:submit|preventDefault={onSubmit}>
    <input 
            autofocus type="text" 
            bind:value={searchText} 
            on:input={onInput} 
            on:focusout={resetSuggestions}
            on:focus={onInput}
            placeholder="Enter plugin name"
            class:error={error}>
    {#if showSuggestions}
        <div class="suggestions">
            <ul>
                {#each suggestions as s, id}
                    <li id={id} on:click={(e) => onSelect(e)}>{s}</li>
                {/each}
            </ul>
        </div>
    {/if}
</form>

<style>
    form {
        padding: .5%;
        margin: auto auto .5% auto;
    }

    input {
        background-color: var(--color2);
        color: var(--color1);
        padding: .3em .6em;
        border-color: var(--color2);
        border: 1px inset var(--color1);
        border-radius: var(--radius);
    }

    .error {
        background-color: var(--color-error);
    }

    .suggestions {
        position: relative;
    }

    ul {
        z-index: 1;
        position: absolute;
        width: 100%;
        padding: 0;
        color: var(--color1);
        background-color: var(--color2);
        list-style-type: none;
        margin: 0;
        border-color: var(--color2);
        border: 1px inset var(--color1);
        border-radius: var(--radius);
    }

    li {
        padding: .3em .6em;
        background-color: var(--color2);
        cursor: pointer;
    }

    li:hover {
        background-color: var(--color4);
    }
</style>