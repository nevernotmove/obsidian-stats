<script lang="ts">
    export let onSearch: (searchText: string) => void;
    export let options: object;
    export let searchText: string = '';
    export let error: boolean = false;
    export let maxSuggestions: number = 3;
    export let placeholder: string = '';

    let suggestions: string[] = [];
    let activeSuggestion: number;
    let showSuggestions: boolean = false;
    $: showSuggestions ? hideOnClickOutside(document.getElementById('search-form').parentElement) : null;
    resetSuggestions();
    
    function resetSuggestions() {
        // suggestions = [];
        activeSuggestion = -1;
        showSuggestions = false;
    }

    function onSubmit() {
        let search = searchText.trim().toLowerCase();
        if (search === '') return;
        let pluginExists = false;
        for (const option of Object.keys(options)) {
            if (option.toLowerCase() === search) {
                pluginExists = true;
                search = option 
                break;
            }
        }
        if (pluginExists) {
            searchText = '';
            onSearch(search);
        }
        else error = true;
        resetSuggestions();
    }

    function onInput() {
        error = false;
        if (searchText === '') {
            showSuggestions = false;
            return;
        }
        const newSuggestions: string[] = [];
        for (const option: string of Object.keys(options)) {
            if (fuzzySearch(searchText, option)) {
                newSuggestions.push(option);
                if (newSuggestions.length >= maxSuggestions) break;
            }
        }
        suggestions = newSuggestions;
        showSuggestions = true;
    }

    function fuzzySearch(search: string, text: string): boolean {
        search = search.toLowerCase();
        text = text.toLowerCase();
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

    function onKeyDown(e) {
        if (e.key === 'ArrowDown' || e.key === 'Down') {
            if (activeSuggestion < maxSuggestions - 1) activeSuggestion++;
        } else if (e.key === 'ArrowUp' || e.key === 'Up') {
            if (activeSuggestion > 0) {
                activeSuggestion--;
            } else {
                const searchBar = document.getElementById("searchbar") as HTMLElement;
                searchBar.focus();
            }
        } else if (e.key === "Enter") {
            if (activeSuggestion >= 0) {
                searchText = suggestions[activeSuggestion];
            }
            onSubmit();
        } else if (e.key === 'Escape') {
            resetSuggestions();
        }
    }
   
    function hideOnClickOutside(element) {
        const outsideClickListener = event => {
            if (!element.contains(event.target) && isVisible(element)) {
                resetSuggestions();
                removeClickListener();
            }
        };

        const removeClickListener = () => {
            document.removeEventListener('click', outsideClickListener);
        };

        document.addEventListener('click', outsideClickListener);
    }

    const isVisible = elem => !!elem && !!(elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length);
</script>

<form 
        id="search-form" 
        on:submit|preventDefault={onSubmit} 
        on:keydown={e => onKeyDown(e)} 
        autocomplete="off">
    <input
            id="searchbar"
            autofocus type="text"
            placeholder={placeholder}
            bind:value={searchText}
            class:error={error}
            on:input={e => onInput(e)}
            on:focus={e => onInput(e)}>
    <div id="suggestions" class={(showSuggestions ? '' : 'hidden')}>
        <ul>
            {#each suggestions as s, id}
                <li
                        id={id}
                        tabindex="-1"
                        on:click={(e) => onSelect(e)}
                        class={(activeSuggestion === id ? 'selected' : '')}>
                    {s}
                </li>
            {/each}
        </ul>
    </div>
</form>

<style>
    form {
        margin: 0;
        padding: 0;
    }

    input {
        width: 30rem;
        background-color: var(--color-background-muted);
        color: inherit;
        padding: .6rem 1rem;
        border: 1px inset var(--color-line);
        border-radius: var(--radius);
        text-align: center;
        font-weight: lighter;
        font-size: 1.6rem;
    }
    
    .error {
        background-color: var(--color-error);
    }

    #suggestions {
        position: relative;
    }

    .hidden {
        display: none;
    }

    ul {
        z-index: 1;
        position: absolute;
        width: 100%;
        padding: 0;
        color: inherit;
        background-color: var(--color-background-muted);
        list-style-type: none;
        margin: 0;
        border: 1px inset var(--color-line);
        border-radius: var(--radius);
    }

    li {
        padding: .3em .6em;
        cursor: pointer;
    }

    li:hover, .selected {
        background-color: var(--color-background-highlight);
        color: var(--color-text-highlight);
    }
</style>