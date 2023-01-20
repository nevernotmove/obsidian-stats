export function randomId(): string {
    return Math.floor(Math.random() * 10000000).toString(10);
}

export function formatNumberWithKiloMega(value: number) {
    if (value >= 1000000) return value / 1000000 + 'M';
    if (value >= 1000) return value / 1000 + 'k';
    return value;
}

export function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

export function isDown(key): boolean {
    return key === 'ArrowDown' || key === 'Down';
}

export function isUp(key): boolean {
    return key === 'ArrowUp' || key === 'Up';
}

export function isEsc(key): boolean {
    return key === 'Escape';
}

export function isEnter(key): boolean {
    return key === 'Enter';
}

export function fuzzySearch(search: string, text: string): boolean {
    search = search.toLowerCase();
    text = text.toLowerCase();
    const searchLen = search.length;
    const textLen = text.length;
    if (searchLen > textLen) return false;
    if (searchLen === textLen) return search === text;
    nextChar: for (let s = 0, t = 0; s < searchLen; s++) {
        let searchChar = search.charCodeAt(s);
        while (t < textLen) {
            if (text.charCodeAt(t++) === searchChar) {
                continue nextChar;
            }
        }
        return false;
    }
    return true;
}

export function highlightMatchingLetters(text: string, search: string): string {
    const originalText = text;
    const textSmall = text.toLowerCase();
    const searchSmall = search.toLowerCase();
    const mainTag = '<span>';
    let result: string = '' + mainTag;
    textLoop: for (let t = 0; t < text.length; t++) {
        const textChar = textSmall.charCodeAt(t);
        for (let s = 0; s < searchSmall.length; s++) {
            let searchChar = searchSmall.charCodeAt(s);
            if (textChar === searchChar) {
                result += `<span class="match">${originalText.charAt(t)}</span>`;
                continue textLoop;
            }
        }
        result += originalText.charAt(t);
    }
    result += mainTag;
    return result;
}
