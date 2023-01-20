<script lang='ts'>
    import { fuzzySearch, isDown, isEnter, isEsc, isTouchDevice, isUp } from '../util/util';
    import { highlightMatchingLetters } from '../util/util.js';

    export let onSearch: (searchText: string) => void;
    export let options: object;
    export let searchText: string = '';
    export let error: boolean = false;
    export let maxSuggestions: number = 3;
    export let placeholder: string = '';
    export let isTouch = isTouchDevice();

    let suggestions: string[] = [];
    let keyboardSelectionIndex: number;
    let showSuggestions: boolean = false;
    
    $: showSuggestions ? hideOnClickOutside(document.getElementById('searchbar')) : null;
    
    resetSuggestions();

    function resetSuggestions() {
        keyboardSelectionIndex = -1;
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
        updateSuggestions();
    }

    function findNewSuggestions(): string[] {
        const newSuggestions: string[] = [];
        for (const option: string of Object.keys(options)) {
            if (fuzzySearch(searchText, option)) {
                newSuggestions.push(option);
            }
        }
        return newSuggestions;
    }

    function updateSuggestions() {
        if (searchText === '') {
            showSuggestions = false;
            return;
        }
        const newSuggestions = findNewSuggestions();
        suggestions = getSuggestionsToShow(newSuggestions);
        showSuggestions = true;
    }

    function getSuggestionsToShow(newSuggestions: string[]): string[] {
        const numOptions = maxSuggestions <= newSuggestions.length ? maxSuggestions : newSuggestions.length;
        return newSuggestions.slice(0, numOptions); // TODO Select best matches
    }

    function onSelectionClicked(e) {
        let el: HTMLElement = e.target;
        while (el.tagName.toLowerCase() !== 'li') { // TODO Check for a class instead, more resilient to change
            el = el.parentElement;
        }
        searchText = suggestions[el.id];
        onSubmit();
    }

    function goToNextSuggestions() {
        if (keyboardSelectionIndex < suggestions.length - 1) keyboardSelectionIndex++;
    }

    function goToPreviousSuggestion() {
        if (keyboardSelectionIndex > 0) {
            keyboardSelectionIndex--;
        } else {
            const searchBar = document.getElementById('searchbar') as HTMLElement;
            searchBar.focus();
        }
    }

    function onKeyDown(e) {
        const key = e.key;
        if (isDown(key)) goToNextSuggestions();
        else if (isUp(key)) goToPreviousSuggestion();
        else if (isEsc(key)) resetSuggestions();
        else if (isEnter(key)) {
            if (keyboardSelectionIndex >= 0) {
                searchText = suggestions[keyboardSelectionIndex];
            }
            onSubmit();
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
    autocomplete='off'
    autocapitalize='off'
    spellcheck='false'
    on:submit|preventDefault={onSubmit}
    on:keydown={(e) => onKeyDown(e)}
>
    <input
        id='searchbar'
        autofocus={isTouch ? '' : 'autofocus'}
        {placeholder}
        bind:value={searchText}
        class:error
        on:input={(e) => onInput(e)}
        on:focus={(e) => onInput(e)}
    />
    <div id='suggestions' class={!showSuggestions || (showSuggestions && suggestions.length === 0) ? 'hidden' : ''}>
        <ul>
            {#each suggestions as suggestion, index}
                <li
                    id={index}
                    tabindex='-1'
                    on:click={(e) => onSelectionClicked(e)}
                    class={keyboardSelectionIndex === index ? 'selected' : ''}
                >
                    {@html highlightMatchingLetters(suggestion, searchText)}
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
