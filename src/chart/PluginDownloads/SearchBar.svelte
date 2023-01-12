<script lang="ts">

    export let onSearch: (searchText: string) => void;
    export let plugins: object;
    export let searchText: string;
    export let error: boolean;
    export let maxSuggestions: number = 3;

    let suggestions: string[];
    let activeSuggestion: number;
    $: showSuggestions = suggestions.length > 0;
    resetSuggestions();

    function resetSuggestions() {
        suggestions = [];
        activeSuggestion = -1;
    }

    function onSubmit() {
        console.log("onSubmit");
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
        console.log("onInput");
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
        console.log("onSelect");
        const id = e.target.id;
        searchText = suggestions[id];
        onSubmit();
    }
    
    function onKeyDown(e) {
        console.log("onKeyDown");
        if (e.key === 'ArrowDown' || e.key === 'Down') {
            const list = document.getElementById("suggestions").children[0].children as HTMLElement;
            if (activeSuggestion < maxSuggestions - 1) activeSuggestion++;
            const el = list[activeSuggestion] as HTMLElement;
            console.log(activeSuggestion, el);
            el.focus();
        }
        else if (e.key === 'ArrowUp' || e.key === 'Up') {
            const list = document.getElementById("suggestions").children[0].children as HTMLElement;
            if (activeSuggestion > 0) {
                activeSuggestion--;
                const el = list[activeSuggestion] as HTMLElement;
                console.log(activeSuggestion, el);
                el.focus();
            }
            else {
                const searchBar = document.getElementById("searchbar") as HTMLElement;
                console.log(searchBar);
                searchBar.focus();
            }
        }
        else if (e.key === "Enter") {
            console.log("jo enter");
            searchText = suggestions[activeSuggestion];
            onSubmit();
        }
    }
</script>

<!--TODO Add back to input attributes-->
<!-- on:focusout={resetSuggestions} -->
<form on:submit|preventDefault={onSubmit} on:keydown={e => onKeyDown(e)}>
    <input 
            id="searchbar"
            autofocus type="text"
            placeholder="Enter plugin name"
            bind:value={searchText}
            class:error={error}
            on:input={e => onInput(e)} 
            on:focus={e => onInput(e)}>
    {#if showSuggestions}
        <div id="suggestions">
            <ul>
                {#each suggestions as s, id}
                    <li id={id} tabindex="1" on:click={(e) => onSelect(e)}>{s}</li>
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

    #suggestions {
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
    
    li:focus {
        background-color: yellow;
    }

    li:hover, li:focus {
        background-color: var(--color4);
    }
</style>