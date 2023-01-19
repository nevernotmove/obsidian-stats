<script lang='ts'>
    export let onSearch: (searchText: string) => void;
    export let options: object;
    export let searchText: string = '';
    export let error: boolean = false;
    export let maxSuggestions: number = 3;
    export let placeholder: string = '';
    export let isTouch = isTouchDevice();

    let suggestions: string[] = [];
    let activeSuggestion: number;
    let showSuggestions: boolean = false;
    $: showSuggestions ? hideOnClickOutside(document.getElementById('searchbar')) : null;
    resetSuggestions();

    function isTouchDevice() {
        return (('ontouchstart' in window) ||
            (navigator.maxTouchPoints > 0) ||
            (navigator.msMaxTouchPoints > 0));
    }

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
                search = option;
                break;
            }
        }
        if (pluginExists) {
            searchText = '';
            onSearch(search);
        } else error = true;
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
                //if (newSuggestions.length >= maxSuggestions) break;
            }
        }
        console.log('Updating suggestions');
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
            let searchChar = search.charCodeAt(s);
            while (t < textLen) {
                if (text === 'chord-lyrics') {
                    //console.log('Comparing search char', String.fromCharCode(searchChar), 'with option char', String.fromCharCode(text.charCodeAt(t)));
                }
                if (text.charCodeAt(t++) === searchChar) {
                    continue nextChar;
                }
            }
            return false;
        }
        return true;
    }

    function highlightMatchingLetters(node: Node): void {
        const originalText: string = node.textContent;
        const text = originalText.toLowerCase();
        const search = searchText.toLowerCase();
        const container = document.createElement('span');
        console.log(search, '@', text);
        textLoop: for (let t = 0; t < text.length; t++) {
            const textChar = text.charCodeAt(t);
            for (let s = 0; s < search.length; s++) {
                let searchChar = search.charCodeAt(s);
                if (textChar === searchChar) {
                    const char = document.createTextNode(String.fromCharCode(textChar));
                    const mark = document.createElement('span');
                    //mark.className = 'match';
                    mark.classList.add('match')
                    mark.appendChild(char);
                    container.appendChild(mark);
                    continue textLoop;
                }
            }
            const char = document.createTextNode(String.fromCharCode(textChar));
            container.appendChild(char);
        }
        //node.textContent = '';
        node.replaceChild(container, node.firstChild)
        node.appendChild(container);
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
                const searchBar = document.getElementById('searchbar') as HTMLElement;
                searchBar.focus();
            }
        } else if (e.key === 'Enter') {
            if (activeSuggestion >= 0) {
                searchText = suggestions[activeSuggestion];
            }
            onSubmit();
        } else if (e.key === 'Escape') {
            resetSuggestions();
        }
    }

    function hideOnClickOutside(element) {
        const outsideClickListener = (event) => {
            if (element.id !== event.target.id) {
                resetSuggestions();
                document.removeEventListener('click', outsideClickListener);
            }
        };
        document.addEventListener('click', outsideClickListener);
    }

</script>

<form
    id='search-form'
    on:submit|preventDefault={onSubmit}
    on:keydown={(e) => onKeyDown(e)}
    autocomplete='off'
    autocapitalize='off'
    spellcheck='false'
>
    <input
        id='searchbar'
        {placeholder}
        bind:value={searchText}
        class:error
        autofocus={isTouch ? '' : 'autofocus'}
        on:input={(e) => onInput(e)}
        on:focus={(e) => onInput(e)}
    />
    <div id='suggestions' class={!showSuggestions || (showSuggestions && suggestions.length === 0) ? 'hidden' : ''}>
        <ul>
            <!-- TODO This ID is bad, just here so highlightMatchingLetters is called on every change for now -->
            {#each suggestions as s, id (String(Math.floor(Math.random() * 10000000)))}
                <li
                    {id}
                    tabindex='-1'
                    on:click={(e) => onSelect(e)}
                    class={activeSuggestion === id ? 'selected' : ''}
                    use:highlightMatchingLetters
                >
                    {s}
                </li>
            {/each}
        </ul>
    </div>
</form>

<style>
    form {
        width: 100%;
    }

    input {
        text-align: var(--search-text-align);
        width: 100%;
        padding: 0.6rem 1rem;
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
        background-color: var(--input-bg-color);
        list-style-type: none;
        margin: 0;
        border: 1px inset var(--color-line);
        border-radius: var(--border-radius);
        overflow: hidden;
    }

    li {
        padding: 0.3em 0.6em;
        cursor: pointer;
    }

    li:hover,
    .selected {
        background-color: var(--input-bg-color-select);
        color: var(--color-text-highlight);
    }
    
    /* TODO Must be global or it will get thrown out, as it's only used in script segment. Is there a better way? */
    :global(.match) {
        color: var(--color-text-highlight);
    }
</style>
