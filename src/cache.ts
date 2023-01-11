import {get, writable} from 'svelte/store';

const data = writable<Map<string, object>>(new Map<string, object>());

const read = (path: string): object => {
    return get(data).get(path);
}
const write = (path: string, newEntry: object) => {
    data.update((state) => state.set(path, newEntry));
}

export async function getData(path: string,  callback: (data: object) => void): Promise<void> {
    const val = read(path);
    if (val === undefined) {
        await fetch(path)
            .then((r) => r.json())
            .then((jsonData) => {
                write(path, jsonData);
                callback(jsonData);
            });       
        return;
    }
    callback(val);
}
