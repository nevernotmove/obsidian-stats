export function randomId(): string {
    return Math.floor(Math.random() * 10000000).toString(10);
}
