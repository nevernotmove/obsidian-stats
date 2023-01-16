export function randomId(): string {
    return Math.floor(Math.random() * 10000000).toString(10);
}

export function formatNumberWithKiloMega(value: number) {
    if (value >= 1000000) return value / 1000000 + 'M';
    if (value >= 1000) return value / 1000 + 'k';
    return value;
}
