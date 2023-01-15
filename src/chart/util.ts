export function formatNumberWithKiloMega(value: number) {
    if (value >= 1000000) return value / 1000000 + 'M';
    if (value >= 1000) return value / 1000 + 'k';
    return value;
}
