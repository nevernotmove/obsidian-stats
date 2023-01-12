<script lang="ts">
    export let onSearch: (searchText: string) => void;
    export let plugins: object;
    export let searchText: string;
    export let error: boolean;
    
    function search() {
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
    }

    function onInput() {
        error = false;
        if (searchText === '') return;
        const suggestions: string[] = [];
        for (const pluginName: string of Object.keys(plugins)) {
            if (fuzzySearch(searchText, pluginName)) {
                suggestions.push(pluginName);
            }
        }
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
</script>

<form on:submit|preventDefault={search}>
    <input autofocus type="text" bind:value={searchText} on:input={onInput} placeholder="Enter plugin name" class:error={error}>
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
</style>