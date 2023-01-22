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
    let keyboardSelectionIndex: number = -1;
    let showSuggestions: boolean = false;

    $: showSuggestions ? hideOnClickOutside(document.getElementById('searchbar')) : null;

    function resetSuggestions() {
        keyboardSelectionIndex = -1;
        showSuggestions = false;
        showBlinkingCursor(true);
    }

    function onSubmit(searchString: string) {
        focusSearchBar(true);
        let search = searchString.trim().toLowerCase();
        if (search === '') return;
        let optionExists = false;
        for (const option of Object.keys(options)) {
            if (option.toLowerCase() === search) {
                optionExists = true;
                search = option;
                break;
            }
        }
        if (optionExists) {
            searchText = '';
            onSearch(search);
        } else error = true;
        resetSuggestions();
    }

    function onSearchInputChange() {
        error = false;
        updateSuggestions();
    }

    function findNewSuggestions(search: string): string[] {
        const newSuggestions: string[] = [];
        for (const option: string of Object.keys(options)) {
            if (fuzzySearch(search, option)) {
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
        const newSuggestions = findNewSuggestions(searchText);
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
        onSubmit(suggestions[el.id]);
    }

    function nextSuggestion() {
        if (keyboardSelectionIndex < suggestions.length - 1) keyboardSelectionIndex++;
    }

    function focusSearchBar(focus: boolean) {
        if (isTouch) return;
        const searchBar = document.getElementById('searchbar') as HTMLInputElement;
        if (focus) {
            searchBar.focus();
            // See https://stackoverflow.com/questions/511088/use-javascript-to-place-cursor-at-end-of-text-in-text-input-element
            setTimeout(function() {
                searchBar.selectionStart = searchBar.selectionEnd = 10000;
                showBlinkingCursor(true);
            }, 0); // Gets called when stack is empty
        } else searchBar.blur();
    }

    function previousSuggestion() {
        if (keyboardSelectionIndex == 0) focusSearchBar(true);
        keyboardSelectionIndex--;
        keyboardSelectionIndex = Math.max(keyboardSelectionIndex, -1);
    }

    function submitSuggestion() {
        const search = keyboardSelectionIndex >= 0 ? suggestions[keyboardSelectionIndex] : searchText;
        onSubmit(search);
    }

    function showBlinkingCursor(show: boolean) {
        const searchBar = document.getElementById('searchbar') as HTMLInputElement;
        if (show) searchBar.classList.remove('disable-cursor');
        else searchBar.classList.add('disable-cursor');
    }

    function onKeyDown(e) {
        const key = e.key;
        if (showSuggestions) {
            if (isDown(key)) nextSuggestion();
            else if (isUp(key)) previousSuggestion();
            else if (isEsc(key)) resetSuggestions();
            else if (isEnter(key)) submitSuggestion();
            if (keyboardSelectionIndex >= 0) {
                showBlinkingCursor(false);
                e.preventDefault();
            }
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

<div id='container'>
    <input
        id='searchbar'
        aria-label="Search"
        autocomplete='off'
        autocapitalize='off'
        spellcheck='false'
        autofocus={isTouch ? '' : 'autofocus'}
        {placeholder}
        bind:value={searchText}
        class:error
        on:keydown={(e) => onKeyDown(e)}
        on:input={(e) => onSearchInputChange(e)}
        on:focus={(e) => onSearchInputChange(e)}
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
</div>

<style>
    #container {
        width: 100%;
    }

    input {
        text-align: var(--search-text-align);
        width: 100%;
        padding: 0.6rem 1rem;
        font-size: 1.6rem;
    }

    /* TODO Must be global or it will get thrown out, as it's only used in script segment. Is there a better way? */
    :global(.disable-cursor) {
        caret-color: transparent;
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
